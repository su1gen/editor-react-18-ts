import { findWrapping } from 'prosemirror-transform';
import { safeInsert } from 'prosemirror-utils';
import { CODE_BLOCK, BLOCK_QUOTE, PANEL, HEADINGS_BY_NAME, NORMAL_TEXT } from '../types';
import { removeBlockMarks } from '../../../utils/mark';
import { shouldSplitSelectedNodeOnNodeInsertion } from '../../../utils/insert';
import { withAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';
import { filterChildrenBetween } from '../../../utils';
import { PanelType } from '@atlaskit/adf-schema';
import { CellSelection } from '@atlaskit/editor-tables';
import { transformToCodeBlockAction } from './transform-to-code-block';
export function setBlockType(name) {
  return (state, dispatch) => {
    const {
      nodes
    } = state.schema;

    if (name === NORMAL_TEXT.name && nodes.paragraph) {
      return setNormalText()(state, dispatch);
    }

    const headingBlockType = HEADINGS_BY_NAME[name];

    if (headingBlockType && nodes.heading && headingBlockType.level) {
      return setHeading(headingBlockType.level)(state, dispatch);
    }

    return false;
  };
}
export function setBlockTypeWithAnalytics(name, inputMethod) {
  return (state, dispatch) => {
    const {
      nodes
    } = state.schema;

    if (name === NORMAL_TEXT.name && nodes.paragraph) {
      return setNormalTextWithAnalytics(inputMethod)(state, dispatch);
    }

    const headingBlockType = HEADINGS_BY_NAME[name];

    if (headingBlockType && nodes.heading && headingBlockType.level) {
      return setHeadingWithAnalytics(headingBlockType.level, inputMethod)(state, dispatch);
    }

    return false;
  };
}
export function setNormalText() {
  return function (state, dispatch) {
    const {
      selection,
      schema,
      tr
    } = state;
    const ranges = selection instanceof CellSelection ? selection.ranges : [selection];
    ranges.forEach(({
      $from,
      $to
    }) => {
      tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph);
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function withCurrentHeadingLevel(fn) {
  return (state, dispatch, view) => {
    // Find all headings and paragraphs of text
    const {
      heading,
      paragraph
    } = state.schema.nodes;
    const nodes = filterChildrenBetween(state.doc, state.selection.from, state.selection.to, node => {
      return node.type === heading || node.type === paragraph;
    }); // Check each paragraph and/or heading and check for consistent level

    let level;

    for (let node of nodes) {
      const nodeLevel = node.node.type === heading ? node.node.attrs.level : 0;

      if (!level) {
        level = nodeLevel;
      } else if (nodeLevel !== level) {
        // Conflict in level, therefore inconsistent and undefined
        level = undefined;
        break;
      }
    }

    return fn(level)(state, dispatch, view);
  };
}

export function setNormalTextWithAnalytics(inputMethod) {
  return withCurrentHeadingLevel(previousHeadingLevel => withAnalytics({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
    attributes: {
      inputMethod,
      newHeadingLevel: 0,
      previousHeadingLevel
    }
  })(setNormalText()));
}
export function setHeading(level) {
  return function (state, dispatch) {
    const {
      selection,
      schema,
      tr
    } = state;
    const ranges = selection instanceof CellSelection ? selection.ranges : [selection];
    ranges.forEach(({
      $from,
      $to
    }) => {
      tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, {
        level
      });
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
export const setHeadingWithAnalytics = (newHeadingLevel, inputMethod) => {
  return withCurrentHeadingLevel(previousHeadingLevel => withAnalytics({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
    attributes: {
      inputMethod,
      newHeadingLevel,
      previousHeadingLevel
    }
  })(setHeading(newHeadingLevel)));
};
export function insertBlockType(name) {
  return function (state, dispatch) {
    const {
      nodes
    } = state.schema;

    switch (name) {
      case BLOCK_QUOTE.name:
        if (nodes.paragraph && nodes.blockquote) {
          return wrapSelectionIn(nodes.blockquote)(state, dispatch);
        }

        break;

      case CODE_BLOCK.name:
        if (nodes.codeBlock) {
          return insertCodeBlock()(state, dispatch);
        }

        break;

      case PANEL.name:
        if (nodes.panel && nodes.paragraph) {
          return wrapSelectionIn(nodes.panel)(state, dispatch);
        }

        break;
    }

    return false;
  };
}
export const insertBlockTypesWithAnalytics = (name, inputMethod) => {
  switch (name) {
    case BLOCK_QUOTE.name:
      return withAnalytics({
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
        attributes: {
          inputMethod
        }
      })(insertBlockType(name));

    case CODE_BLOCK.name:
      return withAnalytics({
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
        attributes: {
          inputMethod: inputMethod
        },
        eventType: EVENT_TYPE.TRACK
      })(insertBlockType(name));

    case PANEL.name:
      return withAnalytics({
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.PANEL,
        attributes: {
          inputMethod: inputMethod,
          panelType: PanelType.INFO // only info panels can be inserted from toolbar

        },
        eventType: EVENT_TYPE.TRACK
      })(insertBlockType(name));

    default:
      return insertBlockType(name);
  }
};
/**
 * Function will add wrapping node.
 * 1. If currently selected blocks can be wrapped in the wrapper type it will wrap them.
 * 2. If current block can not be wrapped inside wrapping block it will create a new block below selection,
 *  and set selection on it.
 */

function wrapSelectionIn(type) {
  return function (state, dispatch) {
    let {
      tr
    } = state;
    const {
      $from,
      $to
    } = state.selection;
    const {
      alignment,
      indentation
    } = state.schema.marks;
    /** Alignment or Indentation is not valid inside block types */

    const removeAlignTr = removeBlockMarks(state, [alignment, indentation]);
    tr = removeAlignTr || tr;
    const range = $from.blockRange($to);
    const wrapping = range && findWrapping(range, type);

    if (range && wrapping) {
      tr.wrap(range, wrapping).scrollIntoView();
    } else {
      /** We always want to append a block type */
      safeInsert(type.createAndFill())(tr).scrollIntoView();
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
/**
 * Function will insert code block at current selection if block is empty or below current selection and set focus on it.
 */


function insertCodeBlock() {
  return function (state, dispatch) {
    var _state$selection$$fro;

    let {
      tr
    } = state;
    const {
      from
    } = state.selection;
    const {
      codeBlock
    } = state.schema.nodes;
    const grandParentNodeType = (_state$selection$$fro = state.selection.$from.node(-1)) === null || _state$selection$$fro === void 0 ? void 0 : _state$selection$$fro.type;
    const parentNodeType = state.selection.$from.parent.type;
    /** We always want to append a codeBlock unless we're inserting into a paragraph
     * AND it's a valid child of the grandparent node.
     * Insert the current selection as codeBlock content unless it contains nodes other
     * than paragraphs and inline.
     */

    const canInsertCodeBlock = shouldSplitSelectedNodeOnNodeInsertion({
      parentNodeType,
      grandParentNodeType,
      content: codeBlock.createAndFill()
    }) && contentAllowedInCodeBlock(state);

    if (canInsertCodeBlock) {
      tr = transformToCodeBlockAction(state, from);
    } else {
      safeInsert(codeBlock.createAndFill())(tr).scrollIntoView();
    }

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
/**
 * Check if the current selection contains any nodes that are not permitted
 * as codeBlock child nodes. Note that this allows paragraphs and inline nodes
 * as we extract their text content.
 */


function contentAllowedInCodeBlock(state) {
  const {
    $from,
    $to
  } = state.selection;
  let isAllowedChild = true;
  state.doc.nodesBetween($from.pos, $to.pos, node => {
    if (!isAllowedChild) {
      return false;
    }

    return isAllowedChild = node.type === state.schema.nodes.listItem || node.type === state.schema.nodes.bulletList || node.type === state.schema.nodes.orderedList || node.type === state.schema.nodes.paragraph || node.isInline || node.isText;
  });
  return isAllowedChild;
}

export const cleanUpAtTheStartOfDocument = (state, dispatch) => {
  const {
    $cursor
  } = state.selection;

  if ($cursor && !$cursor.nodeBefore && !$cursor.nodeAfter && $cursor.pos === 1) {
    const {
      tr,
      schema
    } = state;
    const {
      paragraph
    } = schema.nodes;
    const {
      parent
    } = $cursor;
    /**
     * Use cases:
     * 1. Change `heading` to `paragraph`
     * 2. Remove block marks
     *
     * NOTE: We already know it's an empty doc so it's safe to use 0
     */

    tr.setNodeMarkup(0, paragraph, parent.attrs, []);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  return false;
};
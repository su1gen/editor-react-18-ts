function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
  return function (state, dispatch) {
    var nodes = state.schema.nodes;

    if (name === NORMAL_TEXT.name && nodes.paragraph) {
      return setNormalText()(state, dispatch);
    }

    var headingBlockType = HEADINGS_BY_NAME[name];

    if (headingBlockType && nodes.heading && headingBlockType.level) {
      return setHeading(headingBlockType.level)(state, dispatch);
    }

    return false;
  };
}
export function setBlockTypeWithAnalytics(name, inputMethod) {
  return function (state, dispatch) {
    var nodes = state.schema.nodes;

    if (name === NORMAL_TEXT.name && nodes.paragraph) {
      return setNormalTextWithAnalytics(inputMethod)(state, dispatch);
    }

    var headingBlockType = HEADINGS_BY_NAME[name];

    if (headingBlockType && nodes.heading && headingBlockType.level) {
      return setHeadingWithAnalytics(headingBlockType.level, inputMethod)(state, dispatch);
    }

    return false;
  };
}
export function setNormalText() {
  return function (state, dispatch) {
    var selection = state.selection,
        schema = state.schema,
        tr = state.tr;
    var ranges = selection instanceof CellSelection ? selection.ranges : [selection];
    ranges.forEach(function (_ref) {
      var $from = _ref.$from,
          $to = _ref.$to;
      tr.setBlockType($from.pos, $to.pos, schema.nodes.paragraph);
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function withCurrentHeadingLevel(fn) {
  return function (state, dispatch, view) {
    // Find all headings and paragraphs of text
    var _state$schema$nodes = state.schema.nodes,
        heading = _state$schema$nodes.heading,
        paragraph = _state$schema$nodes.paragraph;
    var nodes = filterChildrenBetween(state.doc, state.selection.from, state.selection.to, function (node) {
      return node.type === heading || node.type === paragraph;
    }); // Check each paragraph and/or heading and check for consistent level

    var level;

    var _iterator = _createForOfIteratorHelper(nodes),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var node = _step.value;
        var nodeLevel = node.node.type === heading ? node.node.attrs.level : 0;

        if (!level) {
          level = nodeLevel;
        } else if (nodeLevel !== level) {
          // Conflict in level, therefore inconsistent and undefined
          level = undefined;
          break;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return fn(level)(state, dispatch, view);
  };
}

export function setNormalTextWithAnalytics(inputMethod) {
  return withCurrentHeadingLevel(function (previousHeadingLevel) {
    return withAnalytics({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod: inputMethod,
        newHeadingLevel: 0,
        previousHeadingLevel: previousHeadingLevel
      }
    })(setNormalText());
  });
}
export function setHeading(level) {
  return function (state, dispatch) {
    var selection = state.selection,
        schema = state.schema,
        tr = state.tr;
    var ranges = selection instanceof CellSelection ? selection.ranges : [selection];
    ranges.forEach(function (_ref2) {
      var $from = _ref2.$from,
          $to = _ref2.$to;
      tr.setBlockType($from.pos, $to.pos, schema.nodes.heading, {
        level: level
      });
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
export var setHeadingWithAnalytics = function setHeadingWithAnalytics(newHeadingLevel, inputMethod) {
  return withCurrentHeadingLevel(function (previousHeadingLevel) {
    return withAnalytics({
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod: inputMethod,
        newHeadingLevel: newHeadingLevel,
        previousHeadingLevel: previousHeadingLevel
      }
    })(setHeading(newHeadingLevel));
  });
};
export function insertBlockType(name) {
  return function (state, dispatch) {
    var nodes = state.schema.nodes;

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
export var insertBlockTypesWithAnalytics = function insertBlockTypesWithAnalytics(name, inputMethod) {
  switch (name) {
    case BLOCK_QUOTE.name:
      return withAnalytics({
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
        attributes: {
          inputMethod: inputMethod
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
    var tr = state.tr;
    var _state$selection = state.selection,
        $from = _state$selection.$from,
        $to = _state$selection.$to;
    var _state$schema$marks = state.schema.marks,
        alignment = _state$schema$marks.alignment,
        indentation = _state$schema$marks.indentation;
    /** Alignment or Indentation is not valid inside block types */

    var removeAlignTr = removeBlockMarks(state, [alignment, indentation]);
    tr = removeAlignTr || tr;
    var range = $from.blockRange($to);
    var wrapping = range && findWrapping(range, type);

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

    var tr = state.tr;
    var from = state.selection.from;
    var codeBlock = state.schema.nodes.codeBlock;
    var grandParentNodeType = (_state$selection$$fro = state.selection.$from.node(-1)) === null || _state$selection$$fro === void 0 ? void 0 : _state$selection$$fro.type;
    var parentNodeType = state.selection.$from.parent.type;
    /** We always want to append a codeBlock unless we're inserting into a paragraph
     * AND it's a valid child of the grandparent node.
     * Insert the current selection as codeBlock content unless it contains nodes other
     * than paragraphs and inline.
     */

    var canInsertCodeBlock = shouldSplitSelectedNodeOnNodeInsertion({
      parentNodeType: parentNodeType,
      grandParentNodeType: grandParentNodeType,
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
  var _state$selection2 = state.selection,
      $from = _state$selection2.$from,
      $to = _state$selection2.$to;
  var isAllowedChild = true;
  state.doc.nodesBetween($from.pos, $to.pos, function (node) {
    if (!isAllowedChild) {
      return false;
    }

    return isAllowedChild = node.type === state.schema.nodes.listItem || node.type === state.schema.nodes.bulletList || node.type === state.schema.nodes.orderedList || node.type === state.schema.nodes.paragraph || node.isInline || node.isText;
  });
  return isAllowedChild;
}

export var cleanUpAtTheStartOfDocument = function cleanUpAtTheStartOfDocument(state, dispatch) {
  var _ref3 = state.selection,
      $cursor = _ref3.$cursor;

  if ($cursor && !$cursor.nodeBefore && !$cursor.nodeAfter && $cursor.pos === 1) {
    var tr = state.tr,
        schema = state.schema;
    var paragraph = schema.nodes.paragraph;
    var parent = $cursor.parent;
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
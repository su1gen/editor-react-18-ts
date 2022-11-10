import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { Fragment } from 'prosemirror-model';
import { NodeSelection, Selection, TextSelection } from 'prosemirror-state';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { canMoveDown, canMoveUp } from '../utils';
import { withAnalytics, EVENT_TYPE, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../plugins/analytics';
export function preventDefault() {
  return function () {
    return true;
  };
}
export function insertNewLine() {
  return function (state, dispatch) {
    var $from = state.selection.$from;
    var parent = $from.parent;
    var hardBreak = state.schema.nodes.hardBreak;

    if (hardBreak) {
      var hardBreakNode = hardBreak.createChecked();

      if (parent && parent.type.validContent(Fragment.from(hardBreakNode))) {
        if (dispatch) {
          dispatch(state.tr.replaceSelectionWith(hardBreakNode, false));
        }

        return true;
      }
    }

    if (state.selection instanceof TextSelection) {
      if (dispatch) {
        dispatch(state.tr.insertText('\n'));
      }

      return true;
    }

    return false;
  };
}
export var insertNewLineWithAnalytics = withAnalytics({
  action: ACTION.INSERTED,
  actionSubject: ACTION_SUBJECT.TEXT,
  actionSubjectId: ACTION_SUBJECT_ID.LINE_BREAK,
  eventType: EVENT_TYPE.TRACK
})(insertNewLine());
export var createNewParagraphAbove = function createNewParagraphAbove(state, dispatch) {
  var append = false;

  if (!canMoveUp(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
};
export var createNewParagraphBelow = function createNewParagraphBelow(state, dispatch) {
  var append = true;

  if (!canMoveDown(state) && canCreateParagraphNear(state)) {
    createParagraphNear(append)(state, dispatch);
    return true;
  }

  return false;
};

function canCreateParagraphNear(state) {
  var $from = state.selection.$from;
  var node = $from.node($from.depth);
  var insideCodeBlock = !!node && node.type === state.schema.nodes.codeBlock;
  var isNodeSelection = state.selection instanceof NodeSelection;
  return $from.depth > 1 || isNodeSelection || insideCodeBlock;
}

export function createParagraphNear() {
  var append = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return function (state, dispatch) {
    var paragraph = state.schema.nodes.paragraph;

    if (!paragraph) {
      return false;
    }

    var insertPos;

    if (state.selection instanceof TextSelection) {
      if (topLevelNodeIsEmptyTextBlock(state)) {
        return false;
      }

      insertPos = getInsertPosFromTextBlock(state, append);
    } else {
      insertPos = getInsertPosFromNonTextBlock(state, append);
    }

    var tr = state.tr.insert(insertPos, paragraph.createAndFill());
    tr.setSelection(TextSelection.create(tr.doc, insertPos + 1));

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}

function getInsertPosFromTextBlock(state, append) {
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to;
  var pos;

  if (!append) {
    pos = $from.start(0);
  } else {
    pos = $to.end(0);
  }

  return pos;
}

function getInsertPosFromNonTextBlock(state, append) {
  var _state$selection2 = state.selection,
      $from = _state$selection2.$from,
      $to = _state$selection2.$to;
  var nodeAtSelection = state.selection instanceof NodeSelection && state.doc.nodeAt(state.selection.$anchor.pos);
  var isMediaSelection = nodeAtSelection && nodeAtSelection.type.name === 'mediaGroup';
  var pos;

  if (!append) {
    // The start position is different with text block because it starts from 0
    pos = $from.start($from.depth); // The depth is different with text block because it starts from 0

    pos = $from.depth > 0 && !isMediaSelection ? pos - 1 : pos;
  } else {
    pos = $to.end($to.depth);
    pos = $to.depth > 0 && !isMediaSelection ? pos + 1 : pos;
  }

  return pos;
}

function topLevelNodeIsEmptyTextBlock(state) {
  var topLevelNode = state.selection.$from.node(1);
  return topLevelNode.isTextblock && topLevelNode.type !== state.schema.nodes.codeBlock && topLevelNode.nodeSize === 2;
}

export function addParagraphAtEnd(tr) {
  var paragraph = tr.doc.type.schema.nodes.paragraph,
      doc = tr.doc;

  if (doc.lastChild && !(doc.lastChild.type === paragraph && doc.lastChild.content.size === 0)) {
    if (paragraph) {
      tr.insert(doc.content.size, paragraph.createAndFill());
    }
  }

  tr.setSelection(TextSelection.create(tr.doc, tr.doc.content.size - 1));
  tr.scrollIntoView();
}
export function createParagraphAtEnd() {
  return function (state, dispatch) {
    var tr = state.tr;
    addParagraphAtEnd(tr);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
}
export var changeImageAlignment = function changeImageAlignment(align) {
  return function (state, dispatch) {
    var _state$selection3 = state.selection,
        from = _state$selection3.from,
        to = _state$selection3.to;
    var tr = state.tr;
    state.doc.nodesBetween(from, to, function (node, pos) {
      if (node.type === state.schema.nodes.mediaSingle) {
        tr.setNodeMarkup(pos, undefined, _objectSpread(_objectSpread({}, node.attrs), {}, {
          layout: align === 'center' ? 'center' : "align-".concat(align)
        }));
      }
    });

    if (tr.docChanged && dispatch) {
      dispatch(tr.scrollIntoView());
      return true;
    }

    return false;
  };
};
export var createToggleBlockMarkOnRange = function createToggleBlockMarkOnRange(markType, getAttrs, allowedBlocks) {
  return function (from, to, tr, state) {
    var markApplied = false;
    state.doc.nodesBetween(from, to, function (node, pos, parent) {
      if (!node.type.isBlock) {
        return false;
      }

      if ((!allowedBlocks || (Array.isArray(allowedBlocks) ? allowedBlocks.indexOf(node.type) > -1 : allowedBlocks(state.schema, node, parent))) && parent.type.allowsMarkType(markType)) {
        var oldMarks = node.marks.filter(function (mark) {
          return mark.type === markType;
        });

        var _prevAttrs = oldMarks.length ? oldMarks[0].attrs : undefined;

        var newAttrs = getAttrs(_prevAttrs, node);

        if (newAttrs !== undefined) {
          tr.setNodeMarkup(pos, node.type, node.attrs, node.marks.filter(function (mark) {
            return !markType.excludes(mark.type);
          }).concat(newAttrs === false ? [] : markType.create(newAttrs)));
          markApplied = true;
        }
      }

      return;
    });
    return markApplied;
  };
};
/**
 * Toggles block mark based on the return type of `getAttrs`.
 * This is similar to ProseMirror's `getAttrs` from `AttributeSpec`
 * return `false` to remove the mark.
 * return `undefined for no-op.
 * return an `object` to update the mark.
 */

export var toggleBlockMark = function toggleBlockMark(markType, getAttrs, allowedBlocks) {
  return function (state, dispatch) {
    var markApplied = false;
    var tr = state.tr;
    var toggleBlockMarkOnRange = createToggleBlockMarkOnRange(markType, getAttrs, allowedBlocks);

    if (state.selection instanceof CellSelection) {
      state.selection.forEachCell(function (cell, pos) {
        markApplied = toggleBlockMarkOnRange(pos, pos + cell.nodeSize, tr, state);
      });
    } else {
      var _state$selection4 = state.selection,
          from = _state$selection4.from,
          to = _state$selection4.to;
      markApplied = toggleBlockMarkOnRange(from, to, tr, state);
    }

    if (markApplied && tr.docChanged) {
      if (dispatch) {
        dispatch(tr.scrollIntoView());
      }

      return true;
    }

    return false;
  };
};
export var clearEditorContent = function clearEditorContent(state, dispatch) {
  var tr = state.tr;
  tr.replace(0, state.doc.nodeSize - 2);
  tr.setSelection(Selection.atStart(tr.doc));

  if (dispatch) {
    dispatch(tr);
    return true;
  }

  return false;
};
import { useRef, useEffect } from 'react';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { FORMATTING_MARK_TYPES, FORMATTING_NODE_TYPES } from './commands/clear-formatting';
export var nodeLen = function nodeLen(node) {
  return node.nodeType === 3 && node.nodeValue ? node.nodeValue.length : node.childNodes.length;
};
export var isIgnorable = function isIgnorable(dom) {
  return dom.pmViewDesc && dom.pmViewDesc.size === 0;
};
export var isBlockNode = function isBlockNode(dom) {
  var desc = dom.pmViewDesc;
  return desc && desc.node && desc.node.isBlock;
};
export var domIndex = function domIndex(node) {
  if (node) {
    for (var index = 0;; index++) {
      node = node.previousSibling;

      if (!node) {
        return index;
      }
    }
  }

  return;
};
export var hasCode = function hasCode(state, pos) {
  var code = state.schema.marks.code;
  var node = pos >= 0 && state.doc.nodeAt(pos);

  if (node) {
    return !!node.marks.filter(function (mark) {
      return mark.type === code;
    }).length;
  }

  return false;
};
/**
 * Determine if a mark (with specific attribute values) exists anywhere in the selection.
 */

export var markActive = function markActive(state, mark) {
  var _state$selection = state.selection,
      from = _state$selection.from,
      to = _state$selection.to,
      empty = _state$selection.empty; // When the selection is empty, only the active marks apply.

  if (empty) {
    return !!mark.isInSet(state.tr.storedMarks || state.selection.$from.marks());
  } // For a non-collapsed selection, the marks on the nodes matter.


  var found = false;
  state.doc.nodesBetween(from, to, function (node) {
    found = found || mark.isInSet(node.marks);
  });
  return found;
};
/**
 * Determine if a mark of a specific type exists anywhere in the selection.
 */

export var anyMarkActive = function anyMarkActive(state, markType) {
  var _state$selection2 = state.selection,
      $from = _state$selection2.$from,
      from = _state$selection2.from,
      to = _state$selection2.to,
      empty = _state$selection2.empty;

  if (empty) {
    return !!markType.isInSet(state.storedMarks || $from.marks());
  }

  var rangeHasMark = false;

  if (state.selection instanceof CellSelection) {
    state.selection.forEachCell(function (cell, cellPos) {
      var from = cellPos;
      var to = cellPos + cell.nodeSize;

      if (!rangeHasMark) {
        rangeHasMark = state.doc.rangeHasMark(from, to, markType);
      }
    });
  } else {
    rangeHasMark = state.doc.rangeHasMark(from, to, markType);
  }

  return rangeHasMark;
};

var blockStylingIsPresent = function blockStylingIsPresent(state) {
  var _state$selection3 = state.selection,
      from = _state$selection3.from,
      to = _state$selection3.to;
  var isBlockStyling = false;
  state.doc.nodesBetween(from, to, function (node) {
    if (FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
      isBlockStyling = true;
      return false;
    }

    return true;
  });
  return isBlockStyling;
};

var marksArePresent = function marksArePresent(state) {
  var activeMarkTypes = FORMATTING_MARK_TYPES.filter(function (mark) {
    if (!!state.schema.marks[mark]) {
      var _state$selection4 = state.selection,
          $from = _state$selection4.$from,
          empty = _state$selection4.empty;
      var marks = state.schema.marks;

      if (empty) {
        return !!marks[mark].isInSet(state.storedMarks || $from.marks());
      }

      return anyMarkActive(state, marks[mark]);
    }

    return false;
  });
  return activeMarkTypes.length > 0;
};

export var checkFormattingIsPresent = function checkFormattingIsPresent(state) {
  return marksArePresent(state) || blockStylingIsPresent(state);
};
export var usePreviousObjectState = function usePreviousObjectState(value) {
  var ref = useRef([]);
  useEffect(function () {
    ref.current = value;
  });
  return ref.current;
};
export var compareItemsArrays = function compareItemsArrays(items, prevItems) {
  return items && items.filter(function (item) {
    return !prevItems.includes(item);
  });
};
export var isArrayContainsContent = function isArrayContainsContent(items, content) {
  return items.filter(function (item) {
    return item.content === content;
  }).length > 0;
};
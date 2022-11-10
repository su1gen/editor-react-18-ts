"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePreviousObjectState = exports.nodeLen = exports.markActive = exports.isIgnorable = exports.isBlockNode = exports.isArrayContainsContent = exports.hasCode = exports.domIndex = exports.compareItemsArrays = exports.checkFormattingIsPresent = exports.anyMarkActive = void 0;

var _react = require("react");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _clearFormatting = require("./commands/clear-formatting");

var nodeLen = function nodeLen(node) {
  return node.nodeType === 3 && node.nodeValue ? node.nodeValue.length : node.childNodes.length;
};

exports.nodeLen = nodeLen;

var isIgnorable = function isIgnorable(dom) {
  return dom.pmViewDesc && dom.pmViewDesc.size === 0;
};

exports.isIgnorable = isIgnorable;

var isBlockNode = function isBlockNode(dom) {
  var desc = dom.pmViewDesc;
  return desc && desc.node && desc.node.isBlock;
};

exports.isBlockNode = isBlockNode;

var domIndex = function domIndex(node) {
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

exports.domIndex = domIndex;

var hasCode = function hasCode(state, pos) {
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


exports.hasCode = hasCode;

var markActive = function markActive(state, mark) {
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


exports.markActive = markActive;

var anyMarkActive = function anyMarkActive(state, markType) {
  var _state$selection2 = state.selection,
      $from = _state$selection2.$from,
      from = _state$selection2.from,
      to = _state$selection2.to,
      empty = _state$selection2.empty;

  if (empty) {
    return !!markType.isInSet(state.storedMarks || $from.marks());
  }

  var rangeHasMark = false;

  if (state.selection instanceof _cellSelection.CellSelection) {
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

exports.anyMarkActive = anyMarkActive;

var blockStylingIsPresent = function blockStylingIsPresent(state) {
  var _state$selection3 = state.selection,
      from = _state$selection3.from,
      to = _state$selection3.to;
  var isBlockStyling = false;
  state.doc.nodesBetween(from, to, function (node) {
    if (_clearFormatting.FORMATTING_NODE_TYPES.indexOf(node.type.name) !== -1) {
      isBlockStyling = true;
      return false;
    }

    return true;
  });
  return isBlockStyling;
};

var marksArePresent = function marksArePresent(state) {
  var activeMarkTypes = _clearFormatting.FORMATTING_MARK_TYPES.filter(function (mark) {
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

var checkFormattingIsPresent = function checkFormattingIsPresent(state) {
  return marksArePresent(state) || blockStylingIsPresent(state);
};

exports.checkFormattingIsPresent = checkFormattingIsPresent;

var usePreviousObjectState = function usePreviousObjectState(value) {
  var ref = (0, _react.useRef)([]);
  (0, _react.useEffect)(function () {
    ref.current = value;
  });
  return ref.current;
};

exports.usePreviousObjectState = usePreviousObjectState;

var compareItemsArrays = function compareItemsArrays(items, prevItems) {
  return items && items.filter(function (item) {
    return !prevItems.includes(item);
  });
};

exports.compareItemsArrays = compareItemsArrays;

var isArrayContainsContent = function isArrayContainsContent(items, content) {
  return items.filter(function (item) {
    return item.content === content;
  }).length > 0;
};

exports.isArrayContainsContent = isArrayContainsContent;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixColumnStructure = exports.fixColumnSizes = exports.deleteActiveLayoutNode = exports.createDefaultLayoutSection = exports.TWO_COL_LAYOUTS = exports.THREE_COL_LAYOUTS = exports.ONE_COL_LAYOUTS = void 0;
exports.forceSectionToPresetLayout = forceSectionToPresetLayout;
exports.setPresetLayout = exports.insertLayoutColumnsWithAnalytics = exports.insertLayoutColumns = exports.getSelectedLayout = exports.getPresetLayout = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _slice = require("../../utils/slice");

var _utils = require("../../utils");

var _enums = require("../analytics/types/enums");

var _utils2 = require("../analytics/utils");

var _nodeEvents = require("../analytics/types/node-events");

var _pluginKey = require("./pm-plugins/plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var ONE_COL_LAYOUTS = ['single'];
exports.ONE_COL_LAYOUTS = ONE_COL_LAYOUTS;
var TWO_COL_LAYOUTS = ['two_equal', 'two_left_sidebar', 'two_right_sidebar'];
exports.TWO_COL_LAYOUTS = TWO_COL_LAYOUTS;
var THREE_COL_LAYOUTS = ['three_equal', 'three_with_sidebars'];
exports.THREE_COL_LAYOUTS = THREE_COL_LAYOUTS;

var getWidthsForPreset = function getWidthsForPreset(presetLayout) {
  switch (presetLayout) {
    case 'single':
      return [100];

    case 'two_equal':
      return [50, 50];

    case 'three_equal':
      return [33.33, 33.33, 33.33];

    case 'two_left_sidebar':
      return [33.33, 66.66];

    case 'two_right_sidebar':
      return [66.66, 33.33];

    case 'three_with_sidebars':
      return [25, 50, 25];
  }
};
/**
 * Finds layout preset based on the width attrs of all the layoutColumn nodes
 * inside the layoutSection node
 */


var getPresetLayout = function getPresetLayout(section) {
  var widths = (0, _slice.mapChildren)(section, function (column) {
    return column.attrs.width;
  }).join(',');

  switch (widths) {
    case '100':
      return 'single';

    case '33.33,33.33,33.33':
      return 'three_equal';

    case '25,50,25':
      return 'three_with_sidebars';

    case '50,50':
      return 'two_equal';

    case '33.33,66.66':
      return 'two_left_sidebar';

    case '66.66,33.33':
      return 'two_right_sidebar';
  }

  return;
};

exports.getPresetLayout = getPresetLayout;

var getSelectedLayout = function getSelectedLayout(maybeLayoutSection, current) {
  if (maybeLayoutSection && getPresetLayout(maybeLayoutSection)) {
    return getPresetLayout(maybeLayoutSection) || current;
  }

  return current;
};

exports.getSelectedLayout = getSelectedLayout;

var createDefaultLayoutSection = function createDefaultLayoutSection(state) {
  var _state$schema$nodes = state.schema.nodes,
      layoutSection = _state$schema$nodes.layoutSection,
      layoutColumn = _state$schema$nodes.layoutColumn; // create a 50-50 layout by default

  var columns = _prosemirrorModel.Fragment.fromArray([layoutColumn.createAndFill({
    width: 50
  }), layoutColumn.createAndFill({
    width: 50
  })]);

  return layoutSection.createAndFill(undefined, columns);
};

exports.createDefaultLayoutSection = createDefaultLayoutSection;

var insertLayoutColumns = function insertLayoutColumns(state, dispatch) {
  if (dispatch) {
    dispatch((0, _prosemirrorUtils.safeInsert)(createDefaultLayoutSection(state))(state.tr));
  }

  return true;
};

exports.insertLayoutColumns = insertLayoutColumns;

var insertLayoutColumnsWithAnalytics = function insertLayoutColumnsWithAnalytics(inputMethod) {
  return (0, _utils2.withAnalytics)({
    action: _enums.ACTION.INSERTED,
    actionSubject: _enums.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _enums.ACTION_SUBJECT_ID.LAYOUT,
    attributes: {
      inputMethod: inputMethod
    },
    eventType: _enums.EVENT_TYPE.TRACK
  })(insertLayoutColumns);
};
/**
 * Add a column to the right of existing layout
 */


exports.insertLayoutColumnsWithAnalytics = insertLayoutColumnsWithAnalytics;

function addColumn(schema, pos) {
  return function (tr) {
    tr.replaceWith(tr.mapping.map(pos), tr.mapping.map(pos), schema.nodes.layoutColumn.createAndFill());
  };
}

function removeLastColumnInLayout(column, columnPos, insideRightEdgePos) {
  return function (tr) {
    if ((0, _utils.isEmptyDocument)(column)) {
      tr.replaceRange(tr.mapping.map(columnPos - 1), tr.mapping.map(insideRightEdgePos), _prosemirrorModel.Slice.empty);
    } else {
      tr.replaceRange(tr.mapping.map(columnPos - 1), tr.mapping.map(columnPos + 1), _prosemirrorModel.Slice.empty);
    }
  };
}

var fromTwoColsToThree = addColumn;
var fromOneColToTwo = addColumn;
var fromTwoColsToOne = removeLastColumnInLayout;
var fromThreeColsToTwo = removeLastColumnInLayout;

var fromOneColToThree = function fromOneColToThree(schema, pos) {
  return function (tr) {
    addColumn(schema, pos)(tr);
    addColumn(schema, pos)(tr);
  };
};

var fromThreeColstoOne = function fromThreeColstoOne(node, tr, insideRightEdgePos) {
  var thirdColumn = node.content.child(2);
  fromThreeColsToTwo(thirdColumn, insideRightEdgePos - thirdColumn.nodeSize, insideRightEdgePos)(tr);
  var secondColumn = node.content.child(1);
  fromTwoColsToOne(secondColumn, insideRightEdgePos - thirdColumn.nodeSize - secondColumn.nodeSize, insideRightEdgePos)(tr);
};
/**
 * Handles switching from 2 -> 3 cols, or 3 -> 2 cols
 * Switching from 2 -> 3 just adds a new one at the end
 * Switching from 3 -> 2 moves all the content of the third col inside the second before
 * removing it
 */


function forceColumnStructure(state, node, pos, presetLayout) {
  var tr = state.tr;
  var insideRightEdgeOfLayoutSection = pos + node.nodeSize - 1;
  var numCols = node.childCount; // 3 columns -> 2 columns

  if (TWO_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 3) {
    var thirdColumn = node.content.child(2);
    var columnPos = insideRightEdgeOfLayoutSection - thirdColumn.nodeSize;
    fromThreeColsToTwo(thirdColumn, columnPos, insideRightEdgeOfLayoutSection)(tr); // 2 columns -> 3 columns
  } else if (THREE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 2) {
    fromTwoColsToThree(state.schema, insideRightEdgeOfLayoutSection)(tr); // 2 columns -> 1 column
  } else if (ONE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 2) {
    var secondColumn = node.content.child(1);

    var _columnPos = insideRightEdgeOfLayoutSection - secondColumn.nodeSize;

    fromTwoColsToOne(secondColumn, _columnPos, insideRightEdgeOfLayoutSection)(tr); // 3 columns -> 1 column
  } else if (ONE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 3) {
    fromThreeColstoOne(node, tr, insideRightEdgeOfLayoutSection); // 1 column -> 2 columns
  } else if (TWO_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 1) {
    fromOneColToTwo(state.schema, insideRightEdgeOfLayoutSection)(tr); // 1 column -> 3 columns
  } else if (THREE_COL_LAYOUTS.indexOf(presetLayout) >= 0 && numCols === 1) {
    fromOneColToThree(state.schema, insideRightEdgeOfLayoutSection)(tr);
  }

  return tr;
}

function columnWidth(node, schema, widths) {
  var layoutColumn = schema.nodes.layoutColumn;
  var truncatedWidths = widths.map(function (w) {
    return Number(w.toFixed(2));
  });
  return (0, _slice.flatmap)(node.content, function (column, idx) {
    if (column.type === layoutColumn) {
      return layoutColumn.create(_objectSpread(_objectSpread({}, column.attrs), {}, {
        width: truncatedWidths[idx]
      }), column.content, column.marks);
    } else {
      return column;
    }
  });
}

function forceColumnWidths(state, tr, pos, presetLayout) {
  var node = tr.doc.nodeAt(pos);

  if (!node) {
    return tr;
  }

  return tr.replaceWith(pos + 1, pos + node.nodeSize - 1, columnWidth(node, state.schema, getWidthsForPreset(presetLayout)));
}

function forceSectionToPresetLayout(state, node, pos, presetLayout) {
  var tr = forceColumnStructure(state, node, pos, presetLayout); // save the selection here, since forcing column widths causes a change over the
  // entire layoutSection, which remaps selection to the end. not remapping here
  // is safe because the structure is no longer changing.

  var selection = tr.selection;
  tr = forceColumnWidths(state, tr, pos, presetLayout);
  var selectionPos$ = tr.doc.resolve(selection.$from.pos);
  return tr.setSelection(state.selection instanceof _prosemirrorState.NodeSelection ? new _prosemirrorState.NodeSelection(selectionPos$) : new _prosemirrorState.TextSelection(selectionPos$));
}

var setPresetLayout = function setPresetLayout(layout) {
  return function (state, dispatch) {
    var _ref = _pluginKey.pluginKey.getState(state),
        pos = _ref.pos,
        selectedLayout = _ref.selectedLayout;

    if (selectedLayout === layout || pos === null) {
      return false;
    }

    var node = state.doc.nodeAt(pos);

    if (!node) {
      return false;
    }

    var tr = forceSectionToPresetLayout(state, node, pos, layout);

    if (tr) {
      tr = (0, _utils2.addAnalytics)(state, tr, {
        action: _enums.ACTION.CHANGED_LAYOUT,
        actionSubject: _enums.ACTION_SUBJECT.LAYOUT,
        attributes: {
          previousLayout: formatLayoutName(selectedLayout),
          newLayout: formatLayoutName(layout)
        },
        eventType: _enums.EVENT_TYPE.TRACK
      });
      tr.setMeta('scrollIntoView', false);

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};

exports.setPresetLayout = setPresetLayout;

function layoutNeedChanges(node) {
  return !getPresetLayout(node);
}

function getLayoutChange(node, pos, schema) {
  if (node.type === schema.nodes.layoutSection) {
    if (!layoutNeedChanges(node)) {
      return;
    }

    var presetLayout = node.childCount === 2 ? 'two_equal' : node.childCount === 3 ? 'three_equal' : 'single';
    var fixedColumns = columnWidth(node, schema, getWidthsForPreset(presetLayout));
    return {
      from: pos + 1,
      to: pos + node.nodeSize - 1,
      slice: new _prosemirrorModel.Slice(fixedColumns, 0, 0)
    };
  }
}

var fixColumnSizes = function fixColumnSizes(changedTr, state) {
  var layoutSection = state.schema.nodes.layoutSection;
  var change;
  var range = (0, _utils.getStepRange)(changedTr);

  if (!range) {
    return undefined;
  }

  changedTr.doc.nodesBetween(range.from, range.to, function (node, pos) {
    if (node.type !== layoutSection) {
      return true; // Check all internal nodes expect for layout section
    } // Node is a section


    if (layoutNeedChanges(node)) {
      change = getLayoutChange(node, pos, state.schema);
    }

    return false; // We dont go deep, We dont accept nested layouts
  }); // Hack to prevent: https://product-fabric.atlassian.net/browse/ED-7523
  // By default prosemirror try to recreate the node with the default attributes
  // The default attribute is invalid adf though. when this happen the node after
  // current position is a layout section

  var $pos = changedTr.doc.resolve(range.to);

  if ($pos.depth > 0) {
    // 'range.to' position could resolve to doc, in this ResolvedPos.after will throws
    var pos = $pos.after();
    var node = changedTr.doc.nodeAt(pos);

    if (node && node.type === layoutSection && layoutNeedChanges(node)) {
      change = getLayoutChange(node, pos, state.schema);
    }
  }

  return change;
};

exports.fixColumnSizes = fixColumnSizes;

var fixColumnStructure = function fixColumnStructure(state) {
  var _ref2 = _pluginKey.pluginKey.getState(state),
      pos = _ref2.pos,
      selectedLayout = _ref2.selectedLayout;

  if (pos !== null && selectedLayout) {
    var node = state.doc.nodeAt(pos);

    if (node && node.childCount !== getWidthsForPreset(selectedLayout).length) {
      return forceSectionToPresetLayout(state, node, pos, selectedLayout);
    }
  }

  return;
};

exports.fixColumnStructure = fixColumnStructure;

var deleteActiveLayoutNode = function deleteActiveLayoutNode(state, dispatch) {
  var _ref3 = _pluginKey.pluginKey.getState(state),
      pos = _ref3.pos,
      selectedLayout = _ref3.selectedLayout;

  if (pos !== null) {
    var node = state.doc.nodeAt(pos);

    if (dispatch) {
      var tr = state.tr.delete(pos, pos + node.nodeSize);
      tr = (0, _utils2.addAnalytics)(state, tr, {
        action: _enums.ACTION.DELETED,
        actionSubject: _enums.ACTION_SUBJECT.LAYOUT,
        attributes: {
          layout: formatLayoutName(selectedLayout)
        },
        eventType: _enums.EVENT_TYPE.TRACK
      });
      dispatch(tr);
    }

    return true;
  }

  return false;
};

exports.deleteActiveLayoutNode = deleteActiveLayoutNode;

var formatLayoutName = function formatLayoutName(layout) {
  switch (layout) {
    case 'single':
      return _nodeEvents.LAYOUT_TYPE.SINGLE_COL;

    case 'two_equal':
      return _nodeEvents.LAYOUT_TYPE.TWO_COLS_EQUAL;

    case 'three_equal':
      return _nodeEvents.LAYOUT_TYPE.THREE_COLS_EQUAL;

    case 'two_left_sidebar':
      return _nodeEvents.LAYOUT_TYPE.LEFT_SIDEBAR;

    case 'two_right_sidebar':
      return _nodeEvents.LAYOUT_TYPE.RIGHT_SIDEBAR;

    case 'three_with_sidebars':
      return _nodeEvents.LAYOUT_TYPE.THREE_WITH_SIDEBARS;
  }
};
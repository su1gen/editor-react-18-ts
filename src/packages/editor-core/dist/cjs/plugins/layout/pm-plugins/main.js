"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DEFAULT_LAYOUT = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorUtils = require("prosemirror-utils");

var _commands = require("../../../utils/commands");

var _utils = require("../../selection/utils");

var _actions = require("../actions");

var _pluginKey = require("./plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var DEFAULT_LAYOUT = 'two_equal';
exports.DEFAULT_LAYOUT = DEFAULT_LAYOUT;

var isWholeSelectionInsideLayoutColumn = function isWholeSelectionInsideLayoutColumn(state) {
  // Since findParentNodeOfType doesn't check if selection.to shares the parent, we do this check ourselves
  var fromParent = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.layoutColumn)(state.selection);

  if (fromParent) {
    var isToPosInsideSameLayoutColumn = state.selection.from < fromParent.pos + fromParent.node.nodeSize;
    return isToPosInsideSameLayoutColumn;
  }

  return false;
};

var moveCursorToNextColumn = function moveCursorToNextColumn(state, dispatch) {
  var selection = state.selection;
  var _state$schema$nodes = state.schema.nodes,
      layoutColumn = _state$schema$nodes.layoutColumn,
      layoutSection = _state$schema$nodes.layoutSection;
  var section = (0, _prosemirrorUtils.findParentNodeOfType)(layoutSection)(selection);
  var column = (0, _prosemirrorUtils.findParentNodeOfType)(layoutColumn)(selection);

  if (column.node !== section.node.lastChild) {
    var $nextColumn = state.doc.resolve(column.pos + column.node.nodeSize);

    var shiftedSelection = _prosemirrorState.TextSelection.findFrom($nextColumn, 1);

    if (dispatch) {
      dispatch(state.tr.setSelection(shiftedSelection));
    }
  }

  return true;
}; // TODO: Look at memoize-one-ing this fn


var getNodeDecoration = function getNodeDecoration(pos, node) {
  return [_prosemirrorView.Decoration.node(pos, pos + node.nodeSize, {
    class: 'selected'
  })];
};

var getInitialPluginState = function getInitialPluginState(options, state) {
  var maybeLayoutSection = (0, _prosemirrorUtils.findParentNodeOfType)(state.schema.nodes.layoutSection)(state.selection);
  var allowBreakout = options.allowBreakout || false;
  var addSidebarLayouts = options.UNSAFE_addSidebarLayouts || false;
  var allowSingleColumnLayout = options.UNSAFE_allowSingleColumnLayout || false;
  var pos = maybeLayoutSection ? maybeLayoutSection.pos : null;
  var selectedLayout = (0, _actions.getSelectedLayout)(maybeLayoutSection && maybeLayoutSection.node, DEFAULT_LAYOUT);
  return {
    pos: pos,
    allowBreakout: allowBreakout,
    addSidebarLayouts: addSidebarLayouts,
    selectedLayout: selectedLayout,
    allowSingleColumnLayout: allowSingleColumnLayout
  };
};

var _default = function _default(options) {
  return new _safePlugin.SafePlugin({
    key: _pluginKey.pluginKey,
    state: {
      init: function init(_, state) {
        return getInitialPluginState(options, state);
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        if (tr.docChanged || tr.selectionSet) {
          var layoutSection = newState.schema.nodes.layoutSection,
              selection = newState.selection;
          var maybeLayoutSection = (0, _prosemirrorUtils.findParentNodeOfType)(layoutSection)(selection) || (0, _prosemirrorUtils.findSelectedNodeOfType)([layoutSection])(selection);

          var newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            pos: maybeLayoutSection ? maybeLayoutSection.pos : null,
            selectedLayout: (0, _actions.getSelectedLayout)(maybeLayoutSection && maybeLayoutSection.node, pluginState.selectedLayout)
          });

          return newPluginState;
        }

        return pluginState;
      }
    },
    props: {
      decorations: function decorations(state) {
        var layoutState = _pluginKey.pluginKey.getState(state);

        if (layoutState.pos !== null) {
          return _prosemirrorView.DecorationSet.create(state.doc, getNodeDecoration(layoutState.pos, state.doc.nodeAt(layoutState.pos)));
        }

        return undefined;
      },
      handleKeyDown: (0, _prosemirrorKeymap.keydownHandler)({
        Tab: (0, _commands.filter)(isWholeSelectionInsideLayoutColumn, moveCursorToNextColumn)
      }),
      handleClickOn: (0, _utils.createSelectionClickHandler)(['layoutColumn'], function (target) {
        return target.hasAttribute('data-layout-section') || target.hasAttribute('data-layout-column');
      }, {
        useLongPressSelection: options.useLongPressSelection || false,
        getNodeSelectionPos: function getNodeSelectionPos(state, nodePos) {
          return state.doc.resolve(nodePos).before();
        }
      })
    },
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var changes = [];
      transactions.forEach(function (prevTr) {
        // remap change segments across the transaction set
        changes.forEach(function (change) {
          return {
            from: prevTr.mapping.map(change.from),
            to: prevTr.mapping.map(change.to),
            slice: change.slice
          };
        }); // don't consider transactions that don't mutate

        if (!prevTr.docChanged) {
          return;
        }

        var change = (0, _actions.fixColumnSizes)(prevTr, newState);

        if (change) {
          changes.push(change);
        }
      });

      if (changes.length) {
        var tr = newState.tr;
        var selection = newState.selection.toJSON();
        changes.forEach(function (change) {
          tr.replaceRange(change.from, change.to, change.slice);
        }); // selecting and deleting across columns in 3 col layouts can remove
        // a layoutColumn so we fix the structure here

        tr = (0, _actions.fixColumnStructure)(newState) || tr;

        if (tr.docChanged) {
          tr.setSelection(_prosemirrorState.Selection.fromJSON(tr.doc, selection));
          tr.setMeta('addToHistory', false);
          return tr;
        }
      }

      return;
    }
  });
};

exports.default = _default;
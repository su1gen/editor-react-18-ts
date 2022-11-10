import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TextSelection, Selection } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { keydownHandler } from 'prosemirror-keymap';
import { findParentNodeOfType, findSelectedNodeOfType } from 'prosemirror-utils';
import { filter } from '../../../utils/commands';
import { createSelectionClickHandler } from '../../selection/utils';
import { fixColumnSizes, fixColumnStructure, getSelectedLayout } from '../actions';
import { pluginKey } from './plugin-key';
export var DEFAULT_LAYOUT = 'two_equal';

var isWholeSelectionInsideLayoutColumn = function isWholeSelectionInsideLayoutColumn(state) {
  // Since findParentNodeOfType doesn't check if selection.to shares the parent, we do this check ourselves
  var fromParent = findParentNodeOfType(state.schema.nodes.layoutColumn)(state.selection);

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
  var section = findParentNodeOfType(layoutSection)(selection);
  var column = findParentNodeOfType(layoutColumn)(selection);

  if (column.node !== section.node.lastChild) {
    var $nextColumn = state.doc.resolve(column.pos + column.node.nodeSize);
    var shiftedSelection = TextSelection.findFrom($nextColumn, 1);

    if (dispatch) {
      dispatch(state.tr.setSelection(shiftedSelection));
    }
  }

  return true;
}; // TODO: Look at memoize-one-ing this fn


var getNodeDecoration = function getNodeDecoration(pos, node) {
  return [Decoration.node(pos, pos + node.nodeSize, {
    class: 'selected'
  })];
};

var getInitialPluginState = function getInitialPluginState(options, state) {
  var maybeLayoutSection = findParentNodeOfType(state.schema.nodes.layoutSection)(state.selection);
  var allowBreakout = options.allowBreakout || false;
  var addSidebarLayouts = options.UNSAFE_addSidebarLayouts || false;
  var allowSingleColumnLayout = options.UNSAFE_allowSingleColumnLayout || false;
  var pos = maybeLayoutSection ? maybeLayoutSection.pos : null;
  var selectedLayout = getSelectedLayout(maybeLayoutSection && maybeLayoutSection.node, DEFAULT_LAYOUT);
  return {
    pos: pos,
    allowBreakout: allowBreakout,
    addSidebarLayouts: addSidebarLayouts,
    selectedLayout: selectedLayout,
    allowSingleColumnLayout: allowSingleColumnLayout
  };
};

export default (function (options) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_, state) {
        return getInitialPluginState(options, state);
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        if (tr.docChanged || tr.selectionSet) {
          var layoutSection = newState.schema.nodes.layoutSection,
              selection = newState.selection;
          var maybeLayoutSection = findParentNodeOfType(layoutSection)(selection) || findSelectedNodeOfType([layoutSection])(selection);

          var newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            pos: maybeLayoutSection ? maybeLayoutSection.pos : null,
            selectedLayout: getSelectedLayout(maybeLayoutSection && maybeLayoutSection.node, pluginState.selectedLayout)
          });

          return newPluginState;
        }

        return pluginState;
      }
    },
    props: {
      decorations: function decorations(state) {
        var layoutState = pluginKey.getState(state);

        if (layoutState.pos !== null) {
          return DecorationSet.create(state.doc, getNodeDecoration(layoutState.pos, state.doc.nodeAt(layoutState.pos)));
        }

        return undefined;
      },
      handleKeyDown: keydownHandler({
        Tab: filter(isWholeSelectionInsideLayoutColumn, moveCursorToNextColumn)
      }),
      handleClickOn: createSelectionClickHandler(['layoutColumn'], function (target) {
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

        var change = fixColumnSizes(prevTr, newState);

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

        tr = fixColumnStructure(newState) || tr;

        if (tr.docChanged) {
          tr.setSelection(Selection.fromJSON(tr.doc, selection));
          tr.setMeta('addToHistory', false);
          return tr;
        }
      }

      return;
    }
  });
});
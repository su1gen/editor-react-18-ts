import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { NodeSelection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { pluginFactory } from '../../utils/plugin-state-factory';
import { reducer } from './reducer';
import { selectionPluginKey } from './types';
import { getDecorations, isSelectableContainerNode } from './utils';

var handleDocChanged = function handleDocChanged(tr, pluginState) {
  // in some collab edge cases mapping decorations could throw an error
  try {
    if (pluginState.decorationSet.find().length === 0 && (!tr.selectionSet || getDecorations(tr).find().length === 0)) {
      return pluginState;
    }

    var decorationSet = pluginState.decorationSet.map(tr.mapping, tr.doc);
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      decorationSet: decorationSet
    });
  } catch (error) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      decorationSet: DecorationSet.empty
    });
  }
};

var handleSelectionChanged = function handleSelectionChanged(tr, pluginState) {
  // Reset relative selection pos when user clicks to select a node
  if ((tr.selection instanceof NodeSelection && isSelectableContainerNode(tr.selection.node) || tr.selection instanceof CellSelection) && !tr.getMeta(selectionPluginKey)) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      selectionRelativeToNode: undefined
    });
  }

  return pluginState;
};

var _pluginFactory = pluginFactory(selectionPluginKey, reducer, {
  onDocChanged: handleDocChanged,
  onSelectionChanged: handleSelectionChanged
}),
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState,
    createPluginState = _pluginFactory.createPluginState;

export { createCommand, getPluginState, createPluginState };
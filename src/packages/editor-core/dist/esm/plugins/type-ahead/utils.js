import { TextSelection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';
export var findTypeAheadDecorations = function findTypeAheadDecorations(state) {
  var selection = state.selection;

  var _typeAheadPluginKey$g = typeAheadPluginKey.getState(state),
      decorationSet = _typeAheadPluginKey$g.decorationSet;

  if (!decorationSet || decorationSet === DecorationSet.empty || !(selection instanceof TextSelection) || !selection.$cursor) {
    return null;
  }

  var pos = selection.$cursor.pos;
  var decoration = decorationSet.find(pos, pos, function (spec) {
    return spec === null || spec === void 0 ? void 0 : spec.isTypeAheadDecoration;
  });

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return decoration[0];
};
export var isTypeAheadHandler = function isTypeAheadHandler(handler) {
  return handler && Object.values(TypeAheadAvailableNodes).includes(handler.id) && typeof handler.trigger === 'string' && typeof handler.selectItem === 'function' && typeof handler.getItems === 'function';
};
export var isTypeAheadOpen = function isTypeAheadOpen(editorState) {
  var _typeAheadPluginKey$g2, _typeAheadPluginKey$g3;

  return (typeAheadPluginKey === null || typeAheadPluginKey === void 0 ? void 0 : (_typeAheadPluginKey$g2 = typeAheadPluginKey.getState(editorState)) === null || _typeAheadPluginKey$g2 === void 0 ? void 0 : (_typeAheadPluginKey$g3 = _typeAheadPluginKey$g2.decorationSet) === null || _typeAheadPluginKey$g3 === void 0 ? void 0 : _typeAheadPluginKey$g3.find().length) > 0;
};
export var getPluginState = function getPluginState(editorState) {
  return typeAheadPluginKey.getState(editorState);
};
export var getTypeAheadHandler = function getTypeAheadHandler(editorState) {
  return typeAheadPluginKey.getState(editorState).triggerHandler;
};
export var getTypeAheadQuery = function getTypeAheadQuery(editorState) {
  return typeAheadPluginKey.getState(editorState).query;
};
export var isTypeAheadAllowed = function isTypeAheadAllowed(state) {
  var isOpen = isTypeAheadOpen(state); // if the TypeAhead is open
  // we should not allow it

  return !isOpen;
};
export var findHandler = function findHandler(id, state) {
  var pluginState = typeAheadPluginKey.getState(state);

  if (!pluginState || !pluginState.typeAheadHandlers || pluginState.typeAheadHandlers.length === 0) {
    return null;
  }

  var typeAheadHandlers = pluginState.typeAheadHandlers;
  return typeAheadHandlers.find(function (h) {
    return h.id === id;
  }) || null;
};
export var findHandlerByTrigger = function findHandlerByTrigger(_ref) {
  var trigger = _ref.trigger,
      editorState = _ref.editorState;
  var pluginState = typeAheadPluginKey.getState(editorState);

  if (!pluginState || !pluginState.typeAheadHandlers || pluginState.typeAheadHandlers.length === 0) {
    return null;
  }

  var typeAheadHandlers = pluginState.typeAheadHandlers;
  return typeAheadHandlers.find(function (h) {
    return h.trigger === trigger;
  }) || null;
};
export var moveSelectedIndex = function moveSelectedIndex(_ref2) {
  var editorView = _ref2.editorView,
      direction = _ref2.direction;
  return function () {
    var typeAheadState = getPluginState(editorView.state);

    if (!typeAheadState) {
      return;
    }

    var selectedIndex = typeAheadState.selectedIndex,
        items = typeAheadState.items;
    var stats = typeAheadState.stats instanceof StatsModifier ? typeAheadState.stats : new StatsModifier();
    var nextIndex;

    if (direction === 'next') {
      stats.increaseArrowDown();
      nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
    } else {
      stats.increaseArrowUp();
      nextIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
    }

    updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
  };
};
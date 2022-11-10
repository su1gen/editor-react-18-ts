import { TextSelection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';
export const findTypeAheadDecorations = state => {
  const {
    selection
  } = state;
  const {
    decorationSet
  } = typeAheadPluginKey.getState(state);

  if (!decorationSet || decorationSet === DecorationSet.empty || !(selection instanceof TextSelection) || !selection.$cursor) {
    return null;
  }

  const {
    $cursor: {
      pos
    }
  } = selection;
  const decoration = decorationSet.find(pos, pos, spec => spec === null || spec === void 0 ? void 0 : spec.isTypeAheadDecoration);

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return decoration[0];
};
export const isTypeAheadHandler = handler => {
  return handler && Object.values(TypeAheadAvailableNodes).includes(handler.id) && typeof handler.trigger === 'string' && typeof handler.selectItem === 'function' && typeof handler.getItems === 'function';
};
export const isTypeAheadOpen = editorState => {
  var _typeAheadPluginKey$g, _typeAheadPluginKey$g2;

  return (typeAheadPluginKey === null || typeAheadPluginKey === void 0 ? void 0 : (_typeAheadPluginKey$g = typeAheadPluginKey.getState(editorState)) === null || _typeAheadPluginKey$g === void 0 ? void 0 : (_typeAheadPluginKey$g2 = _typeAheadPluginKey$g.decorationSet) === null || _typeAheadPluginKey$g2 === void 0 ? void 0 : _typeAheadPluginKey$g2.find().length) > 0;
};
export const getPluginState = editorState => {
  return typeAheadPluginKey.getState(editorState);
};
export const getTypeAheadHandler = editorState => {
  return typeAheadPluginKey.getState(editorState).triggerHandler;
};
export const getTypeAheadQuery = editorState => {
  return typeAheadPluginKey.getState(editorState).query;
};
export const isTypeAheadAllowed = state => {
  const isOpen = isTypeAheadOpen(state); // if the TypeAhead is open
  // we should not allow it

  return !isOpen;
};
export const findHandler = (id, state) => {
  const pluginState = typeAheadPluginKey.getState(state);

  if (!pluginState || !pluginState.typeAheadHandlers || pluginState.typeAheadHandlers.length === 0) {
    return null;
  }

  const {
    typeAheadHandlers
  } = pluginState;
  return typeAheadHandlers.find(h => h.id === id) || null;
};
export const findHandlerByTrigger = ({
  trigger,
  editorState
}) => {
  const pluginState = typeAheadPluginKey.getState(editorState);

  if (!pluginState || !pluginState.typeAheadHandlers || pluginState.typeAheadHandlers.length === 0) {
    return null;
  }

  const {
    typeAheadHandlers
  } = pluginState;
  return typeAheadHandlers.find(h => h.trigger === trigger) || null;
};
export const moveSelectedIndex = ({
  editorView,
  direction
}) => () => {
  const typeAheadState = getPluginState(editorView.state);

  if (!typeAheadState) {
    return;
  }

  const {
    selectedIndex,
    items
  } = typeAheadState;
  const stats = typeAheadState.stats instanceof StatsModifier ? typeAheadState.stats : new StatsModifier();
  let nextIndex;

  if (direction === 'next') {
    stats.increaseArrowDown();
    nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
  } else {
    stats.increaseArrowUp();
    nextIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
  }

  updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
};
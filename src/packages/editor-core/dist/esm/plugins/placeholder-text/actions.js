import { pluginKey } from './plugin-key';
export var showPlaceholderFloatingToolbar = function showPlaceholderFloatingToolbar(state, dispatch) {
  var tr = state.tr;

  if (!state.selection.empty) {
    tr.deleteSelection();
  }

  tr.setMeta(pluginKey, {
    showInsertPanelAt: tr.selection.anchor
  });
  tr.scrollIntoView();
  dispatch(tr);
  return true;
};
export var insertPlaceholderTextAtSelection = function insertPlaceholderTextAtSelection(value) {
  return function (state, dispatch) {
    dispatch(state.tr.replaceSelectionWith(state.schema.nodes.placeholder.createChecked({
      text: value
    })).setMeta(pluginKey, {
      showInsertPanelAt: null
    }).scrollIntoView());
    return true;
  };
};
export var hidePlaceholderFloatingToolbar = function hidePlaceholderFloatingToolbar(state, dispatch) {
  dispatch(state.tr.setMeta(pluginKey, {
    showInsertPanelAt: null
  }));
  return true;
};
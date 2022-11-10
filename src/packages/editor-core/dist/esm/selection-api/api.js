import { setSelectionRelativeToNode as setSelectionRelativeToNodeOriginalCommand } from '../plugins/selection/commands';
import { getPluginState as _getSelectionPluginState } from '../plugins/selection/plugin-factory';
export var createEditorSelectionAPI = function createEditorSelectionAPI() {
  return {
    getSelectionPluginState: function getSelectionPluginState(state) {
      return _getSelectionPluginState(state);
    },
    setSelectionRelativeToNode: function setSelectionRelativeToNode(_ref) {
      var selectionRelativeToNode = _ref.selectionRelativeToNode,
          selection = _ref.selection;
      return function (state) {
        var tr = state.tr;

        var fakeDispatch = function fakeDispatch(_tr) {
          tr = _tr;
        };

        setSelectionRelativeToNodeOriginalCommand(selectionRelativeToNode, selection)(state, fakeDispatch);
        return tr;
      };
    }
  };
};
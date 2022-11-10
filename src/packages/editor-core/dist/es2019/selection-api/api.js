import { setSelectionRelativeToNode as setSelectionRelativeToNodeOriginalCommand } from '../plugins/selection/commands';
import { getPluginState as getSelectionPluginState } from '../plugins/selection/plugin-factory';
export const createEditorSelectionAPI = () => {
  return {
    getSelectionPluginState: state => {
      return getSelectionPluginState(state);
    },
    setSelectionRelativeToNode: ({
      selectionRelativeToNode,
      selection
    }) => state => {
      let tr = state.tr;

      const fakeDispatch = _tr => {
        tr = _tr;
      };

      setSelectionRelativeToNodeOriginalCommand(selectionRelativeToNode, selection)(state, fakeDispatch);
      return tr;
    }
  };
};
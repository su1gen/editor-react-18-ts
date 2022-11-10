import { pluginKey as undoPluginKey } from './pm-plugins/plugin-key';
export var attachInputMeta = function attachInputMeta(inputSource) {
  return function (command) {
    return function (state, dispatch) {
      var customTr = state.tr;

      var fakeDispatch = function fakeDispatch(tr) {
        customTr = tr;
      };

      command(state, fakeDispatch);

      if (!customTr || !customTr.docChanged) {
        return false;
      }

      customTr.setMeta(undoPluginKey, inputSource);

      if (dispatch) {
        dispatch(customTr);
      }

      return true;
    };
  };
};
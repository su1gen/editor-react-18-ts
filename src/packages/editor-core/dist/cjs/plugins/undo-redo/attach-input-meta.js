"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachInputMeta = void 0;

var _pluginKey = require("./pm-plugins/plugin-key");

var attachInputMeta = function attachInputMeta(inputSource) {
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

      customTr.setMeta(_pluginKey.pluginKey, inputSource);

      if (dispatch) {
        dispatch(customTr);
      }

      return true;
    };
  };
};

exports.attachInputMeta = attachInputMeta;
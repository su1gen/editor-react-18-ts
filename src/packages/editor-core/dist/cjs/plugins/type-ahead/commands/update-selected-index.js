"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSelectedIndex = void 0;

var _key = require("../pm-plugins/key");

var _actions = require("../pm-plugins/actions");

var updateSelectedIndex = function updateSelectedIndex(selectedIndex) {
  return function (state, dispatch) {
    var pluginState = _key.pluginKey.getState(state);

    if (pluginState.selectedIndex === selectedIndex) {
      return false;
    }

    var tr = state.tr;
    tr.setMeta(_key.pluginKey, {
      action: _actions.ACTIONS.UPDATE_SELECTED_INDEX,
      params: {
        selectedIndex: selectedIndex
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.updateSelectedIndex = updateSelectedIndex;
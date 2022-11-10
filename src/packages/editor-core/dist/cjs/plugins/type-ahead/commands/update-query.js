"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateQuery = void 0;

var _key = require("../pm-plugins/key");

var _actions = require("../pm-plugins/actions");

var updateQuery = function updateQuery(query) {
  return function (state, dispatch) {
    var pluginState = _key.pluginKey.getState(state);

    if (pluginState.query === query) {
      return false;
    }

    var tr = state.tr;
    tr.setMeta(_key.pluginKey, {
      action: _actions.ACTIONS.CHANGE_QUERY,
      params: {
        query: query
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.updateQuery = updateQuery;
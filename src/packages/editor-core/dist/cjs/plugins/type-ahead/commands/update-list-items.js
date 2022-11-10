"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListItem = void 0;

var _key = require("../pm-plugins/key");

var _actions = require("../pm-plugins/actions");

var updateListItem = function updateListItem(items) {
  return function (state, dispatch) {
    var tr = state.tr;
    tr.setMeta(_key.pluginKey, {
      action: _actions.ACTIONS.UPDATE_LIST_ITEMS,
      params: {
        items: items
      }
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.updateListItem = updateListItem;
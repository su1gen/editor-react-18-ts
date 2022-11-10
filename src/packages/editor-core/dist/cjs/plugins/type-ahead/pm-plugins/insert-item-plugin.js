"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _actions = require("./actions");

var _utils = require("./utils");

function createPlugin() {
  return new _safePlugin.SafePlugin({
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var insertItemCallback = (0, _utils.isInsertionTransaction)(transactions, _actions.ACTIONS.INSERT_ITEM);

      if (insertItemCallback) {
        var tr = insertItemCallback(newState);

        if (tr) {
          return tr;
        }
      }
    }
  });
}
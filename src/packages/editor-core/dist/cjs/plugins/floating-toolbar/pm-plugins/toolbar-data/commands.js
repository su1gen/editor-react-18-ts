"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showConfirmDialog = exports.hideConfirmDialog = void 0;

var _pluginFactory = require("./plugin-factory");

var showConfirmDialog = function showConfirmDialog(buttonIndex) {
  return (0, _pluginFactory.createCommand)({
    type: 'SHOW_CONFIRM_DIALOG',
    data: {
      buttonIndex: buttonIndex
    }
  }, function (tr) {
    return tr.setMeta('addToHistory', false);
  });
};

exports.showConfirmDialog = showConfirmDialog;

var hideConfirmDialog = function hideConfirmDialog() {
  return (0, _pluginFactory.createCommand)({
    type: 'HIDE_CONFIRM_DIALOG'
  }, function (tr) {
    return tr.setMeta('addToHistory', false);
  });
};

exports.hideConfirmDialog = hideConfirmDialog;
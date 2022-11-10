"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stopPropagationCommand = exports.openHelpCommand = exports.closeHelpCommand = void 0;

var _pluginKey = require("./plugin-key");

var openHelpCommand = function openHelpCommand(tr, dispatch) {
  tr = tr.setMeta(_pluginKey.pluginKey, true);

  if (dispatch) {
    dispatch(tr);
    return true;
  }

  return false;
};

exports.openHelpCommand = openHelpCommand;

var closeHelpCommand = function closeHelpCommand(tr, dispatch) {
  tr = tr.setMeta(_pluginKey.pluginKey, false);
  dispatch(tr);
};

exports.closeHelpCommand = closeHelpCommand;

var stopPropagationCommand = function stopPropagationCommand(e) {
  return e.stopPropagation();
};

exports.stopPropagationCommand = stopPropagationCommand;
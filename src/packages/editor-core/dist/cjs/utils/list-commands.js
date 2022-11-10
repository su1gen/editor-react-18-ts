"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getListCommands = void 0;

var _commands = require("../plugins/list/commands");

// getListCommands provides commands for manipulating lists in the document.
var getListCommands = function getListCommands() {
  return {
    indentList: _commands.indentList,
    outdentList: _commands.outdentList,
    toggleOrderedList: _commands.toggleOrderedList,
    toggleBulletList: _commands.toggleBulletList
  };
};

exports.getListCommands = getListCommands;
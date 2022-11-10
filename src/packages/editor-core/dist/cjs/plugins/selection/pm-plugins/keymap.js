"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _keymaps = require("../../../keymaps");

var _commands = require("../commands");

function keymapPlugin() {
  var list = {};
  (0, _keymaps.bindKeymapWithCommand)(_keymaps.moveRight.common, _commands.arrowRight, list);
  (0, _keymaps.bindKeymapWithCommand)(_keymaps.moveLeft.common, _commands.arrowLeft, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}

var _default = keymapPlugin;
exports.default = _default;
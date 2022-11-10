"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _keymaps = require("../../../keymaps");

var _commands = require("../commands");

function keymapPlugin() {
  var list = {};
  (0, _keymaps.bindKeymapWithCommand)(_keymaps.alignLeft.common, (0, _commands.changeAlignment)('start'), list);
  (0, _keymaps.bindKeymapWithCommand)(_keymaps.alignRight.common, (0, _commands.changeAlignment)('end'), list);
  return (0, _prosemirrorKeymap.keymap)(list);
}
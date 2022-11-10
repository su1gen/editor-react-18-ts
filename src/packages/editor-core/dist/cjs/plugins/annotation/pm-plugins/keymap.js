"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _keymaps = require("../../../keymaps");

var _commands = require("../commands");

var _analytics = require("../../analytics");

function keymapPlugin() {
  var list = {};
  (0, _keymaps.bindKeymapWithCommand)(_keymaps.addInlineComment.common, (0, _commands.setInlineCommentDraftState)(true, _analytics.INPUT_METHOD.SHORTCUT), list);
  return (0, _prosemirrorKeymap.keymap)(list);
}
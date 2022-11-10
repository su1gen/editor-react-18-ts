"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _keymaps = require("../../keymaps");

var _commandsWithAnalytics = require("./commands-with-analytics");

var _analytics = require("../analytics");

var activateFindReplace = function activateFindReplace() {
  return function (state, dispatch) {
    (0, _commandsWithAnalytics.activateWithAnalytics)({
      triggerMethod: _analytics.TRIGGER_METHOD.SHORTCUT
    })(state, dispatch);
    return true;
  };
};

var keymapPlugin = function keymapPlugin() {
  var list = {};
  (0, _keymaps.bindKeymapWithCommand)(_keymaps.find.common, activateFindReplace(), list);
  return (0, _prosemirrorKeymap.keymap)(list);
};

var _default = keymapPlugin;
exports.default = _default;
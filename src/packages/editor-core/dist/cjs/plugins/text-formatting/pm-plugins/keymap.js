"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keymapPlugin;

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _keymap = require("../../../utils/keymap");

var _analytics = require("../../analytics");

var commands = _interopRequireWildcard(require("../commands/text-formatting"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function keymapPlugin(schema) {
  var list = {};

  if (schema.marks.strong) {
    keymaps.bindKeymapWithCommand(keymaps.toggleBold.common, commands.toggleStrongWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  if (schema.marks.em) {
    keymaps.bindKeymapWithCommand(keymaps.toggleItalic.common, commands.toggleEmWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  if (schema.marks.code) {
    keymaps.bindKeymapWithCommand(keymaps.toggleCode.common, commands.toggleCodeWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  if (schema.marks.strike) {
    keymaps.bindKeymapWithCommand(keymaps.toggleStrikethrough.common, commands.toggleStrikeWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  if (schema.marks.subsup) {
    keymaps.bindKeymapWithCommand(keymaps.toggleSubscript.common, commands.toggleSubscriptWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  if (schema.marks.subsup) {
    keymaps.bindKeymapWithCommand(keymaps.toggleSuperscript.common, commands.toggleSuperscriptWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  if (schema.marks.underline) {
    keymaps.bindKeymapWithCommand(keymaps.toggleUnderline.common, commands.toggleUnderlineWithAnalytics({
      inputMethod: _analytics.INPUT_METHOD.SHORTCUT
    }), list);
  }

  return (0, _keymap.keymap)(list);
}
"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _commands = require("../commands");

var _outdentList = require("../commands/outdent-list");

var _analytics = require("../../analytics");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.findShortcutByKeymap(keymaps.toggleOrderedList), (0, _commands.toggleList)(_analytics.INPUT_METHOD.KEYBOARD, 'orderedList'), list);
  keymaps.bindKeymapWithCommand(keymaps.findShortcutByKeymap(keymaps.toggleBulletList), (0, _commands.toggleList)(_analytics.INPUT_METHOD.KEYBOARD, 'bulletList'), list);
  keymaps.bindKeymapWithCommand(keymaps.indentList.common, (0, _commands.indentList)(_analytics.INPUT_METHOD.KEYBOARD), list);
  keymaps.bindKeymapWithCommand(keymaps.outdentList.common, (0, _outdentList.outdentList)(_analytics.INPUT_METHOD.KEYBOARD), list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, _commands.enterKeyCommand, list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common, _commands.backspaceKeyCommand, list);
  keymaps.bindKeymapWithCommand(keymaps.deleteKey.common, _commands.deleteKeyCommand, list); // This shortcut is Mac only

  keymaps.bindKeymapWithCommand(keymaps.findKeyMapForBrowser(keymaps.forwardDelete), _commands.deleteKeyCommand, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}

var _default = keymapPlugin;
exports.default = _default;
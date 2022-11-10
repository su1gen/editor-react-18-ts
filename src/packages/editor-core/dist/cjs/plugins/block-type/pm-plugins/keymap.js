"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keymapPlugin;

var _prosemirrorHistory = require("prosemirror-history");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var commands = _interopRequireWildcard(require("../../../commands"));

var blockTypes = _interopRequireWildcard(require("../types"));

var _keymap = require("../../../utils/keymap");

var _commands2 = require("../commands");

var _commands3 = require("../../../utils/commands");

var _analytics = require("../../analytics");

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function keymapPlugin(schema, featureFlags) {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, commands.insertNewLineWithAnalytics, list);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, commands.createNewParagraphAbove, list);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, commands.createNewParagraphBelow, list);
  keymaps.bindKeymapWithCommand(keymaps.findKeyMapForBrowser(keymaps.redo), _prosemirrorHistory.redo, list);
  keymaps.bindKeymapWithCommand(keymaps.undo.common, _prosemirrorHistory.undo, list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common, _commands2.cleanUpAtTheStartOfDocument, list);
  keymaps.bindKeymapWithCommand(keymaps.deleteKey.common, (0, _commands3.deleteEmptyParagraphAndMoveBlockUp)(_utils.isNodeAWrappingBlockNode), list);
  keymaps.bindKeymapWithCommand(keymaps.forwardDelete.mac, (0, _commands3.deleteEmptyParagraphAndMoveBlockUp)(_utils.isNodeAWrappingBlockNode), list);

  if (schema.nodes[blockTypes.BLOCK_QUOTE.nodeName]) {
    keymaps.bindKeymapWithCommand(keymaps.findShortcutByKeymap(keymaps.toggleBlockQuote), (0, _commands2.insertBlockTypesWithAnalytics)(blockTypes.BLOCK_QUOTE.name, _analytics.INPUT_METHOD.KEYBOARD), list);
  }

  return (0, _keymap.keymap)(list);
}
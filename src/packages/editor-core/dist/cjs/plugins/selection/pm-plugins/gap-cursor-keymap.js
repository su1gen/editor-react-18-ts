"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _actions = require("../gap-cursor/actions");

var _direction = require("../gap-cursor/direction");

var _selection = require("../gap-cursor/selection");

var _prosemirrorCommands = require("prosemirror-commands");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function keymapPlugin() {
  var map = {};
  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, function (state, dispatch, view) {
    var isInGapCursor = state.selection instanceof _selection.GapCursorSelection; // Only operate in gap cursor

    if (!isInGapCursor) {
      return false;
    }

    return (0, _prosemirrorCommands.createParagraphNear)(state, dispatch);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveLeft.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return (0, _actions.arrow)(_direction.Direction.LEFT, endOfTextblock)(state, dispatch, view);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveRight.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return (0, _actions.arrow)(_direction.Direction.RIGHT, endOfTextblock)(state, dispatch);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return (0, _actions.arrow)(_direction.Direction.UP, endOfTextblock)(state, dispatch);
  }, map);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, function (state, dispatch, view) {
    var endOfTextblock = view ? view.endOfTextblock.bind(view) : undefined;
    return (0, _actions.arrow)(_direction.Direction.DOWN, endOfTextblock)(state, dispatch);
  }, map); // default PM's Backspace doesn't handle removing block nodes when cursor is after it

  keymaps.bindKeymapWithCommand(keymaps.backspace.common, (0, _actions.deleteNode)(_direction.Direction.BACKWARD), map); // handle Delete key (remove node after the cursor)

  keymaps.bindKeymapWithCommand(keymaps.deleteKey.common, (0, _actions.deleteNode)(_direction.Direction.FORWARD), map);
  return (0, _prosemirrorKeymap.keymap)(map);
}
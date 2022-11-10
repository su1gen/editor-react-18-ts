"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorState = require("prosemirror-state");

var _actions = require("../actions");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _main = require("./main");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.enter.common, function (state, dispatch) {
    var datePlugin = (0, _main.getPluginState)(state);
    var isDateNode = state.selection instanceof _prosemirrorState.NodeSelection ? state.selection.node.type === state.schema.nodes.date : false;

    if (!isDateNode) {
      return false;
    }

    if (!datePlugin.showDatePickerAt) {
      (0, _actions.openDatePicker)()(state, dispatch);
      return true;
    }

    (0, _actions.closeDatePicker)()(state, dispatch);
    return true;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common, function (state, dispatch) {
    var datePlugin = (0, _main.getPluginState)(state);
    var isDateNode = state.selection instanceof _prosemirrorState.NodeSelection ? state.selection.node.type === state.schema.nodes.date : false;

    if (!isDateNode) {
      return false;
    }

    if (datePlugin.showDatePickerAt) {
      (0, _actions.focusDateInput)()(state, dispatch);
      return true;
    }

    return false;
  }, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}

var _default = keymapPlugin;
exports.default = _default;
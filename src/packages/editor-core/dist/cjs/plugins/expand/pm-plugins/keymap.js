"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandKeymap = expandKeymap;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorState = require("prosemirror-state");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _gapCursorSelection = require("../../selection/gap-cursor-selection");

var _utils = require("../utils");

var _utils2 = require("../../../utils");

var _classNames = require("../ui/class-names");

var _commands = require("../commands");

var _pluginFactory = require("../../selection/plugin-factory");

var _types = require("../../selection/types");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var isExpandNode = function isExpandNode(node) {
  return (node === null || node === void 0 ? void 0 : node.type.name) === 'expand' || (node === null || node === void 0 ? void 0 : node.type.name) === 'nestedExpand';
};

var isExpandSelected = function isExpandSelected(selection) {
  return selection instanceof _prosemirrorState.NodeSelection && isExpandNode(selection.node);
};

function expandKeymap() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.moveRight.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var selection = state.selection;

    var _getSelectionPluginSt = (0, _pluginFactory.getPluginState)(state),
        selectionRelativeToNode = _getSelectionPluginSt.selectionRelativeToNode;

    if (isExpandSelected(selection) && selectionRelativeToNode === _types.RelativeSelectionPos.Start) {
      return (0, _commands.focusTitle)(selection.from + 1)(state, dispatch, editorView);
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.moveLeft.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var selection = state.selection;

    var _getSelectionPluginSt2 = (0, _pluginFactory.getPluginState)(state),
        selectionRelativeToNode = _getSelectionPluginSt2.selectionRelativeToNode;

    if (isExpandSelected(selection) && (selectionRelativeToNode === undefined || selectionRelativeToNode === _types.RelativeSelectionPos.End)) {
      return (0, _commands.focusTitle)(selection.from + 1)(state, dispatch, editorView);
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.tab.common, function (state, dispatch, editorView) {
    if (state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node.type === state.schema.nodes.expand && editorView && editorView.dom instanceof HTMLElement) {
      var from = state.selection.from;
      var expand = editorView.nodeDOM(from);

      if (!expand || !(expand instanceof HTMLElement)) {
        return false;
      }

      var iconContainer = expand.querySelector(".".concat(_classNames.expandClassNames.iconContainer));

      if (iconContainer && iconContainer.focus) {
        var tr = state.tr;
        var pos = state.selection.from;
        tr.setSelection(new _prosemirrorState.TextSelection(tr.doc.resolve(pos)));

        if (dispatch) {
          dispatch(tr);
        }

        editorView.dom.blur();
        iconContainer.focus();
      }

      return true;
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.moveUp.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var selection = state.selection,
        schema = state.schema;
    var nodeBefore = selection.$from.nodeBefore;

    if (selection instanceof _gapCursorSelection.GapCursorSelection && selection.side === _gapCursorSelection.Side.RIGHT && nodeBefore && (nodeBefore.type === schema.nodes.expand || nodeBefore.type === schema.nodes.nestedExpand) && !nodeBefore.attrs.__expanded) {
      var _$from = selection.$from;
      return (0, _commands.focusTitle)(Math.max(_$from.pos - 1, 0))(state, dispatch, editorView);
    }

    var $from = state.selection.$from;

    if (editorView.endOfTextblock('up')) {
      var expand = (0, _utils.findExpand)(state);
      var prevCursorPos = Math.max($from.pos - $from.parentOffset - 1, 0); // move cursor from expand's content to its title

      if (expand && expand.start === prevCursorPos) {
        return (0, _commands.focusTitle)(expand.start)(state, dispatch, editorView);
      }

      var sel = _prosemirrorState.Selection.findFrom(state.doc.resolve(prevCursorPos), -1);

      var expandBefore = (0, _utils.findExpand)(state, sel);

      if (sel && expandBefore) {
        // moving cursor from outside of an expand to the title when it is collapsed
        if (!expandBefore.node.attrs.__expanded) {
          return (0, _commands.focusTitle)(expandBefore.start)(state, dispatch, editorView);
        } // moving cursor from outside of an expand to the content when it is expanded
        else if (dispatch) {
          dispatch(state.tr.setSelection(sel));
        }

        return true;
      }
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.moveDown.common, function (state, dispatch, editorView) {
    if (!editorView) {
      return false;
    }

    var _state$schema$nodes = state.schema.nodes,
        expand = _state$schema$nodes.expand,
        nestedExpand = _state$schema$nodes.nestedExpand;
    var selection = state.selection;
    var nodeAfter = selection.$from.nodeAfter;

    if (selection instanceof _gapCursorSelection.GapCursorSelection && selection.side === _gapCursorSelection.Side.LEFT && nodeAfter && (nodeAfter.type === expand || nodeAfter.type === nestedExpand) && !nodeAfter.attrs.__expanded) {
      var $from = selection.$from;
      return (0, _commands.focusTitle)($from.pos + 1)(state, dispatch, editorView);
    }

    if (editorView.endOfTextblock('down')) {
      var _$from2 = state.selection.$from;
      var $after = state.doc.resolve(_$from2.after());

      if ($after.nodeAfter && ($after.nodeAfter.type === expand || $after.nodeAfter.type === nestedExpand)) {
        return (0, _commands.focusTitle)($after.pos + 1)(state, dispatch, editorView);
      }
    }

    return false;
  }, list);
  keymaps.bindKeymapWithCommand(keymaps.backspace.common, function (state, dispatch, editorView) {
    var selection = state.selection;
    var $from = selection.$from;

    if (!editorView || !selection.empty) {
      return false;
    }

    var _state$schema$nodes2 = state.schema.nodes,
        expand = _state$schema$nodes2.expand,
        nestedExpand = _state$schema$nodes2.nestedExpand;
    var expandNode = (0, _utils.findExpand)(state);

    if (!expandNode) {
      // @see ED-7977
      var sel = _prosemirrorState.Selection.findFrom(state.doc.resolve(Math.max(selection.$from.pos - 1, 0)), -1);

      var expandBefore = (0, _utils.findExpand)(state, sel);

      if (expandBefore && (expandBefore.node.type === expand || expandBefore.node.type === nestedExpand) && !expandBefore.node.attrs.__expanded) {
        return (0, _commands.focusTitle)(expandBefore.start)(state, dispatch, editorView);
      }

      return false;
    }

    var parentNode = state.doc.nodeAt($from.before(Math.max($from.depth - 1, 1))); // ED-10012 catch cases where the expand has another node nested within it and
    // the backspace should be applied only to the inner node instead of the expand

    if (parentNode && !isExpandNode(parentNode)) {
      return false;
    }

    var textSel = _prosemirrorState.Selection.findFrom(state.doc.resolve(expandNode.pos), 1, true);

    if (textSel && selection.$from.pos === textSel.$from.pos && (0, _utils2.isEmptyNode)(state.schema)(expandNode.node) && dispatch) {
      return (0, _commands.deleteExpand)()(state, dispatch);
    }

    return false;
  }, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}
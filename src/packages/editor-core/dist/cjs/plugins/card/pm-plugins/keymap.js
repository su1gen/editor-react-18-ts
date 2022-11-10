"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cardKeymap = cardKeymap;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorState = require("prosemirror-state");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("@atlaskit/editor-common/utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var lookupPixel = 10;

var getClosestInlineCardPos = function getClosestInlineCardPos(state, editorView, direction) {
  var _editorView$posAtCoor;

  var selection = state.selection;
  var parent = selection.$from.parent;
  var inlineCardType = state.schema.nodes.inlineCard;

  if (!(0, _prosemirrorUtils.flatten)(parent, false).some(function (_ref) {
    var node = _ref.node;
    return node.type === inlineCardType;
  })) {
    return null;
  }

  var coord = editorView.coordsAtPos(selection.$anchor.pos);
  var nearPos = (_editorView$posAtCoor = editorView.posAtCoords({
    left: coord.left,
    top: direction === 'up' ? coord.top - lookupPixel : coord.bottom + lookupPixel
  })) === null || _editorView$posAtCoor === void 0 ? void 0 : _editorView$posAtCoor.pos;

  if (nearPos) {
    var newNode = state.doc.nodeAt(nearPos);

    if (newNode) {
      if (newNode.type !== inlineCardType || (0, _prosemirrorUtils.findChildren)(parent, function (node) {
        return node === newNode;
      }, false).length === 0 || newNode === selection.node) {
        return null;
      }

      return nearPos;
    }
  }

  return null;
};

var selectAboveBelowInlineCard = function selectAboveBelowInlineCard(direction) {
  return function (state, dispatch, editorView) {
    if (!editorView || !dispatch) {
      return false;
    }

    var pos = getClosestInlineCardPos(state, editorView, direction);

    if (pos) {
      dispatch(state.tr.setSelection(new _prosemirrorState.NodeSelection(state.doc.resolve(pos))));
      return true;
    }

    return false;
  };
};

function cardKeymap(featureFlags) {
  var list = {}; // https://bugs.chromium.org/p/chromium/issues/detail?id=1227468 introduced since Chrome 91

  if (_utils.browser.chrome && _utils.browser.chrome_version > 90 && featureFlags.chromeCursorHandlerFixedVersion && _utils.browser.chrome_version < featureFlags.chromeCursorHandlerFixedVersion) {
    keymaps.bindKeymapWithCommand(keymaps.moveUp.common, selectAboveBelowInlineCard('up'), list);
    keymaps.bindKeymapWithCommand(keymaps.moveDown.common, selectAboveBelowInlineCard('down'), list);
  }

  return (0, _prosemirrorKeymap.keymap)(list);
}
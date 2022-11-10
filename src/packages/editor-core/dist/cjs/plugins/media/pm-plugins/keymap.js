"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.keymapPlugin = keymapPlugin;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorState = require("prosemirror-state");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _pluginKey = require("../pm-plugins/plugin-key");

var _mediaCommon = require("@atlaskit/media-common");

var _captions = require("../commands/captions");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function keymapPlugin(options) {
  var list = {};

  var _ref = options || {},
      featureFlags = _ref.featureFlags;

  keymaps.bindKeymapWithCommand(keymaps.undo.common, ignoreLinksInSteps, list);
  keymaps.bindKeymapWithCommand(keymaps.enter.common, splitMediaGroup, list);

  if ((0, _mediaCommon.getMediaFeatureFlag)('captions', featureFlags)) {
    keymaps.bindKeymapWithCommand(keymaps.moveDown.common, insertAndSelectCaption, list);
    keymaps.bindKeymapWithCommand(keymaps.tab.common, insertAndSelectCaption, list);
  }

  keymaps.bindKeymapWithCommand(keymaps.insertNewLine.common, splitMediaGroup, list);
  return (0, _prosemirrorKeymap.keymap)(list);
}

var ignoreLinksInSteps = function ignoreLinksInSteps(state) {
  var mediaPluginState = _pluginKey.stateKey.getState(state);

  mediaPluginState.ignoreLinks = true;
  return false;
};

var splitMediaGroup = function splitMediaGroup(state) {
  var mediaPluginState = _pluginKey.stateKey.getState(state);

  return mediaPluginState.splitMediaGroup();
};

var insertAndSelectCaption = function insertAndSelectCaption(state, dispatch) {
  var selection = state.selection,
      schema = state.schema;

  if (selection instanceof _prosemirrorState.NodeSelection && selection.node.type === schema.nodes.mediaSingle && schema.nodes.caption) {
    if (dispatch) {
      var from = selection.from,
          node = selection.node;

      if (!(0, _captions.insertAndSelectCaptionFromMediaSinglePos)(from, node)(state, dispatch)) {
        (0, _captions.selectCaptionFromMediaSinglePos)(from, node)(state, dispatch);
      }
    }

    return true;
  }

  return false;
};

var _default = keymapPlugin;
exports.default = _default;
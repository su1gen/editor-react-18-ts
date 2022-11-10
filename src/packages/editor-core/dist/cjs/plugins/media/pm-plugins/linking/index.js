"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mediaLinkingPluginKey = exports.getMediaLinkingState = exports.default = exports.createMediaLinkingCommand = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluginStateFactory = require("../../../../utils/plugin-state-factory");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _reducer = _interopRequireDefault(require("./reducer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var mediaLinkingPluginKey = new _prosemirrorState.PluginKey('mediaLinking');
exports.mediaLinkingPluginKey = mediaLinkingPluginKey;
var initialState = {
  visible: false,
  editable: false,
  mediaPos: null,
  link: ''
};

function mapping(tr, pluginState) {
  if (pluginState && pluginState.mediaPos !== null) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      mediaPos: tr.mapping.map(pluginState.mediaPos)
    });
  }

  return pluginState;
}

function onSelectionChanged(tr) {
  var isNodeSelection = tr.selection instanceof _prosemirrorState.NodeSelection;

  if (!isNodeSelection) {
    return initialState;
  }

  var mediaPos = tr.selection.$from.pos + 1;
  var node = tr.doc.nodeAt(mediaPos);

  if (!node || node.type.name !== 'media') {
    return initialState;
  }

  var mark = node.marks.find(function (mark) {
    return mark.type.name === 'link';
  });

  if (mark) {
    return _objectSpread(_objectSpread({}, initialState), {}, {
      mediaPos: mediaPos,
      editable: true,
      link: mark.attrs.href
    });
  }

  return _objectSpread(_objectSpread({}, initialState), {}, {
    mediaPos: mediaPos
  });
}

var mediaLinkingPluginFactory = (0, _pluginStateFactory.pluginFactory)(mediaLinkingPluginKey, _reducer.default, {
  mapping: mapping,
  onSelectionChanged: onSelectionChanged
});
var createMediaLinkingCommand = mediaLinkingPluginFactory.createCommand,
    getMediaLinkingState = mediaLinkingPluginFactory.getPluginState;
exports.getMediaLinkingState = getMediaLinkingState;
exports.createMediaLinkingCommand = createMediaLinkingCommand;

var _default = function _default(dispatch) {
  return new _safePlugin.SafePlugin({
    key: mediaLinkingPluginKey,
    state: mediaLinkingPluginFactory.createPluginState(dispatch, initialState)
  });
};

exports.default = _default;
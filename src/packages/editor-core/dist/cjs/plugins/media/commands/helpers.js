"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMediaNodeAttrs = exports.updateAllMediaNodesAttrs = exports.replaceExternalMedia = exports.isMediaNode = exports.findMediaSingleNode = exports.findMediaNode = exports.findMediaInlineNode = exports.findAllMediaSingleNodes = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluginKey = require("../pm-plugins/plugin-key");

var _steps = require("@atlaskit/adf-schema/steps");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var findMediaSingleNode = function findMediaSingleNode(mediaPluginState, id) {
  var mediaNodes = mediaPluginState.mediaNodes; // Array#find... no IE support

  return mediaNodes.reduce(function (memo, nodeWithPos) {
    if (memo) {
      return memo;
    }

    var node = nodeWithPos.node;

    if (node.attrs.id === id) {
      return nodeWithPos;
    }

    return memo;
  }, null);
};
/**
 * Finds the media inline node with the given id.
 * Media Inline is inserted like a media single node into the media plugin state.
 * However it is not of type mediaSingle.
 *
 * @param mediaPluginState
 * @param id
 * @param isMediaSingle
 * @returns {MediaNodeWithPosHandler | null}
 */


exports.findMediaSingleNode = findMediaSingleNode;

var findMediaInlineNode = function findMediaInlineNode(mediaPluginState, id, isMediaSingle) {
  if (!isMediaSingle) {
    return findMediaSingleNode(mediaPluginState, id);
  }

  return null;
};

exports.findMediaInlineNode = findMediaInlineNode;

var findAllMediaSingleNodes = function findAllMediaSingleNodes(mediaPluginState, id) {
  var mediaNodes = mediaPluginState.mediaNodes;
  return mediaNodes.filter(function (nodeWithHandler) {
    return nodeWithHandler.node.attrs.id === id;
  });
};

exports.findAllMediaSingleNodes = findAllMediaSingleNodes;

var findMediaNode = function findMediaNode(mediaPluginState, id, isMediaSingle) {
  var mediaNodeWithPos = isMediaSingle ? findMediaSingleNode(mediaPluginState, id) : mediaPluginState.mediaGroupNodes[id]; // Should attempt to find media inline node if media single node or media group node is not found

  if (!mediaNodeWithPos) {
    return findMediaInlineNode(mediaPluginState, id, isMediaSingle);
  }

  return mediaNodeWithPos;
};

exports.findMediaNode = findMediaNode;

var isMediaNode = function isMediaNode(pos, state) {
  var node = state.doc.nodeAt(pos);
  return node && ['media', 'mediaInline'].includes(node.type.name);
};

exports.isMediaNode = isMediaNode;

var updateAllMediaNodesAttrs = function updateAllMediaNodesAttrs(id, attrs, isMediaSingle) {
  return function (state, dispatch) {
    var mediaPluginState = _pluginKey.stateKey.getState(state);

    var mediaNodes;

    if (isMediaSingle) {
      mediaNodes = findAllMediaSingleNodes(mediaPluginState, id);
    } else {
      var mediaGroupNode = findMediaNode(mediaPluginState, id, isMediaSingle);
      mediaNodes = mediaGroupNode ? [mediaGroupNode] : [];
    }

    var validMediaNodePositions = mediaNodes.reduce(function (acc, _ref) {
      var getPos = _ref.getPos;
      var pos = getPos();

      if (typeof pos === 'number' && !isMediaNode(pos, state)) {
        return acc;
      }

      acc.push(pos);
      return acc;
    }, []);

    if (validMediaNodePositions.length === 0) {
      return false;
    }

    var tr = state.tr;
    validMediaNodePositions.forEach(function (pos) {
      return tr.step(new _steps.SetAttrsStep(pos, attrs));
    });
    tr.setMeta('addToHistory', false);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.updateAllMediaNodesAttrs = updateAllMediaNodesAttrs;

var updateMediaNodeAttrs = function updateMediaNodeAttrs(id, attrs, isMediaSingle) {
  return function (state, dispatch) {
    var mediaPluginState = _pluginKey.stateKey.getState(state);

    var mediaNodeWithPos = findMediaNode(mediaPluginState, id, isMediaSingle);

    if (!mediaNodeWithPos) {
      return false;
    }

    var tr = state.tr;
    var pos = mediaNodeWithPos.getPos();

    if (!isMediaNode(pos, state)) {
      return false;
    }

    tr.step(new _steps.SetAttrsStep(pos, attrs)).setMeta('addToHistory', false);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.updateMediaNodeAttrs = updateMediaNodeAttrs;

var replaceExternalMedia = function replaceExternalMedia(pos, attrs) {
  return function (state, dispatch) {
    var tr = state.tr;
    var node = tr.doc.nodeAt(pos);

    if (!node || node.type.name !== 'media') {
      return false;
    }

    tr.step(new _steps.SetAttrsStep(pos, _objectSpread({
      type: 'file',
      url: null
    }, attrs))).setMeta('addToHistory', false);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.replaceExternalMedia = replaceExternalMedia;
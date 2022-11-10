"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startImageUpload = exports.insertExternalImage = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("../utils");

var _actions = require("./actions");

var _pluginKey = require("./plugin-key");

var insertExternalImage = function insertExternalImage(options) {
  return function (state, dispatch) {
    var pluginState = _pluginKey.stateKey.getState(state);

    if (!pluginState.enabled || !options.src) {
      return false;
    }

    var mediaNode = (0, _utils.createExternalMediaNode)(options.src, state.schema);

    if (!mediaNode) {
      return false;
    }

    if (dispatch) {
      dispatch((0, _prosemirrorUtils.safeInsert)(mediaNode, state.selection.$to.pos)(state.tr).scrollIntoView());
    }

    return true;
  };
};

exports.insertExternalImage = insertExternalImage;

var startImageUpload = function startImageUpload(event) {
  return function (state, dispatch) {
    var pluginState = _pluginKey.stateKey.getState(state);

    if (!pluginState.enabled) {
      return false;
    }

    if (dispatch) {
      dispatch((0, _actions.startUpload)(event)(state.tr));
    }

    return true;
  };
};

exports.startImageUpload = startImageUpload;
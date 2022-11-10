"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startUpload = void 0;

var _pluginKey = require("./plugin-key");

var imageUploadAction = function imageUploadAction(tr, action) {
  return tr.setMeta(_pluginKey.stateKey, action);
};

var startUpload = function startUpload(event) {
  return function (tr) {
    return imageUploadAction(tr, {
      name: 'START_UPLOAD',
      event: event
    });
  };
};

exports.startUpload = startUpload;
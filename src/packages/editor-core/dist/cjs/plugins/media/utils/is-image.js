"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isImage = void 0;

var isImage = function isImage(fileType) {
  return !!fileType && (fileType.indexOf('image/') > -1 || fileType.indexOf('video/') > -1);
};

exports.isImage = isImage;
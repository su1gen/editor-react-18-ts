"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.nextMajorVersion = exports.name = void 0;
var name = "@atlaskit/editor-core";
exports.name = name;
var version = "175.0.0";
exports.version = version;

var nextMajorVersion = function nextMajorVersion() {
  return [Number(version.split('.')[0]) + 1, 0, 0].join('.');
};

exports.nextMajorVersion = nextMajorVersion;
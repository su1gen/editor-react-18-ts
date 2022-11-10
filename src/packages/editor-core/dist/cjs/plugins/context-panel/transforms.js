"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyChange = void 0;

var _ = require("./");

var applyChange = function applyChange(tr) {
  return tr.setMeta(_.pluginKey, {
    changed: true
  });
};

exports.applyChange = applyChange;
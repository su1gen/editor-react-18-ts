"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandClassNames = void 0;
var prefix = 'ak-editor-expand';
var expandClassNames = {
  prefix: prefix,
  expanded: "".concat(prefix, "__expanded"),
  titleContainer: "".concat(prefix, "__title-container"),
  inputContainer: "".concat(prefix, "__input-container"),
  iconContainer: "".concat(prefix, "__icon-container"),
  icon: "".concat(prefix, "__icon"),
  titleInput: "".concat(prefix, "__title-input"),
  content: "".concat(prefix, "__content"),
  type: function type(_type) {
    return "".concat(prefix, "__type-").concat(_type);
  }
};
exports.expandClassNames = expandClassNames;
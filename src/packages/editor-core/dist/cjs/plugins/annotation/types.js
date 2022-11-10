"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationTestIds = exports.AnnotationSelectionType = void 0;
var AnnotationSelectionType;
exports.AnnotationSelectionType = AnnotationSelectionType;

(function (AnnotationSelectionType) {
  AnnotationSelectionType["INVALID"] = "invalid";
  AnnotationSelectionType["DISABLED"] = "disabled";
  AnnotationSelectionType["VALID"] = "valid";
})(AnnotationSelectionType || (exports.AnnotationSelectionType = AnnotationSelectionType = {}));

var prefix = 'ak-editor-annotation';
var AnnotationTestIds = {
  prefix: prefix,
  floatingComponent: "".concat(prefix, "-floating-component"),
  floatingToolbarCreateButton: "".concat(prefix, "-toolbar-create-button"),
  componentSave: "".concat(prefix, "-dummy-save-button"),
  componentClose: "".concat(prefix, "-dummy-close-button")
};
exports.AnnotationTestIds = AnnotationTestIds;
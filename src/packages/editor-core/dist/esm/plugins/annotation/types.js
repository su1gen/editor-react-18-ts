export var AnnotationSelectionType;

(function (AnnotationSelectionType) {
  AnnotationSelectionType["INVALID"] = "invalid";
  AnnotationSelectionType["DISABLED"] = "disabled";
  AnnotationSelectionType["VALID"] = "valid";
})(AnnotationSelectionType || (AnnotationSelectionType = {}));

var prefix = 'ak-editor-annotation';
export var AnnotationTestIds = {
  prefix: prefix,
  floatingComponent: "".concat(prefix, "-floating-component"),
  floatingToolbarCreateButton: "".concat(prefix, "-toolbar-create-button"),
  componentSave: "".concat(prefix, "-dummy-save-button"),
  componentClose: "".concat(prefix, "-dummy-close-button")
};
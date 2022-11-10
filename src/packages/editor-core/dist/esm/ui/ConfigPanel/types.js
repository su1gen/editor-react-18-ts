export var ValidationError;

(function (ValidationError) {
  ValidationError["Required"] = "required";
  ValidationError["Invalid"] = "invalid";
})(ValidationError || (ValidationError = {}));

export var FieldTypeError;

(function (FieldTypeError) {
  FieldTypeError["isMultipleAndRadio"] = "isMultipleAndRadio";
})(FieldTypeError || (FieldTypeError = {}));
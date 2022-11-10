export var TYPE_AHEAD_DECORATION_KEY = 'typeahead_decoration_key';
export var TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE = 'typeaheadDecoration';
export var TYPE_AHEAD_POPUP_CONTENT_CLASS = 'fabric-editor-typeahead';
export var TYPE_AHEAD_DECORATION_ELEMENT_ID = 'typeahaed_decoration_element_id';
export var NavigationDirection;

(function (NavigationDirection) {
  NavigationDirection[NavigationDirection["LEFT"] = -1] = "LEFT";
  NavigationDirection[NavigationDirection["RIGHT"] = 1] = "RIGHT";
})(NavigationDirection || (NavigationDirection = {}));

export var CloseSelectionOptions;

(function (CloseSelectionOptions) {
  CloseSelectionOptions["BEFORE_TEXT_INSERTED"] = "BEFORE_TEXT_INSERTED";
  CloseSelectionOptions["AFTER_TEXT_INSERTED"] = "AFTER_TEXT_INSERTED";
})(CloseSelectionOptions || (CloseSelectionOptions = {}));
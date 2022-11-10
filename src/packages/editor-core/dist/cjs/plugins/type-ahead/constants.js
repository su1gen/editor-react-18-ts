"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TYPE_AHEAD_POPUP_CONTENT_CLASS = exports.TYPE_AHEAD_DECORATION_KEY = exports.TYPE_AHEAD_DECORATION_ELEMENT_ID = exports.TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE = exports.NavigationDirection = exports.CloseSelectionOptions = void 0;
var TYPE_AHEAD_DECORATION_KEY = 'typeahead_decoration_key';
exports.TYPE_AHEAD_DECORATION_KEY = TYPE_AHEAD_DECORATION_KEY;
var TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE = 'typeaheadDecoration';
exports.TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE = TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE;
var TYPE_AHEAD_POPUP_CONTENT_CLASS = 'fabric-editor-typeahead';
exports.TYPE_AHEAD_POPUP_CONTENT_CLASS = TYPE_AHEAD_POPUP_CONTENT_CLASS;
var TYPE_AHEAD_DECORATION_ELEMENT_ID = 'typeahaed_decoration_element_id';
exports.TYPE_AHEAD_DECORATION_ELEMENT_ID = TYPE_AHEAD_DECORATION_ELEMENT_ID;
var NavigationDirection;
exports.NavigationDirection = NavigationDirection;

(function (NavigationDirection) {
  NavigationDirection[NavigationDirection["LEFT"] = -1] = "LEFT";
  NavigationDirection[NavigationDirection["RIGHT"] = 1] = "RIGHT";
})(NavigationDirection || (exports.NavigationDirection = NavigationDirection = {}));

var CloseSelectionOptions;
exports.CloseSelectionOptions = CloseSelectionOptions;

(function (CloseSelectionOptions) {
  CloseSelectionOptions["BEFORE_TEXT_INSERTED"] = "BEFORE_TEXT_INSERTED";
  CloseSelectionOptions["AFTER_TEXT_INSERTED"] = "AFTER_TEXT_INSERTED";
})(CloseSelectionOptions || (exports.CloseSelectionOptions = CloseSelectionOptions = {}));
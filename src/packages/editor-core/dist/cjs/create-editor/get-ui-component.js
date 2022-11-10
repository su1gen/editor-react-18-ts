"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getUiComponent;

var _FullPage = _interopRequireDefault(require("../ui/Appearance/FullPage"));

var _Chromeless = _interopRequireDefault(require("../ui/Appearance/Chromeless"));

var _Comment = _interopRequireDefault(require("../ui/Appearance/Comment"));

var _Mobile = _interopRequireDefault(require("../ui/Appearance/Mobile"));

function getUiComponent(appearance) {
  appearance = appearance || 'comment';

  switch (appearance) {
    case 'full-page':
    case 'full-width':
      return _FullPage.default;

    case 'chromeless':
      return _Chromeless.default;

    case 'comment':
      return _Comment.default;

    case 'mobile':
      return _Mobile.default;

    default:
      throw new Error("Appearance '".concat(appearance, "' is not supported by the editor."));
  }
}
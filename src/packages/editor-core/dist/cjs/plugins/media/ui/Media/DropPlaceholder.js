"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _documentFilled = _interopRequireDefault(require("@atlaskit/icon/glyph/document-filled"));

var _adfSchema = require("@atlaskit/adf-schema");

var _reactIntlNext = require("react-intl-next");

var _dropPlaceholderMessages = require("./drop-placeholder-messages");

var _tokens = require("@atlaskit/tokens");

var _media = require("../../nodeviews/mediaNodeView/media");

var _templateObject, _templateObject2;

var iconWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n  background: ", ";\n  border-radius: ", "px;\n  margin: 5px 3px 25px;\n  width: ", "px;\n  min-height: ", "px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])), (0, _tokens.token)('color.icon.accent.blue', (0, _adfSchema.hexToRgba)(_colors.B400, 0.4) || _colors.B400), (0, _tokens.token)('color.background.accent.blue.subtle', (0, _adfSchema.hexToRgba)(_colors.B300, 0.6) || _colors.B300), (0, _constants.borderRadius)(), _media.FILE_WIDTH, _media.MEDIA_HEIGHT);
var dropLine = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  border-radius: ", "px;\n  margin: 2px 0;\n  width: 100%;\n  height: 2px;\n"])), (0, _tokens.token)('color.border.focused', _colors.B200), (0, _constants.borderRadius)());

var IconWrapperComponent = function IconWrapperComponent(props) {
  var intl = props.intl;
  var dropPlaceholderLabel = _dropPlaceholderMessages.dropPlaceholderMessages.dropPlaceholderLabel;
  return (0, _react.jsx)("div", {
    css: iconWrapper
  }, (0, _react.jsx)(_documentFilled.default, {
    label: intl.formatMessage(dropPlaceholderLabel),
    size: "medium"
  }));
};

var IntlIconWrapper = (0, _reactIntlNext.injectIntl)(IconWrapperComponent);

var _default = function _default(_ref) {
  var _ref$type = _ref.type,
      type = _ref$type === void 0 ? 'group' : _ref$type;
  return type === 'single' ? (0, _react.jsx)("div", {
    css: dropLine
  }) : (0, _react.jsx)(IntlIconWrapper, null);
};

exports.default = _default;
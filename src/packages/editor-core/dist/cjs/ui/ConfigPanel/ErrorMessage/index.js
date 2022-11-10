"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _emptyState = _interopRequireDefault(require("@atlaskit/empty-state"));

var _reactIntlNext = require("react-intl-next");

var _ErrorImage = _interopRequireDefault(require("./ErrorImage"));

var messages = (0, _reactIntlNext.defineMessages)({
  configFailedToLoad: {
    id: 'fabric.editor.configFailedToLoad',
    defaultMessage: 'Failed to load',
    description: 'Displayed when the config panel fails to load fields'
  }
});

var ConfigPanelErrorMessage = function ConfigPanelErrorMessage(_ref) {
  var errorMessage = _ref.errorMessage,
      intl = _ref.intl;
  return /*#__PURE__*/_react.default.createElement(_emptyState.default, {
    header: intl.formatMessage(messages.configFailedToLoad),
    description: errorMessage,
    renderImage: function renderImage() {
      return /*#__PURE__*/_react.default.createElement(_ErrorImage.default, null);
    },
    size: "narrow",
    imageHeight: 80
  });
};

var _default = (0, _reactIntlNext.injectIntl)(ConfigPanelErrorMessage);

exports.default = _default;
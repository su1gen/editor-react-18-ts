"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _question = _interopRequireDefault(require("@atlaskit/icon/glyph/question"));

var _ToolbarButton = _interopRequireDefault(require("../ToolbarButton"));

var _WithHelpTrigger = _interopRequireDefault(require("../WithHelpTrigger"));

var _reactIntlNext = require("react-intl-next");

var _messages = require("./messages");

var tooltipHelpTrigger = function tooltipHelpTrigger(_ref) {
  var _ref$title = _ref.title,
      title = _ref$title === void 0 ? 'Open help dialog' : _ref$title,
      _ref$titlePosition = _ref.titlePosition,
      titlePosition = _ref$titlePosition === void 0 ? 'left' : _ref$titlePosition,
      intl = _ref.intl;
  // to have translation for the default tooltip helper
  var displayTitle = title;

  if (title === 'Open help dialog') {
    displayTitle = intl.formatMessage(_messages.messages.toolbarHelpTitle);
  }

  return /*#__PURE__*/_react.default.createElement(_WithHelpTrigger.default, {
    render: function render(showHelp) {
      return /*#__PURE__*/_react.default.createElement(_ToolbarButton.default, {
        onClick: showHelp,
        title: displayTitle,
        titlePosition: titlePosition,
        iconBefore: /*#__PURE__*/_react.default.createElement(_question.default, {
          label: displayTitle
        })
      });
    }
  });
};

var _default = (0, _reactIntlNext.injectIntl)(tooltipHelpTrigger);

exports.default = _default;
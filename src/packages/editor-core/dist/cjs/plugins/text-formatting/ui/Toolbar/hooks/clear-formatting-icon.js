"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClearIcon = void 0;

var _react = require("react");

var _react2 = require("@emotion/react");

var _styles = require("../../../../../ui/styles");

var _toolbarMessages = require("../toolbar-messages");

var _clearFormatting = require("../../../commands/clear-formatting");

var _clearFormatting2 = require("../../../pm-plugins/clear-formatting");

var _keymaps = require("../../../../../keymaps");

var _enums = require("../../../../analytics/types/enums");

/** @jsx jsx */
var clearFormattingToolbar = (0, _clearFormatting.clearFormattingWithAnalytics)(_enums.INPUT_METHOD.TOOLBAR);

var useClearFormattingPluginState = function useClearFormattingPluginState(editorState) {
  return (0, _react.useMemo)(function () {
    return _clearFormatting2.pluginKey.getState(editorState);
  }, [editorState]);
};

var useClearIcon = function useClearIcon(_ref) {
  var intl = _ref.intl,
      editorState = _ref.editorState;
  var pluginState = useClearFormattingPluginState(editorState);
  var isPluginAvailable = Boolean(pluginState);
  var formattingIsPresent = Boolean(pluginState === null || pluginState === void 0 ? void 0 : pluginState.formattingIsPresent);
  var clearFormattingLabel = intl.formatMessage(_toolbarMessages.toolbarMessages.clearFormatting);
  return (0, _react.useMemo)(function () {
    if (!isPluginAvailable) {
      return null;
    }

    return {
      key: 'clearFormatting',
      command: clearFormattingToolbar,
      content: clearFormattingLabel,
      elemAfter: (0, _react2.jsx)("div", {
        css: _styles.shortcutStyle
      }, (0, _keymaps.tooltip)(_keymaps.clearFormatting)),
      value: {
        name: 'clearFormatting'
      },
      isActive: false,
      isDisabled: !formattingIsPresent
    };
  }, [clearFormattingLabel, isPluginAvailable, formattingIsPresent]);
};

exports.useClearIcon = useClearIcon;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _ui = _interopRequireDefault(require("./ui"));

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _types = require("../../ui/Toolbar/types");

var _main = require("../list/pm-plugins/main");

var _indentationButtons = require("./pm-plugins/indentation-buttons");

var toolbarListsIndentationPlugin = function toolbarListsIndentationPlugin(_ref) {
  var showIndentationButtons = _ref.showIndentationButtons,
      allowHeadingAndParagraphIndentation = _ref.allowHeadingAndParagraphIndentation;
  return {
    name: 'toolbarListsIndentation',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'indentationButtons',
        plugin: function plugin(_ref2) {
          var dispatch = _ref2.dispatch;
          return (0, _indentationButtons.createPlugin)({
            dispatch: dispatch,
            showIndentationButtons: showIndentationButtons,
            allowHeadingAndParagraphIndentation: allowHeadingAndParagraphIndentation
          });
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref3) {
      var editorView = _ref3.editorView,
          popupsMountPoint = _ref3.popupsMountPoint,
          popupsBoundariesElement = _ref3.popupsBoundariesElement,
          popupsScrollableElement = _ref3.popupsScrollableElement,
          toolbarSize = _ref3.toolbarSize,
          disabled = _ref3.disabled,
          isToolbarReducedSpacing = _ref3.isToolbarReducedSpacing;
      var isSmall = toolbarSize < _types.ToolbarSize.L;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          listState: _main.pluginKey,
          indentationState: _indentationButtons.pluginKey
        },
        render: function render(_ref4) {
          var listState = _ref4.listState,
              indentationState = _ref4.indentationState;

          if (!listState) {
            return null;
          }

          return /*#__PURE__*/_react.default.createElement(_ui.default, {
            isSmall: isSmall,
            isReducedSpacing: isToolbarReducedSpacing,
            disabled: disabled,
            editorView: editorView,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement,
            bulletListActive: listState.bulletListActive,
            bulletListDisabled: listState.bulletListDisabled,
            orderedListActive: listState.orderedListActive,
            orderedListDisabled: listState.orderedListDisabled,
            showIndentationButtons: !!showIndentationButtons,
            indentDisabled: indentationState.indentDisabled,
            outdentDisabled: indentationState.outdentDisabled
          });
        }
      });
    }
  };
};

var _default = toolbarListsIndentationPlugin;
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _colors = require("@atlaskit/theme/colors");

var _components = require("@atlaskit/theme/components");

var _constants = require("@atlaskit/theme/constants");

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _modalDialog = _interopRequireWildcard(require("@atlaskit/modal-dialog"));

var _questionCircle = _interopRequireDefault(require("@atlaskit/icon/glyph/question-circle"));

var _ElementBrowserLoader = _interopRequireDefault(require("./components/ElementBrowserLoader"));

var _categories = require("./categories");

var _constants2 = require("./constants");

var _messages = require("./messages");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var actions = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: inline-flex;\n  margin: 0 -4px;\n"])));
var actionItem = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 1 0 auto;\n  margin: 0 4px;\n"])));
var wrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex: 1 1 auto;\n  box-sizing: border-box;\n  padding: ", "px ", "px 0 10px;\n  overflow: hidden;\n  background-color: ", ";\n  border-radius: ", "px;\n"])), _constants2.MODAL_WRAPPER_PADDING, _constants2.MODAL_WRAPPER_PADDING, (0, _components.themed)({
  light: (0, _tokens.token)('elevation.surface.overlay', _colors.N0),
  dark: (0, _tokens.token)('elevation.surface.overlay', _colors.DN50)
})(), (0, _constants.borderRadius)());
var modalFooter = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  padding: ", "px;\n\n  position: relative;\n  align-items: center;\n  justify-content: space-between;\n"])), _constants2.MODAL_WRAPPER_PADDING);

var ModalElementBrowser = function ModalElementBrowser(props) {
  var _useState = (0, _react.useState)(),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      selectedItem = _useState2[0],
      setSelectedItem = _useState2[1];

  var helpUrl = props.helpUrl,
      intl = props.intl;
  var onSelectItem = (0, _react.useCallback)(function (item) {
    setSelectedItem(item);
  }, [setSelectedItem]);
  var onInsertItem = (0, _react.useCallback)(function (item) {
    props.onInsertItem(item);
  }, [props]);
  var RenderFooter = (0, _react.useCallback)(function () {
    return (0, _react2.jsx)(Footer, {
      onInsert: function onInsert() {
        return onInsertItem(selectedItem);
      },
      beforeElement: helpUrl ? HelpLink(helpUrl, intl.formatMessage(_messages.messages.help)) : undefined
    });
  }, [onInsertItem, selectedItem, helpUrl, intl]); // Since Modal uses stackIndex it's shouldCloseOnEscapePress prop doesn't work.

  var onKeyDown = (0, _react.useCallback)(function (e) {
    if (e.key === 'Escape') {
      props.onClose();
    }
  }, [props]);
  var RenderBody = (0, _react.useCallback)(function () {
    return (0, _react2.jsx)("div", {
      css: wrapper
    }, (0, _react2.jsx)(_ElementBrowserLoader.default, {
      categories: (0, _categories.getCategories)(props.intl),
      getItems: props.getItems,
      showSearch: true,
      showCategories: true,
      mode: "full",
      onSelectItem: onSelectItem,
      onInsertItem: onInsertItem,
      emptyStateHandler: props.emptyStateHandler
    }));
  }, [props.intl, props.getItems, onSelectItem, onInsertItem, props.emptyStateHandler]);
  return (0, _react2.jsx)("div", {
    "data-editor-popup": true,
    onClick: onModalClick,
    onKeyDown: onKeyDown
  }, (0, _react2.jsx)(_modalDialog.ModalTransition, null, props.isOpen && (0, _react2.jsx)(_modalDialog.default, {
    testId: "element-browser-modal-dialog",
    stackIndex: 0,
    key: "element-browser-modal",
    onClose: props.onClose,
    height: "664px",
    width: "x-large",
    autoFocus: false // defaults to true and doesn't work along with stackIndex=1.
    // packages/design-system/modal-dialog/src/components/Content.tsx Line 287
    ,
    shouldCloseOnEscapePress: false
  }, (0, _react2.jsx)(RenderBody, null), (0, _react2.jsx)(RenderFooter, null))));
};

ModalElementBrowser.displayName = 'ModalElementBrowser'; // Prevent ModalElementBrowser click propagation through to the editor.

var onModalClick = function onModalClick(e) {
  return e.stopPropagation();
};

var Footer = function Footer(_ref) {
  var onInsert = _ref.onInsert,
      beforeElement = _ref.beforeElement;

  var _useModal = (0, _modalDialog.useModal)(),
      onClose = _useModal.onClose;

  return (0, _react2.jsx)("div", {
    css: modalFooter
  }, beforeElement ? beforeElement : (0, _react2.jsx)("span", null), (0, _react2.jsx)("div", {
    css: actions
  }, (0, _react2.jsx)("div", {
    css: actionItem
  }, (0, _react2.jsx)(_customThemeButton.default, {
    appearance: "primary",
    onClick: onInsert,
    testId: "ModalElementBrowser__insert-button"
  }, "Insert")), (0, _react2.jsx)("div", {
    css: actionItem
  }, (0, _react2.jsx)(_customThemeButton.default, {
    appearance: "subtle",
    onClick: onClose,
    testId: "ModalElementBrowser__close-button"
  }, "Close"))));
};

var HelpLink = function HelpLink(url, helpText) {
  return (0, _react2.jsx)(_customThemeButton.default, {
    iconBefore: (0, _react2.jsx)(_questionCircle.default, {
      label: "help",
      size: "medium"
    }),
    appearance: "subtle-link",
    href: url,
    target: "_blank",
    testId: "ModalElementBrowser__help-button"
  }, helpText);
};

var _default = (0, _reactIntlNext.injectIntl)(ModalElementBrowser);

exports.default = _default;
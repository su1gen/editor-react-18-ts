"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MobileAppearance = MobileAppearance;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _maxContentSize = require("../../plugins/max-content-size");

var _pluginFactory = require("../../plugins/mobile-dimensions/plugin-factory");

var _WithPluginState = _interopRequireDefault(require("../WithPluginState"));

var _WithFlash = _interopRequireDefault(require("../WithFlash"));

var _ContentStyles = require("../ContentStyles");

var _Addon = require("../Addon");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var mobileEditor = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  min-height: 30px;\n  width: 100%;\n  max-width: inherit;\n  box-sizing: border-box;\n  word-wrap: break-word;\n\n  div > .ProseMirror {\n    outline: none;\n    white-space: pre-wrap;\n    padding: 0;\n    margin: 0;\n  }\n"])));
var ContentArea = (0, _ContentStyles.createEditorContentStyle)();
ContentArea.displayName = 'ContentArea';

function MobileAppearance(_ref) {
  var editorView = _ref.editorView,
      persistScrollGutter = _ref.persistScrollGutter,
      children = _ref.children,
      editorDisabled = _ref.editorDisabled;
  var render = (0, _react.useCallback)(function (_ref2) {
    var maxContentSize = _ref2.maxContentSize,
        mobileDimensions = _ref2.mobileDimensions;
    var maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
    var minHeight = 100;
    var currentIsExpanded = true; // isExpanded prop should always be true for Hybrid Editor

    if (mobileDimensions) {
      var keyboardHeight = mobileDimensions.keyboardHeight,
          windowHeight = mobileDimensions.windowHeight,
          mobilePaddingTop = mobileDimensions.mobilePaddingTop,
          isExpanded = mobileDimensions.isExpanded;
      /*
        We calculate the min-height based on the windowHeight - keyboardHeight - paddingTop.
        This is needed due to scrolling issues when there is no content to scroll (like, only having 1 paragraph),
        but if the clickable area is bigger than the windowHeight - keyboard (including toolbar) then the view
        is scrolled nevertheless, and it gives the sensation that the content was lost.
      */

      if (!persistScrollGutter) {
        // in iOS Hybrid Editor windowHeight doesn't exclude keyboardHeight
        // in Android keyboardHeight is always set to -1;
        minHeight = windowHeight - keyboardHeight - 2 * mobilePaddingTop;
      } else {
        // in iOS Compact Editor windowHeight excludes keyboardHeight
        minHeight = windowHeight - mobilePaddingTop; // isExpanded can be true of false for Compact editor

        currentIsExpanded = isExpanded;
      }
    }

    return (0, _react2.jsx)(_WithFlash.default, {
      animate: maxContentSizeReached
    }, (0, _react2.jsx)("div", {
      css: mobileEditor
    }, (0, _react2.jsx)(_Addon.ClickAreaMobile, {
      editorView: editorView || undefined,
      minHeight: minHeight,
      persistScrollGutter: persistScrollGutter,
      isExpanded: currentIsExpanded,
      editorDisabled: editorDisabled
    }, (0, _react2.jsx)(ContentArea, null, (0, _react2.jsx)("div", {
      className: "ak-editor-content-area"
    }, children)))));
  }, [children, editorView, persistScrollGutter, editorDisabled]);
  return (0, _react2.jsx)(_WithPluginState.default, {
    plugins: {
      maxContentSize: _maxContentSize.pluginKey,
      mobileDimensions: _pluginFactory.mobileDimensionsPluginKey
    },
    render: render
  });
}
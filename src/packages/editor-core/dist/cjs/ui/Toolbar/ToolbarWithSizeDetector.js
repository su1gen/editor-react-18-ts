"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarWithSizeDetector = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _widthDetector = require("@atlaskit/width-detector");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _hooks = require("./hooks");

var _toolbarSize = require("./toolbar-size");

var _Toolbar = require("./Toolbar");

var _types = require("./types");

var _isFullPage = require("../../utils/is-full-page");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var toolbar = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  width: 100%;\n  position: relative;\n  @media (max-width: ", "px) {\n    grid-column: 1 / 2;\n    grid-row: 2;\n    width: calc(100% - 30px);\n    margin: 0 15px;\n  }\n"])), _editorSharedStyles.akEditorMobileMaxWidth);

var ToolbarWithSizeDetector = function ToolbarWithSizeDetector(props) {
  var ref = /*#__PURE__*/_react.default.createRef();

  var _React$useState = _react.default.useState(undefined),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      width = _React$useState2[0],
      setWidth = _React$useState2[1];

  var elementWidth = (0, _hooks.useElementWidth)(ref, {
    skip: typeof width !== 'undefined'
  });
  var toolbarSize = typeof width === 'undefined' && typeof elementWidth === 'undefined' ? undefined : (0, _toolbarSize.widthToToolbarSize)(width || elementWidth, props.appearance);
  var toolbarStyle = (0, _react.useMemo)(function () {
    var toolbarWidth = (0, _isFullPage.isFullPage)(props.appearance) && props.twoLineEditorToolbar ? _types.ToolbarSize.S : _types.ToolbarSize.M;
    var toolbarMinWidth = (0, _toolbarSize.toolbarSizeToWidth)(toolbarWidth, props.appearance);
    var minWidth = "min-width: ".concat(props.hasMinWidth ? toolbarMinWidth : '254', "px");
    return [toolbar, minWidth];
  }, [props.appearance, props.hasMinWidth, props.twoLineEditorToolbar]);
  return (0, _react2.jsx)("div", {
    css: toolbarStyle
  }, (0, _react2.jsx)(_widthDetector.WidthObserver, {
    setWidth: setWidth
  }), props.editorView && toolbarSize ? (0, _react2.jsx)(_Toolbar.Toolbar, (0, _extends2.default)({}, props, {
    toolbarSize: toolbarSize
  })) : (0, _react2.jsx)("div", {
    ref: ref
  }));
};

exports.ToolbarWithSizeDetector = ToolbarWithSizeDetector;
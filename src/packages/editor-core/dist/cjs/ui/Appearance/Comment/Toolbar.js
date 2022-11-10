"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mainToolbarCustomComponentsSlotStyle = exports.TableControlsPadding = exports.MainToolbar = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var TableControlsPadding = 20;
exports.TableControlsPadding = TableControlsPadding;
var mainToolbarWrapperStyle = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  align-items: center;\n  padding: ", "px ", "px 0;\n  display: flex;\n  height: auto;\n  background-color: ", ";\n  box-shadow: none;\n  padding-left: ", "px;\n\n  & > div {\n    > :first-child:not(style),\n    > style:first-child + * {\n      margin-left: 0;\n    }\n  }\n\n  .block-type-btn {\n    padding-left: 0;\n  }\n"])), (0, _constants.gridSize)(), (0, _constants.gridSize)(), (0, _tokens.token)('elevation.surface', 'white'), TableControlsPadding);
var stickyToolbarWrapperStyle = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  /* stylelint-disable declaration-block-no-duplicate-properties */\n  position: relative;\n  position: sticky;\n  /* stylelint-enable declaration-block-no-duplicate-properties */\n  padding-bottom: ", "px;\n  z-index: ", ";\n  transition: box-shadow ease-in-out 0.2s;\n  &.show-keyline {\n    box-shadow: 0 ", "px 0 0\n      ", ";\n  }\n"])), (0, _constants.gridSize)(), _editorSharedStyles.akEditorGridLineZIndex + _editorSharedStyles.akEditorMenuZIndex, _editorSharedStyles.akEditorToolbarKeylineHeight, (0, _tokens.token)('color.border', _colors.N30));

var StickyToolbar = function StickyToolbar(props) {
  var _useState = (0, _react.useState)(0),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      top = _useState2[0],
      setTop = _useState2[1];

  (0, _react.useEffect)(function () {
    var _props$externalToolba, _props$externalToolba2;

    setTop(((_props$externalToolba = props.externalToolbarRef) === null || _props$externalToolba === void 0 ? void 0 : (_props$externalToolba2 = _props$externalToolba.current) === null || _props$externalToolba2 === void 0 ? void 0 : _props$externalToolba2.clientHeight) || 0);
  }, [setTop, props.externalToolbarRef]);
  return (0, _react2.jsx)("div", {
    css: [mainToolbarWrapperStyle, stickyToolbarWrapperStyle, (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n          top: ", ";\n        "])), top)],
    "data-testid": "ak-editor-main-toolbar",
    className: 'show-keyline'
  }, props.children);
};

var FixedToolbar = function FixedToolbar(props) {
  return (0, _react2.jsx)("div", {
    css: mainToolbarWrapperStyle,
    "data-testid": "ak-editor-main-toolbar"
  }, props.children);
};

var MainToolbar = function MainToolbar(_ref) {
  var useStickyToolbar = _ref.useStickyToolbar,
      children = _ref.children;

  if (!!useStickyToolbar) {
    return (0, _react2.jsx)(StickyToolbar, {
      externalToolbarRef: typeof useStickyToolbar === 'boolean' ? undefined : useStickyToolbar
    }, children);
  }

  return (0, _react2.jsx)(FixedToolbar, null, children);
};

exports.MainToolbar = MainToolbar;
var mainToolbarCustomComponentsSlotStyle = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  flex-grow: 1;\n  padding-right: ", "px;\n  > div {\n    display: flex;\n    flex-shrink: 0;\n  }\n"])), TableControlsPadding);
exports.mainToolbarCustomComponentsSlotStyle = mainToolbarCustomComponentsSlotStyle;
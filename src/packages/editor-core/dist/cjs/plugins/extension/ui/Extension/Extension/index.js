"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _styles = require("./styles");

var _styles2 = require("../styles");

var _Lozenge = _interopRequireDefault(require("../Lozenge"));

var _width = require("../../../../width");

var _WithPluginState = _interopRequireDefault(require("../../../../../ui/WithPluginState"));

var _classnames2 = _interopRequireDefault(require("classnames"));

var _excluded = ["type"];

function ExtensionWithPluginState(props) {
  var node = props.node,
      handleContentDOMRef = props.handleContentDOMRef,
      children = props.children,
      _props$widthState = props.widthState,
      widthState = _props$widthState === void 0 ? {
    width: 0
  } : _props$widthState,
      handleRef = props.handleRef,
      shadowClassNames = props.shadowClassNames,
      hideFrame = props.hideFrame,
      editorAppearance = props.editorAppearance;
  var hasBody = node.type.name === 'bodiedExtension';
  var isMobile = editorAppearance === 'mobile';
  var hasChildren = !!children;
  var removeBorder = hideFrame && !isMobile && !hasBody || false;
  var shouldBreakout = // Extension should breakout when the layout is set to 'full-width' or 'wide'.
  ['full-width', 'wide'].includes(node.attrs.layout) && // Extension breakout state should only be respected for top level nodes.
  props.view.state.doc.resolve(props.getPos()).depth === 0 && // Extension breakout state should not be respected when the editor appearance is full-width mode
  editorAppearance !== 'full-width';
  var classNames = (0, _classnames2.default)('extension-container', 'block', shadowClassNames, (0, _defineProperty2.default)({
    'with-overlay': !hasBody,
    'without-frame': removeBorder
  }, _styles.widerLayoutClassName, shouldBreakout));
  var headerClassNames = (0, _classnames2.default)({
    'with-children': hasChildren,
    'without-frame': removeBorder
  });
  var customContainerStyles = {};

  if (shouldBreakout) {
    var _calculateBreakoutSty = (0, _utils.calculateBreakoutStyles)({
      mode: node.attrs.layout,
      widthStateWidth: widthState.width,
      widthStateLineLength: widthState.lineLength
    }),
        type = _calculateBreakoutSty.type,
        breakoutStyles = (0, _objectWithoutProperties2.default)(_calculateBreakoutSty, _excluded);

    customContainerStyles = breakoutStyles;
  }

  return (0, _react2.jsx)("div", {
    ref: handleRef,
    "data-layout": node.attrs.layout,
    className: classNames,
    css: _styles.wrapperStyle,
    style: customContainerStyles
  }, (0, _react2.jsx)("div", {
    className: "extension-overflow-wrapper ".concat(hasBody ? 'with-body' : '')
  }, (0, _react2.jsx)("div", {
    css: _styles2.overlay,
    className: "extension-overlay"
  }), (0, _react2.jsx)("div", {
    css: _styles.header,
    contentEditable: false,
    className: headerClassNames
  }, !removeBorder && (0, _react2.jsx)(_Lozenge.default, {
    node: node
  }), children), hasBody && (0, _react2.jsx)("div", {
    css: _styles.contentWrapper
  }, (0, _react2.jsx)("div", {
    css: _styles.content,
    ref: handleContentDOMRef,
    className: "extension-content block"
  }))));
}

var Extension = function Extension(props) {
  return (0, _react2.jsx)(_WithPluginState.default, {
    editorView: props.view,
    plugins: {
      widthState: _width.pluginKey
    },
    render: function render(_ref) {
      var widthState = _ref.widthState;
      return (0, _react2.jsx)(ExtensionWithPluginState, (0, _extends2.default)({
        widthState: widthState
      }, props));
    }
  });
};

var _default = (0, _ui.overflowShadow)(Extension, {
  overflowSelector: '.extension-overflow-wrapper'
});

exports.default = _default;
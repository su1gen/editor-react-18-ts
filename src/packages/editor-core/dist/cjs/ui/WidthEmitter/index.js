"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _width = require("../../plugins/width");

var _ui = require("@atlaskit/editor-common/ui");

var _context = require("../ContextPanel/context");

function useCreateWidthCallbacks(_ref) {
  var setContextPanelWidth = _ref.setContextPanelWidth,
      setContainerWidth = _ref.setContainerWidth;

  var contextPanelWidthCallback = _react.default.useCallback(function (_ref2) {
    var width = _ref2.width;
    setContextPanelWidth(width);
    return null;
  }, [setContextPanelWidth]);

  var containerWidthCallback = _react.default.useCallback(function (_ref3) {
    var width = _ref3.width;
    setContainerWidth(width);
    return null;
  }, [setContainerWidth]);

  return [contextPanelWidthCallback, containerWidthCallback];
}

var WidthEmitter = function WidthEmitter(_ref4) {
  var editorView = _ref4.editorView;

  var _React$useState = _react.default.useState(0),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      contextPanelWidth = _React$useState2[0],
      setContextPanelWidth = _React$useState2[1];

  var _React$useState3 = _react.default.useState(0),
      _React$useState4 = (0, _slicedToArray2.default)(_React$useState3, 2),
      containerWidth = _React$useState4[0],
      setContainerWidth = _React$useState4[1];

  var _useCreateWidthCallba = useCreateWidthCallbacks({
    setContextPanelWidth: setContextPanelWidth,
    setContainerWidth: setContainerWidth
  }),
      _useCreateWidthCallba2 = (0, _slicedToArray2.default)(_useCreateWidthCallba, 2),
      contextPanelWidthCallback = _useCreateWidthCallba2[0],
      containerWidthCallback = _useCreateWidthCallba2[1];

  _react.default.useEffect(function () {
    var width = containerWidth - contextPanelWidth;

    if (width <= 0 || isNaN(width) || !editorView) {
      return;
    }

    var dom = editorView.dom,
        tr = editorView.state.tr,
        dispatch = editorView.dispatch;
    tr.setMeta(_width.pluginKey, {
      width: width,
      containerWidth: containerWidth,
      lineLength: dom ? dom.clientWidth : undefined
    });
    dispatch(tr);
    return function () {};
  }, [editorView, contextPanelWidth, containerWidth]);

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_context.ContextPanelConsumer, null, contextPanelWidthCallback), /*#__PURE__*/_react.default.createElement(_ui.WidthConsumer, null, containerWidthCallback));
};

var _default = WidthEmitter;
exports.default = _default;
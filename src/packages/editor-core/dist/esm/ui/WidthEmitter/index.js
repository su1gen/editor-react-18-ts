import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React from 'react';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { ContextPanelConsumer } from '../ContextPanel/context';

function useCreateWidthCallbacks(_ref) {
  var setContextPanelWidth = _ref.setContextPanelWidth,
      setContainerWidth = _ref.setContainerWidth;
  var contextPanelWidthCallback = React.useCallback(function (_ref2) {
    var width = _ref2.width;
    setContextPanelWidth(width);
    return null;
  }, [setContextPanelWidth]);
  var containerWidthCallback = React.useCallback(function (_ref3) {
    var width = _ref3.width;
    setContainerWidth(width);
    return null;
  }, [setContainerWidth]);
  return [contextPanelWidthCallback, containerWidthCallback];
}

var WidthEmitter = function WidthEmitter(_ref4) {
  var editorView = _ref4.editorView;

  var _React$useState = React.useState(0),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      contextPanelWidth = _React$useState2[0],
      setContextPanelWidth = _React$useState2[1];

  var _React$useState3 = React.useState(0),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      containerWidth = _React$useState4[0],
      setContainerWidth = _React$useState4[1];

  var _useCreateWidthCallba = useCreateWidthCallbacks({
    setContextPanelWidth: setContextPanelWidth,
    setContainerWidth: setContainerWidth
  }),
      _useCreateWidthCallba2 = _slicedToArray(_useCreateWidthCallba, 2),
      contextPanelWidthCallback = _useCreateWidthCallba2[0],
      containerWidthCallback = _useCreateWidthCallba2[1];

  React.useEffect(function () {
    var width = containerWidth - contextPanelWidth;

    if (width <= 0 || isNaN(width) || !editorView) {
      return;
    }

    var dom = editorView.dom,
        tr = editorView.state.tr,
        dispatch = editorView.dispatch;
    tr.setMeta(widthPluginKey, {
      width: width,
      containerWidth: containerWidth,
      lineLength: dom ? dom.clientWidth : undefined
    });
    dispatch(tr);
    return function () {};
  }, [editorView, contextPanelWidth, containerWidth]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ContextPanelConsumer, null, contextPanelWidthCallback), /*#__PURE__*/React.createElement(WidthConsumer, null, containerWidthCallback));
};

export default WidthEmitter;
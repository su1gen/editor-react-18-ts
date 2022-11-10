import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["type"];

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { overflowShadow } from '@atlaskit/editor-common/ui';
import { calculateBreakoutStyles } from '@atlaskit/editor-common/utils';
import { wrapperStyle, header, content, contentWrapper, widerLayoutClassName } from './styles';
import { overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { pluginKey as widthPluginKey } from '../../../../width';
import WithPluginState from '../../../../../ui/WithPluginState';
import classnames from 'classnames';

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
  var classNames = classnames('extension-container', 'block', shadowClassNames, _defineProperty({
    'with-overlay': !hasBody,
    'without-frame': removeBorder
  }, widerLayoutClassName, shouldBreakout));
  var headerClassNames = classnames({
    'with-children': hasChildren,
    'without-frame': removeBorder
  });
  var customContainerStyles = {};

  if (shouldBreakout) {
    var _calculateBreakoutSty = calculateBreakoutStyles({
      mode: node.attrs.layout,
      widthStateWidth: widthState.width,
      widthStateLineLength: widthState.lineLength
    }),
        type = _calculateBreakoutSty.type,
        breakoutStyles = _objectWithoutProperties(_calculateBreakoutSty, _excluded);

    customContainerStyles = breakoutStyles;
  }

  return jsx("div", {
    ref: handleRef,
    "data-layout": node.attrs.layout,
    className: classNames,
    css: wrapperStyle,
    style: customContainerStyles
  }, jsx("div", {
    className: "extension-overflow-wrapper ".concat(hasBody ? 'with-body' : '')
  }, jsx("div", {
    css: overlay,
    className: "extension-overlay"
  }), jsx("div", {
    css: header,
    contentEditable: false,
    className: headerClassNames
  }, !removeBorder && jsx(ExtensionLozenge, {
    node: node
  }), children), hasBody && jsx("div", {
    css: contentWrapper
  }, jsx("div", {
    css: content,
    ref: handleContentDOMRef,
    className: "extension-content block"
  }))));
}

var Extension = function Extension(props) {
  return jsx(WithPluginState, {
    editorView: props.view,
    plugins: {
      widthState: widthPluginKey
    },
    render: function render(_ref) {
      var widthState = _ref.widthState;
      return jsx(ExtensionWithPluginState, _extends({
        widthState: widthState
      }, props));
    }
  });
};

export default overflowShadow(Extension, {
  overflowSelector: '.extension-overflow-wrapper'
});
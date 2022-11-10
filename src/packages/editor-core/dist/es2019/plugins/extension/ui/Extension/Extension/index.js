import _extends from "@babel/runtime/helpers/extends";

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
  const {
    node,
    handleContentDOMRef,
    children,
    widthState = {
      width: 0
    },
    handleRef,
    shadowClassNames,
    hideFrame,
    editorAppearance
  } = props;
  const hasBody = node.type.name === 'bodiedExtension';
  const isMobile = editorAppearance === 'mobile';
  const hasChildren = !!children;
  const removeBorder = hideFrame && !isMobile && !hasBody || false;
  const shouldBreakout = // Extension should breakout when the layout is set to 'full-width' or 'wide'.
  ['full-width', 'wide'].includes(node.attrs.layout) && // Extension breakout state should only be respected for top level nodes.
  props.view.state.doc.resolve(props.getPos()).depth === 0 && // Extension breakout state should not be respected when the editor appearance is full-width mode
  editorAppearance !== 'full-width';
  const classNames = classnames('extension-container', 'block', shadowClassNames, {
    'with-overlay': !hasBody,
    'without-frame': removeBorder,
    [widerLayoutClassName]: shouldBreakout
  });
  const headerClassNames = classnames({
    'with-children': hasChildren,
    'without-frame': removeBorder
  });
  let customContainerStyles = {};

  if (shouldBreakout) {
    const {
      type,
      ...breakoutStyles
    } = calculateBreakoutStyles({
      mode: node.attrs.layout,
      widthStateWidth: widthState.width,
      widthStateLineLength: widthState.lineLength
    });
    customContainerStyles = breakoutStyles;
  }

  return jsx("div", {
    ref: handleRef,
    "data-layout": node.attrs.layout,
    className: classNames,
    css: wrapperStyle,
    style: customContainerStyles
  }, jsx("div", {
    className: `extension-overflow-wrapper ${hasBody ? 'with-body' : ''}`
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

const Extension = props => {
  return jsx(WithPluginState, {
    editorView: props.view,
    plugins: {
      widthState: widthPluginKey
    },
    render: ({
      widthState
    }) => jsx(ExtensionWithPluginState, _extends({
      widthState: widthState
    }, props))
  });
};

export default overflowShadow(Extension, {
  overflowSelector: '.extension-overflow-wrapper'
});
/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { wrapperStyle } from './styles';
export default class InlineExtension extends Component {
  render() {
    const {
      node,
      children
    } = this.props;
    const hasChildren = !!children;
    const className = hasChildren ? 'with-overlay with-children' : 'with-overlay';
    return jsx("div", {
      css: wrapperStyle,
      className: `extension-container inline ${className}`
    }, jsx("div", {
      css: overlay,
      className: "extension-overlay"
    }), children ? children : jsx(ExtensionLozenge, {
      node: node
    }));
  }

}
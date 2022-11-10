import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { dropdown } from './styles';
export default class DropdownWrapper extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleClick", actions => {
      const {
        actionOnClick,
        renderOnClick
      } = actions;
      const {
        editorActions
      } = this.props;

      if (actionOnClick) {
        actionOnClick(editorActions);
        this.props.togglePopup();
      } else if (renderOnClick) {
        this.props.onClick(editorActions, renderOnClick);
      }
    });
  }

  render() {
    // adding onClick handler to each DropdownItem component
    const children = React.Children.map(this.props.children, child => /*#__PURE__*/React.cloneElement(child, {
      onClick: this.handleClick
    }));
    return jsx("div", {
      css: dropdown
    }, children);
  }

}
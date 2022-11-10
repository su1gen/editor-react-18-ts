import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { clickAreaClickHandler } from '../click-area-helper';
const clickWrapper = css`
  flex-grow: 1;
  height: 100%;
`;
export default class ClickAreaBlock extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleClick", event => {
      const {
        editorView: view,
        editorDisabled
      } = this.props;

      if (!view) {
        return;
      }

      if (!editorDisabled) {
        // if the editor is disabled -- we don't want to intercept any click events
        clickAreaClickHandler(view, event);
      }
    });
  }

  render() {
    return jsx("div", {
      "data-testid": "click-wrapper",
      css: clickWrapper,
      onClick: this.handleClick
    }, this.props.children);
  }

}
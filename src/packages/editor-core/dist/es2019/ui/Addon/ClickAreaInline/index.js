import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { createParagraphAtEnd } from '../../../commands';
const clickArea = css`
  flex-grow: 1;
`;
export default class ClickAreaInline extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "handleClick", event => {
      const {
        editorView
      } = this.props;

      if (editorView) {
        if (createParagraphAtEnd()(editorView.state, editorView.dispatch)) {
          editorView.focus();
          event.stopPropagation();
        }
      }
    });
  }

  render() {
    return jsx("div", {
      css: clickArea,
      onClick: this.handleClick
    });
  }

}
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { clickAreaClickHandler } from '../click-area-helper';
/**
 * Fills the visible viewport height so that it can filter
 * clicks/taps within or below the content (e.g. if the content
 * doesn't exceed the viewport, or whether it overflows it).
 */

const clickWrapper = ({
  isExpanded,
  minHeight
}) => css`
  height: 100%;
  ${isExpanded && minHeight ? `min-height: ${minHeight}px` : ''};
`;

/**
 * Click Area is responsible for improving UX by ensuring the user
 * can always tap beneath the content area, to insert more content.
 *
 * This is achieved by inserting a new empty paragraph at the end of
 * the document (if one doesn't already exist).
 *
 * This is particularly important when the content exceeds the visible
 * viewport height, and if the last content node captures text selection
 * e.g. table, layouts, codeblock, etc.
 *
 * This relies on the Scroll Gutter plugin which inserts additional
 * whitespace at the end of the document when it overflows the viewport.
 */
export default class ClickAreaMobile extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "clickElementRef", /*#__PURE__*/React.createRef());

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

      const scrollGutterClicked = event.clientY > view.dom.getBoundingClientRect().bottom; // Reset the default prosemirror scrollIntoView logic by
      // clamping the scroll position to the bottom of the viewport.

      if (scrollGutterClicked) {
        event.preventDefault();

        if (this.clickElementRef.current) {
          this.clickElementRef.current.scrollIntoView(false);
        }
      }
    });
  }

  render() {
    return jsx("div", {
      css: clickWrapper({
        isExpanded: this.props.isExpanded,
        minHeight: this.props.minHeight
      }),
      className: "editor-click-wrapper",
      onClick: this.handleClick,
      ref: this.clickElementRef
    }, this.props.children);
  }

}
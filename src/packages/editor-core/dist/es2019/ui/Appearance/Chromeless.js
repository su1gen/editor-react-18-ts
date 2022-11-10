import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import { createEditorContentStyle } from '../ContentStyles';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { scrollbarStyles } from '../styles';
import WithFlash from '../WithFlash';
const chromelessEditor = css`
  line-height: 20px;
  height: auto;

  overflow-x: hidden;
  overflow-y: auto;
  ${scrollbarStyles};
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
const ContentArea = createEditorContentStyle();
ContentArea.displayName = 'ContentArea';
export default class Editor extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "appearance", 'chromeless');

    _defineProperty(this, "containerElement", null);

    _defineProperty(this, "renderChrome", ({
      maxContentSize
    }) => {
      const {
        editorDOMElement,
        editorView,
        editorActions,
        eventDispatcher,
        providerFactory,
        contentComponents,
        customContentComponents,
        maxHeight,
        minHeight = 30,
        popupsMountPoint,
        popupsBoundariesElement,
        popupsScrollableElement,
        disabled,
        dispatchAnalyticsEvent
      } = this.props;
      const maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
      return jsx(WithFlash, {
        animate: maxContentSizeReached
      }, jsx("div", {
        css: [chromelessEditor, maxHeight && css`
                max-height: ${maxHeight}px;
              `, css`
              min-height: ${minHeight}px;
            `],
        "data-testid": "chromeless-editor",
        ref: ref => this.containerElement = ref
      }, jsx(ContentArea, {
        className: "ak-editor-content-area"
      }, customContentComponents, jsx(PluginSlot, {
        editorView: editorView,
        editorActions: editorActions,
        eventDispatcher: eventDispatcher,
        providerFactory: providerFactory,
        appearance: this.appearance,
        items: contentComponents,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement,
        containerElement: this.containerElement,
        disabled: !!disabled,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        wrapperElement: this.containerElement
      }), editorDOMElement)));
    });
  }

  render() {
    return jsx(WithPluginState, {
      plugins: {
        maxContentSize: maxContentSizePluginKey
      },
      render: this.renderChrome
    });
  }

}

_defineProperty(Editor, "displayName", 'ChromelessEditorAppearance');
/** @jsx jsx */
import { jsx, useTheme } from '@emotion/react';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { ContextPanelConsumer } from '../../ContextPanel/context';
import React from 'react';
import { injectIntl } from 'react-intl-next';
import { ClickAreaBlock } from '../../Addon';
import ContextPanel from '../../ContextPanel';
import PluginSlot from '../../PluginSlot';
import WidthEmitter from '../../WidthEmitter';
import { contentArea, editorContentAreaStyle, sidebarArea, ScrollContainer, editorContentGutterStyle, positionedOverEditorStyle } from './StyledComponents';
import messages from './messages';
export const CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
const Content = /*#__PURE__*/React.memo(props => {
  const theme = useTheme();
  const fullWidthMode = props.appearance === 'full-width';
  return jsx(WidthConsumer, null, ({
    width
  }) => jsx(ContextPanelConsumer, null, ({
    positionedOverEditor
  }) => jsx("div", {
    css: [contentArea, positionedOverEditor && positionedOverEditorStyle],
    "data-testid": CONTENT_AREA_TEST_ID
  }, jsx(ScrollContainer, {
    ref: props.scrollContainerRef,
    className: "fabric-editor-popup-scroll-parent"
  }, jsx(ClickAreaBlock, {
    editorView: props.editorView,
    editorDisabled: props.disabled
  }, jsx("div", {
    css: editorContentAreaStyle({
      fullWidthMode,
      layoutMaxWidth: theme.layoutMaxWidth,
      containerWidth: width
    }),
    role: "region",
    "aria-label": props.intl.formatMessage(messages.editableContentLabel),
    ref: props.contentAreaRef
  }, jsx("div", {
    css: editorContentGutterStyle,
    className: ['ak-editor-content-area', fullWidthMode ? 'fabric-editor--full-width-mode' : ''].join(' ')
  }, props.customContentComponents, jsx(PluginSlot, {
    editorView: props.editorView,
    editorActions: props.editorActions,
    eventDispatcher: props.eventDispatcher,
    providerFactory: props.providerFactory,
    appearance: props.appearance,
    items: props.contentComponents,
    contentArea: props.contentArea,
    popupsMountPoint: props.popupsMountPoint,
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsScrollableElement: props.popupsScrollableElement,
    disabled: !!props.disabled,
    containerElement: props.scrollContainer,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    wrapperElement: props.wrapperElement
  }), props.editorDOMElement)))), jsx("div", {
    css: sidebarArea
  }, props.contextPanel || jsx(ContextPanel, {
    visible: false
  })), jsx(WidthEmitter, {
    editorView: props.editorView
  }))));
});
export const FullPageContentArea = injectIntl(Content);
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
export var CONTENT_AREA_TEST_ID = 'ak-editor-fp-content-area';
var Content = /*#__PURE__*/React.memo(function (props) {
  var theme = useTheme();
  var fullWidthMode = props.appearance === 'full-width';
  return jsx(WidthConsumer, null, function (_ref) {
    var width = _ref.width;
    return jsx(ContextPanelConsumer, null, function (_ref2) {
      var positionedOverEditor = _ref2.positionedOverEditor;
      return jsx("div", {
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
          fullWidthMode: fullWidthMode,
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
      }));
    });
  });
});
export var FullPageContentArea = injectIntl(Content);
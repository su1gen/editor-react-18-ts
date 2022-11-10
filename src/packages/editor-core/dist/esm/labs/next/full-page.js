import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;

/** @jsx jsx */
import rafSchedule from 'raf-schd';
import React from 'react';
import { css, jsx } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { BaseTheme } from '@atlaskit/editor-common/ui';
import { akEditorMenuZIndex, akEditorToolbarKeylineHeight } from '@atlaskit/editor-shared-styles';
import ContentStyles from '../../ui/ContentStyles';
import WidthEmitter from '../../ui/WidthEmitter';
import { ClickAreaBlock } from '../../ui/Addon';
import { scrollbarStyles } from '../../ui/styles';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import AvatarsWithPluginState from '../../plugins/collab-edit/ui';
import { Editor, EditorContent, useEditorSharedConfig } from './Editor';
import { Toolbar } from './Toolbar';
import { ContentComponents } from './ContentComponents';
import { useCreateAnalyticsHandler } from './internal/hooks/use-analytics';
import { ContextPanelWidthProvider } from '../../ui/ContextPanel/context';
var fullPageEditorWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  min-width: 340px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n"])));
var scrollContainer = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex-grow: 1;\n  overflow-y: scroll;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  scroll-behavior: smooth;\n  ", ";\n"])), scrollbarStyles);
var GUTTER_PADDING = 32;
var GUTTER_STYLE = {
  padding: "0 ".concat(GUTTER_PADDING, "px")
};
var contentArea = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  height: 100%;\n  box-sizing: border-box;\n"])));

var editorContentArea = function editorContentArea(theme) {
  return css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  line-height: 24px;\n  height: 100%;\n  width: 100%;\n  max-width: ", "px;\n  padding-top: 50px;\n  margin: 0 auto;\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  padding-bottom: 55px;\n\n  & .ProseMirror {\n    flex-grow: 1;\n    box-sizing: border-box;\n  }\n\n  && .ProseMirror {\n    & > * {\n      clear: both;\n    }\n    > p,\n    > ul,\n    > ol,\n    > h1,\n    > h2,\n    > h3,\n    > h4,\n    > h5,\n    > h6 {\n      clear: none;\n    }\n  }\n  ", ";\n"])), theme.layoutMaxWidth + GUTTER_PADDING * 2, tableFullPageEditorStyles);
};

var mainToolbar = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  position: relative;\n  align-items: center;\n  box-shadow: 'none';\n\n  transition: box-shadow 200ms;\n  z-index: ", ";\n  display: flex;\n  height: 80px;\n  flex-shrink: 0;\n  background-color: ", ";\n\n  & object {\n    height: 0 !important;\n  }\n"])), akEditorMenuZIndex, token('elevation.surface', 'white'));
var mainToolbarWithKeyline = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  ", "\n  box-shadow: 0 ", "px 0 0 ", "\n"])), mainToolbar, akEditorToolbarKeylineHeight, token('color.border', N30));
var mainToolbarCustomComponentsSlot = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: flex-end;\n  flex-grow: 1;\n"])));
var sidebarArea = css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  height: 100%;\n  box-sizing: border-box;\n"])));

function useKeyline() {
  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      showKeyline = _React$useState2[0],
      setShowKeyline = _React$useState2[1];

  var scrollContainerRef = React.useRef(null);
  React.useEffect(function () {
    var current = scrollContainerRef.current;
    var handleScroll = rafSchedule(function () {
      if (!current) {
        return;
      }

      var scrollTop = current.scrollTop;
      setShowKeyline(scrollTop > akEditorToolbarKeylineHeight);
    });

    if (!current) {
      return;
    }

    window.addEventListener('resize', handleScroll);
    current.addEventListener('scroll', handleScroll);
    handleScroll();
    return function () {
      if (current) {
        current.removeEventListener('scroll', handleScroll);
      }

      window.removeEventListener('resize', handleScroll);
    };
  }, []);
  return [showKeyline, scrollContainerRef];
}

function FullPage(props) {
  var primaryToolbarComponents = props.primaryToolbarComponents,
      contentComponents = props.contentComponents,
      collabEdit = props.collabEdit,
      createAnalyticsEvent = props.createAnalyticsEvent,
      contextPanel = props.contextPanel;
  var handleAnalyticsEvent = useCreateAnalyticsHandler(createAnalyticsEvent);

  var _useKeyline = useKeyline(),
      _useKeyline2 = _slicedToArray(_useKeyline, 2),
      showKeyline = _useKeyline2[0],
      scrollContainerRef = _useKeyline2[1];

  var config = useEditorSharedConfig();
  var wrapperElementRef = /*#__PURE__*/React.createRef();
  return jsx(ContextPanelWidthProvider, null, jsx(Editor, _extends({}, props, {
    onAnalyticsEvent: handleAnalyticsEvent
  }), jsx(BaseTheme, null, jsx("div", {
    css: fullPageEditorWrapper,
    className: "akEditor",
    ref: wrapperElementRef
  }, jsx("div", {
    "data-testid": "ak-editor-main-toolbar",
    css: showKeyline ? mainToolbarWithKeyline : mainToolbar
  }, jsx(Toolbar, {
    containerElement: scrollContainerRef.current
  }), jsx("div", {
    css: mainToolbarCustomComponentsSlot
  }, !config ? null : jsx(AvatarsWithPluginState, {
    editorView: config.editorView,
    eventDispatcher: config.eventDispatcher,
    inviteToEditHandler: collabEdit === null || collabEdit === void 0 ? void 0 : collabEdit.inviteToEditHandler,
    isInviteToEditButtonSelected: collabEdit === null || collabEdit === void 0 ? void 0 : collabEdit.isInviteToEditButtonSelected
  }), primaryToolbarComponents)), jsx("div", {
    css: contentArea
  }, jsx(ContentStyles, {
    ref: scrollContainerRef,
    className: "fabric-editor-popup-scroll-parent",
    css: scrollContainer
  }, jsx(ClickAreaBlock, {
    editorView: config === null || config === void 0 ? void 0 : config.editorView
  }, jsx("div", {
    css: editorContentArea
  }, jsx("div", {
    style: GUTTER_STYLE,
    className: "ak-editor-content-area"
  }, contentComponents, jsx(EditorContent, null), jsx(ContentComponents, {
    wrapperElement: wrapperElementRef.current,
    containerElement: scrollContainerRef.current
  }))))), contextPanel && jsx("div", {
    css: sidebarArea
  }, contextPanel), jsx(WidthEmitter, {
    editorView: config === null || config === void 0 ? void 0 : config.editorView
  }))))));
}

FullPage.displayName = 'FullPageEditor';
var FullPageWithAnalytics = withAnalyticsEvents()(FullPage);
export { FullPageWithAnalytics as FullPage };
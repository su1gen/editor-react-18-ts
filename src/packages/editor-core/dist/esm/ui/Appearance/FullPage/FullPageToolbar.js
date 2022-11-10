import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

/** @jsx jsx */
import React, { useState, useEffect } from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import AvatarsWithPluginState from '../../../plugins/collab-edit/ui';
import FindReplaceToolbarButtonWithState from '../../../plugins/find-replace/FindReplaceToolbarButtonWithState';
import { BeforePrimaryToolbarWrapper } from '../../../plugins/before-primaryToolbar/ui/BeforePrimaryToolbarWrapper';
import Toolbar from '../../Toolbar';
import { mainToolbarStyle, mainToolbarIconBeforeStyle, mainToolbarFirstChildStyle, mainToolbarSecondChildStyle, nonCustomToolbarWrapperStyle, customToolbarWrapperStyle, MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT } from './MainToolbar';
import { ContextPanelConsumer } from '../../ContextPanel/context';
import messages from './messages';
export var EditorToolbar = /*#__PURE__*/React.memo(function (props) {
  var _props$featureFlags, _props$featureFlags2, _props$featureFlags3, _props$featureFlags4, _props$collabEdit, _props$collabEdit2, _props$collabEdit3, _props$featureFlags5, _props$featureFlags6;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      shouldSplitToolbar = _useState2[0],
      setShouldSplitToolbar = _useState2[1];

  var nonCustomToolbar = jsx("div", {
    css: nonCustomToolbarWrapperStyle
  }, props.beforeIcon && jsx("div", {
    css: mainToolbarIconBeforeStyle
  }, props.beforeIcon), jsx(Toolbar, {
    editorView: props.editorView,
    editorActions: props.editorActions,
    eventDispatcher: props.eventDispatcher,
    providerFactory: props.providerFactory,
    appearance: props.appearance,
    items: props.primaryToolbarComponents,
    popupsMountPoint: props.popupsMountPoint,
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsScrollableElement: props.popupsScrollableElement,
    disabled: props.disabled,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    containerElement: props.containerElement,
    hasMinWidth: props.hasMinWidth,
    twoLineEditorToolbar: !!((_props$featureFlags = props.featureFlags) !== null && _props$featureFlags !== void 0 && _props$featureFlags.twoLineEditorToolbar)
  }));
  var customToolbar = jsx("div", {
    css: customToolbarWrapperStyle
  }, (_props$featureFlags2 = props.featureFlags) !== null && _props$featureFlags2 !== void 0 && _props$featureFlags2.twoLineEditorToolbar && !!props.customPrimaryToolbarComponents && 'before' in props.customPrimaryToolbarComponents ? jsx(BeforePrimaryToolbarWrapper, {
    beforePrimaryToolbarComponents: props.customPrimaryToolbarComponents.before
  }) : null, (props === null || props === void 0 ? void 0 : (_props$featureFlags3 = props.featureFlags) === null || _props$featureFlags3 === void 0 ? void 0 : _props$featureFlags3.showAvatarGroupAsPlugin) === true && !((_props$featureFlags4 = props.featureFlags) !== null && _props$featureFlags4 !== void 0 && _props$featureFlags4.twoLineEditorToolbar) ? null : jsx(AvatarsWithPluginState, {
    editorView: props.editorView,
    eventDispatcher: props.eventDispatcher,
    inviteToEditComponent: (_props$collabEdit = props.collabEdit) === null || _props$collabEdit === void 0 ? void 0 : _props$collabEdit.inviteToEditComponent,
    inviteToEditHandler: (_props$collabEdit2 = props.collabEdit) === null || _props$collabEdit2 === void 0 ? void 0 : _props$collabEdit2.inviteToEditHandler,
    isInviteToEditButtonSelected: (_props$collabEdit3 = props.collabEdit) === null || _props$collabEdit3 === void 0 ? void 0 : _props$collabEdit3.isInviteToEditButtonSelected
  }), (_props$featureFlags5 = props.featureFlags) !== null && _props$featureFlags5 !== void 0 && _props$featureFlags5.findReplace && (_props$featureFlags6 = props.featureFlags) !== null && _props$featureFlags6 !== void 0 && _props$featureFlags6.twoLineEditorToolbar ? jsx(FindReplaceToolbarButtonWithState, {
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsMountPoint: props.popupsMountPoint,
    popupsScrollableElement: props.popupsScrollableElement,
    editorView: props.editorView,
    containerElement: props.containerElement,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent
  }) : null, !!props.customPrimaryToolbarComponents && 'after' in props.customPrimaryToolbarComponents ? props.customPrimaryToolbarComponents.after : props.customPrimaryToolbarComponents);
  useEffect(function () {
    var _props$featureFlags7;

    if ((_props$featureFlags7 = props.featureFlags) !== null && _props$featureFlags7 !== void 0 && _props$featureFlags7.twoLineEditorToolbar) {
      var updateOnResize = function updateOnResize() {
        setShouldSplitToolbar(window.innerWidth <= MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT);
      };

      window.addEventListener('resize', updateOnResize);
      updateOnResize();
      return function () {
        return window.removeEventListener('resize', updateOnResize);
      };
    }
  });
  return jsx(ContextPanelConsumer, null, function (_ref) {
    var _props$featureFlags8, _props$featureFlags9, _props$featureFlags10;

    var contextPanelWidth = _ref.width;
    return jsx("div", {
      css: mainToolbarStyle(props.showKeyline || contextPanelWidth > 0, !!((_props$featureFlags8 = props.featureFlags) !== null && _props$featureFlags8 !== void 0 && _props$featureFlags8.twoLineEditorToolbar)),
      "data-testid": "ak-editor-main-toolbar"
    }, jsx("div", {
      css: mainToolbarFirstChildStyle(!!((_props$featureFlags9 = props.featureFlags) !== null && _props$featureFlags9 !== void 0 && _props$featureFlags9.twoLineEditorToolbar)),
      role: "toolbar",
      "aria-label": props.intl.formatMessage(messages.toolbarLabel)
    }, shouldSplitToolbar ? customToolbar : nonCustomToolbar), jsx("div", {
      css: mainToolbarSecondChildStyle(!!((_props$featureFlags10 = props.featureFlags) !== null && _props$featureFlags10 !== void 0 && _props$featureFlags10.twoLineEditorToolbar)),
      "data-testid": 'avatar-group-outside-plugin',
      role: "region",
      "aria-label": props.intl.formatMessage(messages.pageActionsLabel)
    }, shouldSplitToolbar ? nonCustomToolbar : customToolbar));
  });
});
export var FullPageToolbar = injectIntl(EditorToolbar);
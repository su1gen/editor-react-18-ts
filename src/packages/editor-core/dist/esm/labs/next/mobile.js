import _extends from "@babel/runtime/helpers/extends";
import React, { useCallback } from 'react';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { MobileAppearance } from '../../ui/AppearanceComponents/Mobile';
import { EditorSharedConfigConsumer, Editor, EditorContent } from './Editor';
import { useCreateAnalyticsHandler } from './internal/hooks/use-analytics';
import { ContextAdapter } from '../../nodeviews/context-adapter';
export function MobileEditor(props) {
  var maxHeight = props.maxHeight,
      createAnalyticsEvent = props.createAnalyticsEvent,
      disabled = props.disabled;
  var handleAnalyticsEvent = useCreateAnalyticsHandler(createAnalyticsEvent);
  var renderWithConfig = useCallback(function (config) {
    return /*#__PURE__*/React.createElement(MobileAppearance, {
      editorView: config && config.editorView,
      maxHeight: maxHeight,
      editorDisabled: disabled
    }, /*#__PURE__*/React.createElement(EditorContent, null));
  }, [maxHeight, disabled]);
  return /*#__PURE__*/React.createElement(ContextAdapter, null, /*#__PURE__*/React.createElement(Editor, _extends({}, props, {
    onAnalyticsEvent: handleAnalyticsEvent
  }), /*#__PURE__*/React.createElement(EditorSharedConfigConsumer, null, renderWithConfig)));
}
MobileEditor.displayName = 'MobileEditor';
export var Mobile = withAnalyticsEvents()(MobileEditor);
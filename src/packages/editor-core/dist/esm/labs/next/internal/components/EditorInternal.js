import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React from 'react';
import PropTypes from 'prop-types';
import { WidthProvider } from '@atlaskit/editor-common/ui';
import { injectIntl } from 'react-intl-next';
import { useProviderFactory } from '@atlaskit/editor-common/provider-factory';
import EditorContext from '../../../../ui/EditorContext';
import EditorActions from '../../../../actions';
import { EditorSharedConfigProvider } from '../context/shared-config';
import { useEditor } from '../hooks/use-editor';
import { EditorContentProvider } from './EditorContent';

function BaseEditorInternal(_ref, context) {
  var onAnalyticsEvent = _ref.onAnalyticsEvent,
      disabled = _ref.disabled,
      transformer = _ref.transformer,
      defaultValue = _ref.defaultValue,
      plugins = _ref.plugins,
      portalProviderAPI = _ref.portalProviderAPI,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsScrollableElement = _ref.popupsScrollableElement,
      onChange = _ref.onChange,
      onDestroy = _ref.onDestroy,
      onMount = _ref.onMount,
      children = _ref.children,
      intl = _ref.intl;
  // Need to memoize editor actions otherwise in case when editor is not
  // wrapped with EditorContext every prop change triggers all hooks
  // that depend on editorActions
  var maybeEditorActions = (context || {}).editorActions;
  var editorActions = React.useMemo(function () {
    return maybeEditorActions || new EditorActions();
  }, [maybeEditorActions]); // Get the provider factory from context

  var providerFactory = useProviderFactory();

  var getIntl = function getIntl() {
    return intl;
  };

  var _useEditor = useEditor({
    context: context,
    editorActions: editorActions,
    onAnalyticsEvent: onAnalyticsEvent,
    disabled: disabled,
    transformer: transformer,
    defaultValue: defaultValue,
    plugins: plugins,
    portalProviderAPI: portalProviderAPI,
    popupsMountPoint: popupsMountPoint,
    popupsBoundariesElement: popupsBoundariesElement,
    popupsScrollableElement: popupsScrollableElement,
    onChange: onChange,
    onDestroy: onDestroy,
    onMount: onMount,
    providerFactory: providerFactory,
    featureFlags: {},
    getIntl: getIntl
  }),
      _useEditor2 = _slicedToArray(_useEditor, 2),
      editorSharedConfig = _useEditor2[0],
      mountEditor = _useEditor2[1];

  return /*#__PURE__*/React.createElement(WidthProvider, null, /*#__PURE__*/React.createElement(EditorContext, {
    editorActions: editorActions
  }, /*#__PURE__*/React.createElement(EditorSharedConfigProvider, {
    value: editorSharedConfig
  }, /*#__PURE__*/React.createElement(EditorContentProvider, {
    value: mountEditor
  }, children))));
}

BaseEditorInternal.contextTypes = {
  editorActions: PropTypes.object
};
export var EditorInternal = injectIntl(BaseEditorInternal);
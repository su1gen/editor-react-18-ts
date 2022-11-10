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

function BaseEditorInternal({
  onAnalyticsEvent,
  disabled,
  transformer,
  defaultValue,
  plugins,
  portalProviderAPI,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  onChange,
  onDestroy,
  onMount,
  children,
  intl
}, context) {
  // Need to memoize editor actions otherwise in case when editor is not
  // wrapped with EditorContext every prop change triggers all hooks
  // that depend on editorActions
  const maybeEditorActions = (context || {}).editorActions;
  const editorActions = React.useMemo(() => maybeEditorActions || new EditorActions(), [maybeEditorActions]); // Get the provider factory from context

  const providerFactory = useProviderFactory();

  const getIntl = () => intl;

  const [editorSharedConfig, mountEditor] = useEditor({
    context,
    editorActions,
    onAnalyticsEvent,
    disabled,
    transformer,
    defaultValue,
    plugins,
    portalProviderAPI,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    onChange,
    onDestroy,
    onMount,
    providerFactory,
    featureFlags: {},
    getIntl
  });
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
export const EditorInternal = injectIntl(BaseEditorInternal);
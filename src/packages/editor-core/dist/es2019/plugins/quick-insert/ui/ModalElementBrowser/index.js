import React, { useCallback } from 'react';
import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey } from '../../plugin-key';
import { searchQuickInsertItems } from '../../search';
import ModalElementBrowser from '../../../../ui/ElementBrowser/ModalElementBrowser';
import { closeElementBrowserModal, insertItem } from '../../commands';

const Modal = ({
  quickInsertState,
  editorView,
  helpUrl
}) => {
  const getItems = useCallback((query, category) => searchQuickInsertItems(quickInsertState, {})(query, category), [quickInsertState]);
  const focusInEditor = useCallback(() => {
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }, [editorView]);
  const onInsertItem = useCallback(item => {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
    focusInEditor();
    insertItem(item)(editorView.state, editorView.dispatch);
  }, [editorView.dispatch, editorView.state, focusInEditor]);
  const onClose = useCallback(() => {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
    focusInEditor();
  }, [editorView.dispatch, editorView.state, focusInEditor]);
  return /*#__PURE__*/React.createElement(ModalElementBrowser, {
    getItems: getItems,
    onInsertItem: onInsertItem,
    helpUrl: helpUrl,
    isOpen: quickInsertState && quickInsertState.isElementBrowserModalOpen || false,
    emptyStateHandler: quickInsertState && quickInsertState.emptyStateHandler,
    onClose: onClose
  });
};

export default (({
  editorView,
  helpUrl
}) => {
  const render = useCallback(({
    quickInsertState
  }) => /*#__PURE__*/React.createElement(Modal, {
    quickInsertState: quickInsertState,
    editorView: editorView,
    helpUrl: helpUrl
  }), [editorView, helpUrl]);
  return /*#__PURE__*/React.createElement(WithPluginState, {
    plugins: {
      quickInsertState: pluginKey
    },
    render: render
  });
});
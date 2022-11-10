import React, { useCallback } from 'react';
import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey } from '../../plugin-key';
import { searchQuickInsertItems } from '../../search';
import ModalElementBrowser from '../../../../ui/ElementBrowser/ModalElementBrowser';
import { closeElementBrowserModal, insertItem } from '../../commands';

var Modal = function Modal(_ref) {
  var quickInsertState = _ref.quickInsertState,
      editorView = _ref.editorView,
      helpUrl = _ref.helpUrl;
  var getItems = useCallback(function (query, category) {
    return searchQuickInsertItems(quickInsertState, {})(query, category);
  }, [quickInsertState]);
  var focusInEditor = useCallback(function () {
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }, [editorView]);
  var onInsertItem = useCallback(function (item) {
    closeElementBrowserModal()(editorView.state, editorView.dispatch);
    focusInEditor();
    insertItem(item)(editorView.state, editorView.dispatch);
  }, [editorView.dispatch, editorView.state, focusInEditor]);
  var onClose = useCallback(function () {
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

export default (function (_ref2) {
  var editorView = _ref2.editorView,
      helpUrl = _ref2.helpUrl;
  var render = useCallback(function (_ref3) {
    var quickInsertState = _ref3.quickInsertState;
    return /*#__PURE__*/React.createElement(Modal, {
      quickInsertState: quickInsertState,
      editorView: editorView,
      helpUrl: helpUrl
    });
  }, [editorView, helpUrl]);
  return /*#__PURE__*/React.createElement(WithPluginState, {
    plugins: {
      quickInsertState: pluginKey
    },
    render: render
  });
});
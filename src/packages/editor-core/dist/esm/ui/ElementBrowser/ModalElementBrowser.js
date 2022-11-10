import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

/** @jsx jsx */
import React, { useState, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { DN50, N0 } from '@atlaskit/theme/colors';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import Button from '@atlaskit/button/custom-theme-button';
import Modal, { ModalTransition, useModal } from '@atlaskit/modal-dialog';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import ElementBrowser from './components/ElementBrowserLoader';
import { getCategories } from './categories';
import { MODAL_WRAPPER_PADDING } from './constants';
import { messages } from './messages';
import { token } from '@atlaskit/tokens';
var actions = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: inline-flex;\n  margin: 0 -4px;\n"])));
var actionItem = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex: 1 0 auto;\n  margin: 0 4px;\n"])));
var wrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex: 1 1 auto;\n  box-sizing: border-box;\n  padding: ", "px ", "px 0 10px;\n  overflow: hidden;\n  background-color: ", ";\n  border-radius: ", "px;\n"])), MODAL_WRAPPER_PADDING, MODAL_WRAPPER_PADDING, themed({
  light: token('elevation.surface.overlay', N0),
  dark: token('elevation.surface.overlay', DN50)
})(), borderRadius());
var modalFooter = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  padding: ", "px;\n\n  position: relative;\n  align-items: center;\n  justify-content: space-between;\n"])), MODAL_WRAPPER_PADDING);

var ModalElementBrowser = function ModalElementBrowser(props) {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      selectedItem = _useState2[0],
      setSelectedItem = _useState2[1];

  var helpUrl = props.helpUrl,
      intl = props.intl;
  var onSelectItem = useCallback(function (item) {
    setSelectedItem(item);
  }, [setSelectedItem]);
  var onInsertItem = useCallback(function (item) {
    props.onInsertItem(item);
  }, [props]);
  var RenderFooter = useCallback(function () {
    return jsx(Footer, {
      onInsert: function onInsert() {
        return onInsertItem(selectedItem);
      },
      beforeElement: helpUrl ? HelpLink(helpUrl, intl.formatMessage(messages.help)) : undefined
    });
  }, [onInsertItem, selectedItem, helpUrl, intl]); // Since Modal uses stackIndex it's shouldCloseOnEscapePress prop doesn't work.

  var onKeyDown = useCallback(function (e) {
    if (e.key === 'Escape') {
      props.onClose();
    }
  }, [props]);
  var RenderBody = useCallback(function () {
    return jsx("div", {
      css: wrapper
    }, jsx(ElementBrowser, {
      categories: getCategories(props.intl),
      getItems: props.getItems,
      showSearch: true,
      showCategories: true,
      mode: "full",
      onSelectItem: onSelectItem,
      onInsertItem: onInsertItem,
      emptyStateHandler: props.emptyStateHandler
    }));
  }, [props.intl, props.getItems, onSelectItem, onInsertItem, props.emptyStateHandler]);
  return jsx("div", {
    "data-editor-popup": true,
    onClick: onModalClick,
    onKeyDown: onKeyDown
  }, jsx(ModalTransition, null, props.isOpen && jsx(Modal, {
    testId: "element-browser-modal-dialog",
    stackIndex: 0,
    key: "element-browser-modal",
    onClose: props.onClose,
    height: "664px",
    width: "x-large",
    autoFocus: false // defaults to true and doesn't work along with stackIndex=1.
    // packages/design-system/modal-dialog/src/components/Content.tsx Line 287
    ,
    shouldCloseOnEscapePress: false
  }, jsx(RenderBody, null), jsx(RenderFooter, null))));
};

ModalElementBrowser.displayName = 'ModalElementBrowser'; // Prevent ModalElementBrowser click propagation through to the editor.

var onModalClick = function onModalClick(e) {
  return e.stopPropagation();
};

var Footer = function Footer(_ref) {
  var onInsert = _ref.onInsert,
      beforeElement = _ref.beforeElement;

  var _useModal = useModal(),
      onClose = _useModal.onClose;

  return jsx("div", {
    css: modalFooter
  }, beforeElement ? beforeElement : jsx("span", null), jsx("div", {
    css: actions
  }, jsx("div", {
    css: actionItem
  }, jsx(Button, {
    appearance: "primary",
    onClick: onInsert,
    testId: "ModalElementBrowser__insert-button"
  }, "Insert")), jsx("div", {
    css: actionItem
  }, jsx(Button, {
    appearance: "subtle",
    onClick: onClose,
    testId: "ModalElementBrowser__close-button"
  }, "Close"))));
};

var HelpLink = function HelpLink(url, helpText) {
  return jsx(Button, {
    iconBefore: jsx(QuestionCircleIcon, {
      label: "help",
      size: "medium"
    }),
    appearance: "subtle-link",
    href: url,
    target: "_blank",
    testId: "ModalElementBrowser__help-button"
  }, helpText);
};

export default injectIntl(ModalElementBrowser);
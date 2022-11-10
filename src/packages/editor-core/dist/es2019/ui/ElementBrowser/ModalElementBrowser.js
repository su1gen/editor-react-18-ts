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
const actions = css`
  display: inline-flex;
  margin: 0 -4px;
`;
const actionItem = css`
  flex: 1 0 auto;
  margin: 0 4px;
`;
const wrapper = css`
  display: flex;
  flex: 1 1 auto;
  box-sizing: border-box;
  padding: ${MODAL_WRAPPER_PADDING}px ${MODAL_WRAPPER_PADDING}px 0 10px;
  overflow: hidden;
  background-color: ${themed({
  light: token('elevation.surface.overlay', N0),
  dark: token('elevation.surface.overlay', DN50)
})()};
  border-radius: ${borderRadius()}px;
`;
const modalFooter = css`
  display: flex;
  padding: ${MODAL_WRAPPER_PADDING}px;

  position: relative;
  align-items: center;
  justify-content: space-between;
`;

const ModalElementBrowser = props => {
  const [selectedItem, setSelectedItem] = useState();
  const {
    helpUrl,
    intl
  } = props;
  const onSelectItem = useCallback(item => {
    setSelectedItem(item);
  }, [setSelectedItem]);
  const onInsertItem = useCallback(item => {
    props.onInsertItem(item);
  }, [props]);
  const RenderFooter = useCallback(() => jsx(Footer, {
    onInsert: () => onInsertItem(selectedItem),
    beforeElement: helpUrl ? HelpLink(helpUrl, intl.formatMessage(messages.help)) : undefined
  }), [onInsertItem, selectedItem, helpUrl, intl]); // Since Modal uses stackIndex it's shouldCloseOnEscapePress prop doesn't work.

  const onKeyDown = useCallback(e => {
    if (e.key === 'Escape') {
      props.onClose();
    }
  }, [props]);
  const RenderBody = useCallback(() => jsx("div", {
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
  })), [props.intl, props.getItems, onSelectItem, onInsertItem, props.emptyStateHandler]);
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

const onModalClick = e => e.stopPropagation();

const Footer = ({
  onInsert,
  beforeElement
}) => {
  const {
    onClose
  } = useModal();
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

const HelpLink = (url, helpText) => jsx(Button, {
  iconBefore: jsx(QuestionCircleIcon, {
    label: "help",
    size: "medium"
  }),
  appearance: "subtle-link",
  href: url,
  target: "_blank",
  testId: "ModalElementBrowser__help-button"
}, helpText);

export default injectIntl(ModalElementBrowser);
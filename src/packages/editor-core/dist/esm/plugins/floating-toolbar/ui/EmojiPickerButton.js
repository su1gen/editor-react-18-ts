import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import Button from '@atlaskit/button';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { Popup } from '@atlaskit/editor-common/ui';
import { EmojiPicker } from '@atlaskit/emoji';
import Tooltip from '@atlaskit/tooltip';
import EditorEmojiAddIcon from './EditorEmojiAddIcon';
import withOuterListeners from '../../../ui/with-outer-listeners'; // helps adjusts position of popup

var emojiPickerButtonWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n"]))); // helps to vertically align emoji picker
// both top and bottom margin should be 2px
// https://product-fabric.atlassian.net/browse/CETI-148

var emojiPickerWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  margin-bottom: -12px;\n  margin-top: -4px;\n"])));
export var EmojiPickerButton = function EmojiPickerButton(props) {
  var buttonRef = React.useRef(null);

  var _React$useState = React.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      isPopupOpen = _React$useState2[0],
      setIsPopupOpen = _React$useState2[1];

  var EmojiPickerWithListener = withOuterListeners(EmojiPicker);
  React.useEffect(function () {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(isPopupOpen);
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [isPopupOpen]);

  var togglePopup = function togglePopup() {
    setIsPopupOpen(!isPopupOpen);
  };

  var updateEmoji = function updateEmoji(emoji) {
    setIsPopupOpen(false);
    props.editorView && props.editorView.focus();
    props.onChange && props.onChange(emoji);
  };

  var isDetachedElement = function isDetachedElement(el) {
    return !document.body.contains(el);
  };

  var handleEmojiClickOutside = function handleEmojiClickOutside(e) {
    // Ignore click events for detached elements.
    // Workaround for CETI-240 - where two onClicks fire - one when the upload button is
    // still in the document, and one once it's detached. Does not always occur, and
    // may be a side effect of a react render optimisation
    if (e && e.target && !isDetachedElement(e.target)) {
      togglePopup();
    }
  };

  var renderPicker = function renderPicker(providers) {
    if (!providers.emojiProvider) {
      return null;
    }

    return jsx(EmojiPickerWithListener, {
      emojiProvider: providers.emojiProvider,
      onSelection: updateEmoji,
      onPickerRef: function onPickerRef() {},
      handleClickOutside: handleEmojiClickOutside
    });
  };

  var renderPopup = function renderPopup() {
    if (!buttonRef.current || !isPopupOpen) {
      return;
    }

    return jsx(Popup, {
      target: buttonRef.current,
      mountTo: props.setDisableParentScroll ? props.mountPoint : buttonRef.current.parentElement,
      fitHeight: 350,
      fitWidth: 350,
      offset: [0, 10] // Confluence inline comment editor has z-index: 500
      // if the toolbar is scrollable, this will be mounted in the root editor
      // we need an index of > 500 to display over it
      ,
      zIndex: props.setDisableParentScroll ? 600 : undefined
    }, jsx("div", {
      css: emojiPickerWrapper
    }, jsx(WithProviders, {
      providers: ['emojiProvider'],
      providerFactory: props.providerFactory,
      renderNode: renderPicker
    })));
  };

  var title = props.title || '';
  return jsx("div", {
    css: emojiPickerButtonWrapper
  }, jsx(Tooltip, {
    content: title,
    position: "top"
  }, jsx(Button, {
    appearance: 'subtle',
    key: props.idx,
    style: {
      padding: 0,
      margin: 0,
      display: 'flex',
      height: '24px',
      width: '24px'
    },
    onClick: togglePopup,
    ref: buttonRef,
    isSelected: props.isSelected,
    iconBefore: jsx(EditorEmojiAddIcon, null)
  })), renderPopup());
};
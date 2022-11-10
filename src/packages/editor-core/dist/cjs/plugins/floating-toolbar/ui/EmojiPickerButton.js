"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmojiPickerButton = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _react2 = _interopRequireDefault(require("react"));

var _button = _interopRequireDefault(require("@atlaskit/button"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _ui = require("@atlaskit/editor-common/ui");

var _emoji = require("@atlaskit/emoji");

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _EditorEmojiAddIcon = _interopRequireDefault(require("./EditorEmojiAddIcon"));

var _withOuterListeners = _interopRequireDefault(require("../../../ui/with-outer-listeners"));

var _templateObject, _templateObject2;

// helps adjusts position of popup
var emojiPickerButtonWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n"]))); // helps to vertically align emoji picker
// both top and bottom margin should be 2px
// https://product-fabric.atlassian.net/browse/CETI-148

var emojiPickerWrapper = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin-bottom: -12px;\n  margin-top: -4px;\n"])));

var EmojiPickerButton = function EmojiPickerButton(props) {
  var buttonRef = _react2.default.useRef(null);

  var _React$useState = _react2.default.useState(false),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      isPopupOpen = _React$useState2[0],
      setIsPopupOpen = _React$useState2[1];

  var EmojiPickerWithListener = (0, _withOuterListeners.default)(_emoji.EmojiPicker);

  _react2.default.useEffect(function () {
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

    return (0, _react.jsx)(EmojiPickerWithListener, {
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

    return (0, _react.jsx)(_ui.Popup, {
      target: buttonRef.current,
      mountTo: props.setDisableParentScroll ? props.mountPoint : buttonRef.current.parentElement,
      fitHeight: 350,
      fitWidth: 350,
      offset: [0, 10] // Confluence inline comment editor has z-index: 500
      // if the toolbar is scrollable, this will be mounted in the root editor
      // we need an index of > 500 to display over it
      ,
      zIndex: props.setDisableParentScroll ? 600 : undefined
    }, (0, _react.jsx)("div", {
      css: emojiPickerWrapper
    }, (0, _react.jsx)(_providerFactory.WithProviders, {
      providers: ['emojiProvider'],
      providerFactory: props.providerFactory,
      renderNode: renderPicker
    })));
  };

  var title = props.title || '';
  return (0, _react.jsx)("div", {
    css: emojiPickerButtonWrapper
  }, (0, _react.jsx)(_tooltip.default, {
    content: title,
    position: "top"
  }, (0, _react.jsx)(_button.default, {
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
    iconBefore: (0, _react.jsx)(_EditorEmojiAddIcon.default, null)
  })), renderPopup());
};

exports.EmojiPickerButton = EmojiPickerButton;
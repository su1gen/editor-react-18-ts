"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InputQuery = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _w3cKeyname = require("w3c-keyname");

var _utils = require("@atlaskit/editor-common/utils");

var _utils2 = require("../utils");

var _constants = require("../constants");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _AssistiveText = require("./AssistiveText");

var _messages = require("../messages");

var _reactIntlNext = require("react-intl-next");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var querySpan = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  outline: none;\n"])));

var isNavigationKey = function isNavigationKey(event) {
  return ['Enter', 'Tab', 'ArrowDown', 'ArrowUp'].includes(event.key);
};

var isUndoRedoShortcut = function isUndoRedoShortcut(event) {
  var key = (0, _w3cKeyname.keyName)(event);

  if (event.ctrlKey && key === 'y') {
    return 'historyRedo';
  }

  if ((event.ctrlKey || event.metaKey) && event.shiftKey && key === 'Z') {
    return 'historyRedo';
  }

  if ((event.ctrlKey || event.metaKey) && key === 'z') {
    return 'historyUndo';
  }

  return false;
};

var InputQuery = /*#__PURE__*/_react.default.memo(function (_ref) {
  var triggerQueryPrefix = _ref.triggerQueryPrefix,
      cancel = _ref.cancel,
      onQueryChange = _ref.onQueryChange,
      onItemSelect = _ref.onItemSelect,
      selectNextItem = _ref.selectNextItem,
      selectPreviousItem = _ref.selectPreviousItem,
      forceFocus = _ref.forceFocus,
      reopenQuery = _ref.reopenQuery,
      onQueryFocus = _ref.onQueryFocus,
      onUndoRedo = _ref.onUndoRedo,
      editorView = _ref.editorView,
      items = _ref.items;
  var ref = (0, _react.useRef)(document.createElement('span'));
  var cleanedInputContent = (0, _react.useCallback)(function () {
    var _ref$current;

    var raw = ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.textContent) || '';
    return raw.replace(_utils.ZERO_WIDTH_SPACE, '');
  }, []);
  var onKeyUp = (0, _react.useCallback)(function (event) {
    var text = cleanedInputContent();
    onQueryChange(text);
  }, [onQueryChange, cleanedInputContent]);

  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isInFocus = _useState2[0],
      setInFocus = _useState2[1];

  var checkKeyEvent = (0, _react.useCallback)(function (event) {
    var _ref$current2;

    var key = (0, _w3cKeyname.keyName)(event);
    var sel = document.getSelection();
    var raw = ((_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.textContent) || '';
    var text = cleanedInputContent();
    var stopDefault = false;

    var _getPluginState = (0, _utils2.getPluginState)(editorView.state),
        selectedIndex = _getPluginState.selectedIndex;

    setInFocus(true);

    switch (key) {
      case ' ':
        // space key
        if (text.length === 0) {
          cancel({
            forceFocusOnEditor: true,
            text: ' ',
            addPrefixTrigger: true,
            setSelectionAt: _constants.CloseSelectionOptions.AFTER_TEXT_INSERTED
          });
          stopDefault = true;
        }

        break;

      case 'Escape':
        cancel({
          text: text,
          forceFocusOnEditor: true,
          addPrefixTrigger: true,
          setSelectionAt: _constants.CloseSelectionOptions.AFTER_TEXT_INSERTED
        });
        stopDefault = true;
        break;

      case 'Backspace':
        if (raw === _utils.ZERO_WIDTH_SPACE || raw.length === 0 || (sel === null || sel === void 0 ? void 0 : sel.anchorOffset) === 0) {
          event.stopPropagation();
          event.preventDefault();
          cancel({
            forceFocusOnEditor: true,
            text: text,
            addPrefixTrigger: false,
            setSelectionAt: _constants.CloseSelectionOptions.BEFORE_TEXT_INSERTED
          });
        }

        break;

      case 'Enter':
        // ED-14758 - Under the W3C specification, any keycode sent under IME would return a keycode 229
        // event.isComposing can't be used alone as this also included a virtual keyboard under a keyboardless device, therefore, it seems the best practice would be intercepting the event as below.
        // Some suggested the other workaround maybe listen on`keypress` instead of `keydown`
        if (!event.isComposing || event.which !== 229 && event.keyCode !== 229) {
          if (selectedIndex === -1) {
            selectNextItem();
          }

          onItemSelect(event.shiftKey ? _typeAhead.SelectItemMode.SHIFT_ENTER : _typeAhead.SelectItemMode.ENTER);
        }

        break;

      case 'Tab':
        if (selectedIndex === -1) {
          selectNextItem();
        }

        onItemSelect(_typeAhead.SelectItemMode.TAB);
        break;

      case 'ArrowDown':
        if (selectedIndex === -1) {
          selectNextItem();
        }

        break;
    }

    var undoRedoType = isUndoRedoShortcut(event);

    if (onUndoRedo && undoRedoType && onUndoRedo(undoRedoType)) {
      stopDefault = true;
    }

    if (isNavigationKey(event) || stopDefault) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  }, [onUndoRedo, onItemSelect, selectNextItem, cancel, cleanedInputContent, editorView.state]);
  var onClick = (0, _react.useCallback)(function (event) {
    var _ref$current3;

    event.stopPropagation();
    event.preventDefault();
    onQueryFocus();
    (_ref$current3 = ref.current) === null || _ref$current3 === void 0 ? void 0 : _ref$current3.focus();
    return false;
  }, [onQueryFocus]);
  (0, _react.useLayoutEffect)(function () {
    if (!ref.current) {
      return;
    }

    var element = ref.current;

    var onFocusIn = function onFocusIn(event) {
      onQueryFocus();
    };

    var keyDown = function keyDown(event) {
      var key = (0, _w3cKeyname.keyName)(event);

      if (['ArrowLeft', 'ArrowRight'].includes(key) && document.getSelection && document.getSelection()) {
        var _ref$current4;

        var q = ((_ref$current4 = ref.current) === null || _ref$current4 === void 0 ? void 0 : _ref$current4.textContent) || '';
        var sel = document.getSelection();
        var isMovingRight = sel && 'ArrowRight' === key && sel.anchorOffset === q.length;
        var isMovingLeft = sel && 'ArrowLeft' === key && sel.anchorOffset === 0;

        if (!isMovingRight && !isMovingLeft) {
          return;
        }

        cancel({
          forceFocusOnEditor: true,
          addPrefixTrigger: true,
          text: cleanedInputContent(),
          setSelectionAt: isMovingRight ? _constants.CloseSelectionOptions.AFTER_TEXT_INSERTED : _constants.CloseSelectionOptions.BEFORE_TEXT_INSERTED
        });
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      checkKeyEvent(event);
    };

    var onFocusOut = function onFocusOut(event) {
      var _window$getSelection;

      var relatedTarget = event.relatedTarget; // Given the user is changing the focus
      // When the target is inside the TypeAhead Popup
      // Then the popup should stay open

      if (relatedTarget instanceof HTMLElement && relatedTarget.closest && relatedTarget.closest(".".concat(_constants.TYPE_AHEAD_POPUP_CONTENT_CLASS))) {
        return;
      } // See ED-14909: Chrome may emit focusout events where an input
      // device was not directly responsible. (This rears in react v17+ consumers
      // where react-managed node removal now appears to propagate focusout events to
      // our event listener). As this path is strictly for click or other typeahead
      // dismissals that don't involve typeahead item selection, we carve out an
      // exception for Chrome-specific events where an input device was not the initiator.


      if (_utils.browser.chrome && !(((_window$getSelection = window.getSelection()) === null || _window$getSelection === void 0 ? void 0 : _window$getSelection.type) === 'Range') && !('sourceCapabilities' in event && event.sourceCapabilities)) {
        return;
      }

      cancel({
        addPrefixTrigger: true,
        text: cleanedInputContent(),
        setSelectionAt: _constants.CloseSelectionOptions.BEFORE_TEXT_INSERTED,
        forceFocusOnEditor: false
      });
    };

    var close = function close() {
      cancel({
        addPrefixTrigger: false,
        text: '',
        forceFocusOnEditor: true,
        setSelectionAt: _constants.CloseSelectionOptions.BEFORE_TEXT_INSERTED
      });
    };

    var beforeinput = function beforeinput(e) {
      var _target$textContent;

      setInFocus(false);
      var target = e.target;

      if (e.isComposing || !(target instanceof HTMLElement)) {
        return;
      }

      if (e.inputType === 'historyUndo' && (((_target$textContent = target.textContent) === null || _target$textContent === void 0 ? void 0 : _target$textContent.length) === 0 || target.textContent === _utils.ZERO_WIDTH_SPACE)) {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }

      if (e.data != null && target.textContent === _utils.ZERO_WIDTH_SPACE) {
        element.textContent = ''; // We need to change the content on Safari
        // and set the cursor at the right place

        if (_utils.browser.safari) {
          e.preventDefault();
          var dataElement = document.createTextNode(e.data);
          element.appendChild(dataElement);
          var sel = window.getSelection();
          var range = document.createRange();
          range.setStart(dataElement, dataElement.length);
          range.collapse(true);
          sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
          sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        }
      }
    };

    var onInput = null;

    if (_utils.browser.safari) {
      // On Safari, for reasons beyond my understanding,
      // The undo behavior is totally different from other browsers
      // That why we need to have an specific branch only for Safari.
      var _onInput = function _onInput(e) {
        var _target$textContent2;

        var target = e.target;

        if (e.isComposing || !(target instanceof HTMLElement)) {
          return;
        }

        if (e.inputType === 'historyUndo' && ((_target$textContent2 = target.textContent) === null || _target$textContent2 === void 0 ? void 0 : _target$textContent2.length) === 1) {
          e.preventDefault();
          e.stopPropagation();
          close();
          return;
        }
      };

      element.addEventListener('input', _onInput);
    }

    element.addEventListener('focusout', onFocusOut);
    element.addEventListener('focusin', onFocusIn);
    element.addEventListener('keydown', keyDown);
    element.addEventListener('beforeinput', beforeinput);
    return function () {
      element.removeEventListener('focusout', onFocusOut);
      element.removeEventListener('focusin', onFocusIn);
      element.removeEventListener('keydown', keyDown);
      element.removeEventListener('beforeinput', beforeinput);

      if (_utils.browser.safari) {
        element.removeEventListener('input', onInput);
      }
    };
  }, [triggerQueryPrefix, cleanedInputContent, onQueryFocus, cancel, checkKeyEvent, editorView.state]);
  (0, _react.useLayoutEffect)(function () {
    var hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;

    if (ref.current && forceFocus) {
      ref.current.textContent = hasReopenQuery ? reopenQuery : _utils.ZERO_WIDTH_SPACE;
      requestAnimationFrame(function () {
        if (!(ref !== null && ref !== void 0 && ref.current)) {
          return;
        }

        var sel = window.getSelection();

        if (sel && hasReopenQuery && ref.current.lastChild instanceof Text) {
          var lastChild = ref.current.lastChild;
          var range = document.createRange();
          range.setStart(ref.current.lastChild, lastChild.length);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }

        ref.current.focus();
        setInFocus(true);
      });
    }
  }, [forceFocus, reopenQuery]);
  var assistiveHintID = _constants.TYPE_AHEAD_DECORATION_ELEMENT_ID + '__assistiveHint';
  var intl = (0, _reactIntlNext.useIntl)();
  /**
    When we migrated to emotion from styled component, we started getting this error.
    jsx-a11y/interactive-supports-focus
    Task added in https://product-fabric.atlassian.net/wiki/spaces/E/pages/3182068181/Potential+improvements#Moderate-changes.
   */

  return (0, _react2.jsx)(_react.Fragment, null, triggerQueryPrefix, (0, _react2.jsx)("span", {
    css: querySpan,
    contentEditable: true,
    ref: ref,
    onKeyUp: onKeyUp,
    onClick: onClick,
    role: "combobox",
    "aria-controls": _constants.TYPE_AHEAD_DECORATION_ELEMENT_ID,
    "aria-autocomplete": "list",
    "aria-expanded": items.length !== 0,
    "aria-labelledby": assistiveHintID,
    suppressContentEditableWarning: true,
    "data-query-prefix": triggerQueryPrefix
  }), (0, _react2.jsx)("span", {
    id: assistiveHintID,
    style: {
      display: 'none'
    }
  }, intl.formatMessage(_messages.typeAheadListMessages.inputQueryAssistiveLabel)), (0, _react2.jsx)(_AssistiveText.AssistiveText, {
    assistiveText: items.length === 0 ? intl.formatMessage(_messages.typeAheadListMessages.noSearchResultsLabel, {
      itemsLength: items.length
    }) : '',
    isInFocus: items.length === 0 || isInFocus,
    id: _constants.TYPE_AHEAD_DECORATION_ELEMENT_ID
  }));
});

exports.InputQuery = InputQuery;
InputQuery.displayName = 'InputQuery';
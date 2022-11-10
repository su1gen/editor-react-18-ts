/** @jsx jsx */
import React, { useRef, useCallback, Fragment, useLayoutEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { keyName as keyNameNormalized } from 'w3c-keyname';
import { browser, ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/utils';
import { getPluginState } from '../utils';
import { CloseSelectionOptions, TYPE_AHEAD_POPUP_CONTENT_CLASS } from '../constants';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { TYPE_AHEAD_DECORATION_ELEMENT_ID } from '../constants';
import { AssistiveText } from './AssistiveText';
import { typeAheadListMessages } from '../messages';
import { useIntl } from 'react-intl-next';
const querySpan = css`
  outline: none;
`;

const isNavigationKey = event => {
  return ['Enter', 'Tab', 'ArrowDown', 'ArrowUp'].includes(event.key);
};

const isUndoRedoShortcut = event => {
  const key = keyNameNormalized(event);

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

export const InputQuery = /*#__PURE__*/React.memo(({
  triggerQueryPrefix,
  cancel,
  onQueryChange,
  onItemSelect,
  selectNextItem,
  selectPreviousItem,
  forceFocus,
  reopenQuery,
  onQueryFocus,
  onUndoRedo,
  editorView,
  items
}) => {
  const ref = useRef(document.createElement('span'));
  const cleanedInputContent = useCallback(() => {
    var _ref$current;

    const raw = ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.textContent) || '';
    return raw.replace(ZERO_WIDTH_SPACE, '');
  }, []);
  const onKeyUp = useCallback(event => {
    const text = cleanedInputContent();
    onQueryChange(text);
  }, [onQueryChange, cleanedInputContent]);
  const [isInFocus, setInFocus] = useState(false);
  const checkKeyEvent = useCallback(event => {
    var _ref$current2;

    const key = keyNameNormalized(event);
    const sel = document.getSelection();
    const raw = ((_ref$current2 = ref.current) === null || _ref$current2 === void 0 ? void 0 : _ref$current2.textContent) || '';
    const text = cleanedInputContent();
    let stopDefault = false;
    const {
      selectedIndex
    } = getPluginState(editorView.state);
    setInFocus(true);

    switch (key) {
      case ' ':
        // space key
        if (text.length === 0) {
          cancel({
            forceFocusOnEditor: true,
            text: ' ',
            addPrefixTrigger: true,
            setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED
          });
          stopDefault = true;
        }

        break;

      case 'Escape':
        cancel({
          text,
          forceFocusOnEditor: true,
          addPrefixTrigger: true,
          setSelectionAt: CloseSelectionOptions.AFTER_TEXT_INSERTED
        });
        stopDefault = true;
        break;

      case 'Backspace':
        if (raw === ZERO_WIDTH_SPACE || raw.length === 0 || (sel === null || sel === void 0 ? void 0 : sel.anchorOffset) === 0) {
          event.stopPropagation();
          event.preventDefault();
          cancel({
            forceFocusOnEditor: true,
            text,
            addPrefixTrigger: false,
            setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED
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

          onItemSelect(event.shiftKey ? SelectItemMode.SHIFT_ENTER : SelectItemMode.ENTER);
        }

        break;

      case 'Tab':
        if (selectedIndex === -1) {
          selectNextItem();
        }

        onItemSelect(SelectItemMode.TAB);
        break;

      case 'ArrowDown':
        if (selectedIndex === -1) {
          selectNextItem();
        }

        break;
    }

    const undoRedoType = isUndoRedoShortcut(event);

    if (onUndoRedo && undoRedoType && onUndoRedo(undoRedoType)) {
      stopDefault = true;
    }

    if (isNavigationKey(event) || stopDefault) {
      event.stopPropagation();
      event.preventDefault();
      return false;
    }
  }, [onUndoRedo, onItemSelect, selectNextItem, cancel, cleanedInputContent, editorView.state]);
  const onClick = useCallback(event => {
    var _ref$current3;

    event.stopPropagation();
    event.preventDefault();
    onQueryFocus();
    (_ref$current3 = ref.current) === null || _ref$current3 === void 0 ? void 0 : _ref$current3.focus();
    return false;
  }, [onQueryFocus]);
  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    const {
      current: element
    } = ref;

    const onFocusIn = event => {
      onQueryFocus();
    };

    const keyDown = event => {
      const key = keyNameNormalized(event);

      if (['ArrowLeft', 'ArrowRight'].includes(key) && document.getSelection && document.getSelection()) {
        var _ref$current4;

        const q = ((_ref$current4 = ref.current) === null || _ref$current4 === void 0 ? void 0 : _ref$current4.textContent) || '';
        const sel = document.getSelection();
        const isMovingRight = sel && 'ArrowRight' === key && sel.anchorOffset === q.length;
        const isMovingLeft = sel && 'ArrowLeft' === key && sel.anchorOffset === 0;

        if (!isMovingRight && !isMovingLeft) {
          return;
        }

        cancel({
          forceFocusOnEditor: true,
          addPrefixTrigger: true,
          text: cleanedInputContent(),
          setSelectionAt: isMovingRight ? CloseSelectionOptions.AFTER_TEXT_INSERTED : CloseSelectionOptions.BEFORE_TEXT_INSERTED
        });
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      checkKeyEvent(event);
    };

    const onFocusOut = event => {
      var _window$getSelection;

      const {
        relatedTarget
      } = event; // Given the user is changing the focus
      // When the target is inside the TypeAhead Popup
      // Then the popup should stay open

      if (relatedTarget instanceof HTMLElement && relatedTarget.closest && relatedTarget.closest(`.${TYPE_AHEAD_POPUP_CONTENT_CLASS}`)) {
        return;
      } // See ED-14909: Chrome may emit focusout events where an input
      // device was not directly responsible. (This rears in react v17+ consumers
      // where react-managed node removal now appears to propagate focusout events to
      // our event listener). As this path is strictly for click or other typeahead
      // dismissals that don't involve typeahead item selection, we carve out an
      // exception for Chrome-specific events where an input device was not the initiator.


      if (browser.chrome && !(((_window$getSelection = window.getSelection()) === null || _window$getSelection === void 0 ? void 0 : _window$getSelection.type) === 'Range') && !('sourceCapabilities' in event && event.sourceCapabilities)) {
        return;
      }

      cancel({
        addPrefixTrigger: true,
        text: cleanedInputContent(),
        setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED,
        forceFocusOnEditor: false
      });
    };

    const close = () => {
      cancel({
        addPrefixTrigger: false,
        text: '',
        forceFocusOnEditor: true,
        setSelectionAt: CloseSelectionOptions.BEFORE_TEXT_INSERTED
      });
    };

    const beforeinput = e => {
      var _target$textContent;

      setInFocus(false);
      const {
        target
      } = e;

      if (e.isComposing || !(target instanceof HTMLElement)) {
        return;
      }

      if (e.inputType === 'historyUndo' && (((_target$textContent = target.textContent) === null || _target$textContent === void 0 ? void 0 : _target$textContent.length) === 0 || target.textContent === ZERO_WIDTH_SPACE)) {
        e.preventDefault();
        e.stopPropagation();
        close();
        return;
      }

      if (e.data != null && target.textContent === ZERO_WIDTH_SPACE) {
        element.textContent = ''; // We need to change the content on Safari
        // and set the cursor at the right place

        if (browser.safari) {
          e.preventDefault();
          const dataElement = document.createTextNode(e.data);
          element.appendChild(dataElement);
          const sel = window.getSelection();
          const range = document.createRange();
          range.setStart(dataElement, dataElement.length);
          range.collapse(true);
          sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
          sel === null || sel === void 0 ? void 0 : sel.addRange(range);
        }
      }
    };

    let onInput = null;

    if (browser.safari) {
      // On Safari, for reasons beyond my understanding,
      // The undo behavior is totally different from other browsers
      // That why we need to have an specific branch only for Safari.
      const onInput = e => {
        var _target$textContent2;

        const {
          target
        } = e;

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

      element.addEventListener('input', onInput);
    }

    element.addEventListener('focusout', onFocusOut);
    element.addEventListener('focusin', onFocusIn);
    element.addEventListener('keydown', keyDown);
    element.addEventListener('beforeinput', beforeinput);
    return () => {
      element.removeEventListener('focusout', onFocusOut);
      element.removeEventListener('focusin', onFocusIn);
      element.removeEventListener('keydown', keyDown);
      element.removeEventListener('beforeinput', beforeinput);

      if (browser.safari) {
        element.removeEventListener('input', onInput);
      }
    };
  }, [triggerQueryPrefix, cleanedInputContent, onQueryFocus, cancel, checkKeyEvent, editorView.state]);
  useLayoutEffect(() => {
    const hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;

    if (ref.current && forceFocus) {
      ref.current.textContent = hasReopenQuery ? reopenQuery : ZERO_WIDTH_SPACE;
      requestAnimationFrame(() => {
        if (!(ref !== null && ref !== void 0 && ref.current)) {
          return;
        }

        const sel = window.getSelection();

        if (sel && hasReopenQuery && ref.current.lastChild instanceof Text) {
          const lastChild = ref.current.lastChild;
          const range = document.createRange();
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
  const assistiveHintID = TYPE_AHEAD_DECORATION_ELEMENT_ID + '__assistiveHint';
  const intl = useIntl();
  /**
    When we migrated to emotion from styled component, we started getting this error.
    jsx-a11y/interactive-supports-focus
    Task added in https://product-fabric.atlassian.net/wiki/spaces/E/pages/3182068181/Potential+improvements#Moderate-changes.
   */

  return jsx(Fragment, null, triggerQueryPrefix, jsx("span", {
    css: querySpan,
    contentEditable: true,
    ref: ref,
    onKeyUp: onKeyUp,
    onClick: onClick,
    role: "combobox",
    "aria-controls": TYPE_AHEAD_DECORATION_ELEMENT_ID,
    "aria-autocomplete": "list",
    "aria-expanded": items.length !== 0,
    "aria-labelledby": assistiveHintID,
    suppressContentEditableWarning: true,
    "data-query-prefix": triggerQueryPrefix
  }), jsx("span", {
    id: assistiveHintID,
    style: {
      display: 'none'
    }
  }, intl.formatMessage(typeAheadListMessages.inputQueryAssistiveLabel)), jsx(AssistiveText, {
    assistiveText: items.length === 0 ? intl.formatMessage(typeAheadListMessages.noSearchResultsLabel, {
      itemsLength: items.length
    }) : '',
    isInFocus: items.length === 0 || isInFocus,
    id: TYPE_AHEAD_DECORATION_ELEMENT_ID
  }));
});
InputQuery.displayName = 'InputQuery';
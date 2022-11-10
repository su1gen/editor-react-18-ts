import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import React, { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { css, jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import { findOverflowScrollParent, Popup } from '@atlaskit/editor-common/ui';
import { borderRadius, gridSize } from '@atlaskit/theme/constants';
import { N0, N60A, N50A } from '@atlaskit/theme/colors';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics';
import { TYPE_AHEAD_POPUP_CONTENT_CLASS } from '../constants';
import { TypeAheadList } from './TypeAheadList';
import { ITEM_PADDING } from './TypeAheadListItem';
import { token } from '@atlaskit/tokens';
var DEFAULT_TYPEAHEAD_MENU_HEIGHT = 380;
var typeAheadContent = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  background: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  padding: ", "px 0;\n  width: 320px;\n  max-height: 380px; /* ~5.5 visibile items */\n  overflow-y: auto;\n  -ms-overflow-style: -ms-autohiding-scrollbar;\n  position: relative;\n"])), token('elevation.surface.overlay', N0), borderRadius(), token('elevation.shadow.overlay', "0 0 1px ".concat(N60A, ", 0 4px 8px -2px ").concat(N50A)), gridSize() / 2);

var Highlight = function Highlight(_ref) {
  var state = _ref.state,
      triggerHandler = _ref.triggerHandler;

  if (!(triggerHandler !== null && triggerHandler !== void 0 && triggerHandler.getHighlight)) {
    return null;
  }

  var highlight = triggerHandler.getHighlight(state);
  return highlight;
};

var OFFSET = [0, 8];
export var TypeAheadPopup = /*#__PURE__*/React.memo(function (props) {
  var editorView = props.editorView,
      triggerHandler = props.triggerHandler,
      anchorElement = props.anchorElement,
      popupsMountPoint = props.popupsMountPoint,
      popupsBoundariesElement = props.popupsBoundariesElement,
      popupsScrollableElement = props.popupsScrollableElement,
      items = props.items,
      selectedIndex = props.selectedIndex,
      onItemInsert = props.onItemInsert,
      fireAnalyticsCallback = props.fireAnalyticsCallback,
      isEmptyQuery = props.isEmptyQuery;
  var startTime = useMemo(function () {
    return performance.now();
  }, // In case those props changes
  // we need to recreate the startTime
  [items, isEmptyQuery, fireAnalyticsCallback, triggerHandler] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useEffect(function () {
    if (!fireAnalyticsCallback) {
      return;
    }

    var stopTime = performance.now();
    var time = stopTime - startTime;
    fireAnalyticsCallback({
      payload: {
        action: ACTION.RENDERED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          time: time,
          items: items.length,
          initial: isEmptyQuery
        }
      }
    });
  }, [startTime, items, fireAnalyticsCallback, isEmptyQuery, // In case the current triggerHandler changes
  // e.g: Inserting a mention using the quick insert
  // we need to send the event again
  // eslint-disable-next-line react-hooks/exhaustive-deps
  triggerHandler]);
  useEffect(function () {
    if (!fireAnalyticsCallback) {
      return;
    }

    fireAnalyticsCallback({
      payload: {
        action: ACTION.VIEWED,
        actionSubject: ACTION_SUBJECT.TYPEAHEAD_ITEM,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          index: selectedIndex,
          items: items.length
        }
      }
    });
  }, [items, fireAnalyticsCallback, selectedIndex, // In case the current triggerHandler changes
  // e.g: Inserting a mention using the quick insert
  // we need to send the event again
  // eslint-disable-next-line react-hooks/exhaustive-deps
  triggerHandler]);

  var _useState = useState(DEFAULT_TYPEAHEAD_MENU_HEIGHT),
      _useState2 = _slicedToArray(_useState, 2),
      fitHeight = _useState2[0],
      setFitHeight = _useState2[1];

  var getFitHeight = useCallback(function () {
    if (!anchorElement || !popupsMountPoint) {
      return;
    }

    var target = anchorElement;

    var _target$getBoundingCl = target.getBoundingClientRect(),
        targetTop = _target$getBoundingCl.top,
        targetHeight = _target$getBoundingCl.height;

    var boundariesElement = document.body;

    var _boundariesElement$ge = boundariesElement.getBoundingClientRect(),
        boundariesHeight = _boundariesElement$ge.height,
        boundariesTop = _boundariesElement$ge.top; // Calculating the space above and space below our decoration


    var spaceAbove = targetTop - (boundariesTop - boundariesElement.scrollTop);
    var spaceBelow = boundariesTop + boundariesHeight - (targetTop + targetHeight); // Keep default height if more than enough space

    if (spaceBelow >= DEFAULT_TYPEAHEAD_MENU_HEIGHT) {
      return setFitHeight(DEFAULT_TYPEAHEAD_MENU_HEIGHT);
    } // Determines whether typeahead will fit above or below decoration
    // and return the space available.


    var newFitHeight = spaceBelow >= spaceAbove ? spaceBelow : spaceAbove; // Each typeahead item has some padding
    // We want to leave some space at the top so first item
    // is not partially cropped

    var fitHeightWithSpace = newFitHeight - ITEM_PADDING * 2; // Ensure typeahead height is max its default height

    var minFitHeight = Math.min(DEFAULT_TYPEAHEAD_MENU_HEIGHT, fitHeightWithSpace);
    return setFitHeight(minFitHeight);
  }, [anchorElement, popupsMountPoint]);
  var getFitHeightDebounced = rafSchedule(getFitHeight);
  useLayoutEffect(function () {
    var scrollableElement = popupsScrollableElement || findOverflowScrollParent(anchorElement);
    getFitHeight();
    window.addEventListener('resize', getFitHeightDebounced);

    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', getFitHeightDebounced);
    }

    return function () {
      window.removeEventListener('resize', getFitHeightDebounced);

      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', getFitHeightDebounced);
      }
    };
  }, [anchorElement, popupsScrollableElement, getFitHeightDebounced, getFitHeight]);
  return jsx(Popup, {
    zIndex: akEditorFloatingDialogZIndex,
    target: anchorElement,
    mountTo: popupsMountPoint,
    boundariesElement: popupsBoundariesElement,
    scrollableElement: popupsScrollableElement,
    fitHeight: fitHeight,
    fitWidth: 340,
    offset: OFFSET
  }, jsx("div", {
    css: typeAheadContent,
    tabIndex: 0,
    className: TYPE_AHEAD_POPUP_CONTENT_CLASS
  }, jsx(Highlight, {
    state: editorView.state,
    triggerHandler: triggerHandler
  }), jsx(TypeAheadList, {
    items: items,
    selectedIndex: selectedIndex,
    onItemClick: onItemInsert,
    fitHeight: fitHeight,
    editorView: editorView,
    decorationElement: anchorElement
  })));
});
TypeAheadPopup.displayName = 'TypeAheadPopup';
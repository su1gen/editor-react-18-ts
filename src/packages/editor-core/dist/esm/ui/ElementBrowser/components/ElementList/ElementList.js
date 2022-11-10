import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;

var _excluded = ["items", "mode", "selectedItemIndex", "focusedItemIndex", "setColumnCount", "createAnalyticsEvent", "emptyStateHandler", "selectedCategory", "searchTerm"];

/** @jsx jsx */
import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { Collection } from 'react-virtualized/dist/commonjs/Collection';
import { ButtonItem } from '@atlaskit/menu';
import { B100, N200 } from '@atlaskit/theme/colors';
import Tooltip from '@atlaskit/tooltip';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, fireAnalyticsEvent } from '../../../../plugins/analytics';
import IconFallback from '../../../../plugins/quick-insert/assets/fallback';
import { itemIcon } from '../../../../plugins/type-ahead/ui/TypeAheadListItem';
import { shortcutStyle } from '../../../styles';
import { ELEMENT_LIST_PADDING, SCROLLBAR_WIDTH } from '../../constants';
import useContainerWidth from '../../hooks/use-container-width';
import useFocus from '../../hooks/use-focus';
import { Modes } from '../../types';
import cellSizeAndPositionGetter from './cellSizeAndPositionGetter';
import EmptyState from './EmptyState';
import { getColumnCount, getScrollbarWidth } from './utils';

function ElementList(_ref) {
  var items = _ref.items,
      mode = _ref.mode,
      selectedItemIndex = _ref.selectedItemIndex,
      focusedItemIndex = _ref.focusedItemIndex,
      setColumnCount = _ref.setColumnCount,
      createAnalyticsEvent = _ref.createAnalyticsEvent,
      emptyStateHandler = _ref.emptyStateHandler,
      selectedCategory = _ref.selectedCategory,
      searchTerm = _ref.searchTerm,
      props = _objectWithoutProperties(_ref, _excluded);

  var _useContainerWidth = useContainerWidth(),
      containerWidth = _useContainerWidth.containerWidth,
      ContainerWidthMonitor = _useContainerWidth.ContainerWidthMonitor;

  var _useState = useState(SCROLLBAR_WIDTH),
      _useState2 = _slicedToArray(_useState, 2),
      scrollbarWidth = _useState2[0],
      setScrollbarWidth = _useState2[1];

  var fullMode = mode === Modes.full;
  useEffect(function () {
    /**
     * More of an optimization condition.
     * Initially the containerWidths are reported 0 twice.
     **/
    if (fullMode && containerWidth > 0) {
      setColumnCount(getColumnCount(containerWidth));
      var updatedScrollbarWidth = getScrollbarWidth();

      if (updatedScrollbarWidth > 0) {
        setScrollbarWidth(updatedScrollbarWidth);
      }
    }
  }, [fullMode, containerWidth, setColumnCount, scrollbarWidth]);
  var onExternalLinkClick = useCallback(function () {
    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.VISITED,
        actionSubject: ACTION_SUBJECT.SMART_LINK,
        eventType: EVENT_TYPE.TRACK
      }
    });
  }, [createAnalyticsEvent]);
  var cellRenderer = useMemo(function () {
    return function (_ref2) {
      var index = _ref2.index,
          key = _ref2.key,
          style = _ref2.style;

      if (items[index] == null) {
        return;
      }

      return jsx("div", {
        style: style,
        key: key,
        className: "element-item-wrapper",
        css: elementItemWrapper
      }, jsx(MemoizedElementItem, _extends({
        inlineMode: !fullMode,
        index: index,
        item: items[index],
        selected: selectedItemIndex === index,
        focus: focusedItemIndex === index
      }, props)));
    };
  }, [items, fullMode, selectedItemIndex, focusedItemIndex, props]);
  return jsx(Fragment, null, jsx(ContainerWidthMonitor, null), !items.length ? emptyStateHandler ? emptyStateHandler({
    mode: mode,
    selectedCategory: selectedCategory,
    searchTerm: searchTerm
  }) : jsx(EmptyState, {
    onExternalLinkClick: onExternalLinkClick
  }) : jsx("div", {
    css: elementItemsWrapper,
    "data-testid": "element-items"
  }, jsx(Fragment, null, containerWidth > 0 && jsx(AutoSizer, {
    disableWidth: true
  }, function (_ref3) {
    var height = _ref3.height;
    return jsx(Collection, {
      cellCount: items.length,
      cellRenderer: cellRenderer,
      cellSizeAndPositionGetter: cellSizeAndPositionGetter(containerWidth - ELEMENT_LIST_PADDING * 2, scrollbarWidth),
      height: height,
      width: containerWidth - ELEMENT_LIST_PADDING * 2 // containerWidth - padding on Left/Right (for focus outline)

      /**
       * Refresh Collection on WidthObserver value change.
       * Length of the items used to force re-render to solve Firefox bug with react-virtualized retaining
       * scroll position after updating the data. If new data has different number of cells, a re-render
       * is forced to prevent the scroll position render bug.
       */
      ,
      key: containerWidth + items.length,
      scrollToCell: selectedItemIndex
    });
  }))));
}

var MemoizedElementItem = /*#__PURE__*/memo(ElementItem);
MemoizedElementItem.displayName = 'MemoizedElementItem';
export function ElementItem(_ref4) {
  var inlineMode = _ref4.inlineMode,
      selected = _ref4.selected,
      item = _ref4.item,
      index = _ref4.index,
      onInsertItem = _ref4.onInsertItem,
      focus = _ref4.focus,
      setFocusedItemIndex = _ref4.setFocusedItemIndex;
  var ref = useFocus(focus);
  /**
   * Note: props.onSelectItem(item) is not called here as the StatelessElementBrowser's
   * useEffect would trigger it on selectedItemIndex change. (Line 106-110)
   * This implementation was changed for keyboard/click selection to work with `onInsertItem`.
   */

  var onClick = useCallback(function (e) {
    e.preventDefault();
    e.stopPropagation();
    setFocusedItemIndex(index);

    switch (e.nativeEvent.detail) {
      case 0:
        onInsertItem(item);
        break;

      case 1:
        if (inlineMode) {
          onInsertItem(item);
        }

        break;

      case 2:
        if (!inlineMode) {
          onInsertItem(item);
        }

        break;

      default:
        return;
    }
  }, [index, inlineMode, item, onInsertItem, setFocusedItemIndex]);
  var icon = item.icon,
      title = item.title,
      description = item.description,
      keyshortcut = item.keyshortcut;
  return jsx(Tooltip, {
    content: description,
    testId: "element-item-tooltip-".concat(index)
  }, jsx(ButtonItem, {
    onClick: onClick,
    iconBefore: jsx(ElementBefore, {
      icon: icon,
      title: title
    }),
    isSelected: selected,
    "aria-describedby": title,
    ref: ref,
    testId: "element-item-".concat(index)
  }, jsx(ItemContent, {
    style: inlineMode ? null : itemStyleOverrides,
    tabIndex: 0,
    title: title,
    description: description,
    keyshortcut: keyshortcut
  })));
}
/**
 * Inline mode should use the existing Align-items:center value.
 */

var itemStyleOverrides = {
  alignItems: 'flex-start'
};
var ElementBefore = /*#__PURE__*/memo(function (_ref5) {
  var icon = _ref5.icon,
      title = _ref5.title;
  return jsx("div", {
    css: [itemIcon, itemIconStyle]
  }, icon ? icon() : jsx(IconFallback, null));
});
var ItemContent = /*#__PURE__*/memo(function (_ref6) {
  var title = _ref6.title,
      description = _ref6.description,
      keyshortcut = _ref6.keyshortcut;
  return jsx("div", {
    css: itemBody,
    className: "item-body"
  }, jsx("div", {
    css: itemText
  }, jsx("div", {
    css: itemTitleWrapper
  }, jsx("p", {
    css: itemTitle
  }, title), jsx("div", {
    css: itemAfter
  }, keyshortcut && jsx("div", {
    css: shortcutStyle
  }, keyshortcut))), description && jsx("p", {
    css: itemDescription
  }, description)));
});
var elementItemsWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  flex: 1;\n  flex-flow: row wrap;\n  align-items: flex-start;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: ", "px; // For Focus outline\n\n  .ReactVirtualized__Collection {\n    border-radius: 3px; // Standard border-radius across other components like Search or Item.\n    outline: none;\n\n    :focus {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n    }\n  }\n  .ReactVirtualized__Collection__innerScrollContainer {\n    div[class='element-item-wrapper']:last-child {\n      padding-bottom: 4px;\n    }\n  }\n"])), ELEMENT_LIST_PADDING, ELEMENT_LIST_PADDING, token('color.border.focused', B100));
var elementItemWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  div {\n    button {\n      height: 75px;\n      align-items: flex-start;\n      padding: 12px 12px 11px;\n    }\n  }\n"])));
var itemBody = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  line-height: 1.4;\n  width: 100%;\n\n  margin-top: -2px; // Fixes the Item Icon and text's alignment issue\n"])));
/*
 * -webkit-line-clamp is also supported by firefox 🎉
 * https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/68#CSS
 */

var multilineStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n"])));
var itemDescription = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  ", ";\n\n  overflow: hidden;\n  font-size: ", ";\n  color: ", ";\n  margin-top: 2px;\n"])), multilineStyle, relativeFontSizeToBase16(11.67), token('color.text.subtle', N200));
var itemText = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  width: inherit;\n  white-space: initial;\n"])));
var itemTitleWrapper = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  display: flex;\n  justify-content: space-between; // Title and keyboardshortcut are rendered in the same block\n"])));
var itemTitle = css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  width: 100%;\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"])));
var itemAfter = css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  flex: 0 0 auto;\n"])));
var itemIconStyle = css(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  img {\n    height: 40px;\n    width: 40px;\n    object-fit: cover;\n  }\n"])));
var MemoizedElementListWithAnalytics = /*#__PURE__*/memo(withAnalyticsContext({
  component: 'ElementList'
})(ElementList));
export default MemoizedElementListWithAnalytics;
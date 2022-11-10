import _extends from "@babel/runtime/helpers/extends";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15;

/** @jsx jsx */
import React, { memo, useState, useCallback, useEffect } from 'react';
import { css, jsx } from '@emotion/react';
import { FormattedMessage } from 'react-intl-next';
import { withAnalyticsContext, withAnalyticsEvents } from '@atlaskit/analytics-next';
import { fireAnalyticsEvent, EVENT_TYPE, ACTION_SUBJECT, ACTION } from '../../../plugins/analytics';
import ElementList from './ElementList/ElementList';
import CategoryList from './CategoryList';
import ElementSearch from './ElementSearch';
import { DEVICE_BREAKPOINT_NUMBERS, GRID_SIZE, INLINE_SIDEBAR_HEIGHT, SIDEBAR_HEADING_PADDING_LEFT, SIDEBAR_HEADING_WRAPPER_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import useContainerWidth from '../hooks/use-container-width';
import useSelectAndFocusOnArrowNavigation from '../hooks/use-select-and-focus-on-arrow-navigation';
var wrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  width: 100%;\n  max-height: inherit;\n  overflow: hidden;\n"])));
var baseBrowserContainerStyles = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  height: 100%;\n  /** Needed for Safari to work with current css.\n  * 100% heights wont work and\n  * will default to auto if one of the containers doesn't have a specified height in pixels.\n  * Setting the min-height to fill available fits safari's needs and the above 100% height works on the rest of the browsers.\n  */\n\n  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */\n\n  /* stylelint-disable-next-line */\n  min-height: -webkit-fill-available;\n"])));
var mobileElementBrowserContainer = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  ", ";\n  flex-direction: column;\n"])), baseBrowserContainerStyles);
var elementBrowserContainer = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  ", ";\n  flex-direction: row;\n"])), baseBrowserContainerStyles);
var baseSidebarStyles = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n\n  overflow-x: auto;\n  overflow-y: hidden;\n"])));
var mobileSideBar = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  ", ";\n  flex: 0 0 ", ";\n  padding: 12px 12px 0 12px;\n"])), baseSidebarStyles, INLINE_SIDEBAR_HEIGHT);
var mobileSideBarShowCategories = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  flex: 0 0 auto;\n"])));
var sideBar = css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  ", ";\n  flex: 0 0 'auto';\n"])), baseSidebarStyles);
var sideBarShowCategories = css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  ", ";\n  flex: 0 0 ", ";\n"])), baseSidebarStyles, SIDEBAR_WIDTH);
var sidebarHeading = css(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  flex: 0 0 ", ";\n  display: inline-flex;\n  align-items: center;\n  padding-left: ", ";\n  font-weight: 700;\n"])), SIDEBAR_HEADING_WRAPPER_HEIGHT, SIDEBAR_HEADING_PADDING_LEFT);
var mobileMainContent = css(_templateObject11 || (_templateObject11 = _taggedTemplateLiteral(["\n  flex: 1 1 auto;\n\n  display: flex;\n  flex-direction: column;\n\n  overflow-y: auto;\n  height: 100%;\n"])));
var mainContent = css(_templateObject12 || (_templateObject12 = _taggedTemplateLiteral(["\n  ", "\n  margin-left: ", "px;\n  // Needed for safari\n  height: auto;\n"])), mobileMainContent, GRID_SIZE * 2);
var searchContainer = css(_templateObject13 || (_templateObject13 = _taggedTemplateLiteral(["\n  padding-bottom: ", "px;\n"])), GRID_SIZE * 2);
var mobileCategoryListWrapper = css(_templateObject14 || (_templateObject14 = _taggedTemplateLiteral(["\n  display: flex;\n  overflow-x: auto;\n\n  padding: ", "px 0 ", "px 0;\n  min-height: ", "px;\n\n  overflow: -moz-scrollbars-none;\n  ::-webkit-scrollbar {\n    display: none;\n  }\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n"])), GRID_SIZE, GRID_SIZE * 2, GRID_SIZE * 4);
var categoryListWrapper = css(_templateObject15 || (_templateObject15 = _taggedTemplateLiteral(["\n  ", "\n  padding: 0;\n  margin-top: ", "px;\n  flex-direction: column;\n"])), mobileCategoryListWrapper, GRID_SIZE * 3);

function StatelessElementBrowser(props) {
  var items = props.items,
      onSelectItem = props.onSelectItem;

  var _useContainerWidth = useContainerWidth(),
      containerWidth = _useContainerWidth.containerWidth,
      ContainerWidthMonitor = _useContainerWidth.ContainerWidthMonitor;

  var _useState = useState(1),
      _useState2 = _slicedToArray(_useState, 2),
      columnCount = _useState2[0],
      setColumnCount = _useState2[1];

  var _useSelectAndFocusOnA = useSelectAndFocusOnArrowNavigation(items.length - 1, columnCount),
      selectedItemIndex = _useSelectAndFocusOnA.selectedItemIndex,
      focusedItemIndex = _useSelectAndFocusOnA.focusedItemIndex,
      setFocusedItemIndex = _useSelectAndFocusOnA.setFocusedItemIndex,
      focusOnSearch = _useSelectAndFocusOnA.focusOnSearch,
      onKeyDown = _useSelectAndFocusOnA.onKeyDown,
      setFocusOnSearch = _useSelectAndFocusOnA.setFocusOnSearch;

  useEffect(function () {
    fireAnalyticsEvent(props.createAnalyticsEvent)({
      payload: {
        action: ACTION.OPENED,
        actionSubject: ACTION_SUBJECT.ELEMENT_BROWSER,
        eventType: EVENT_TYPE.UI,
        attributes: {
          mode: props.mode
        }
      }
    });
    return function () {
      fireAnalyticsEvent(props.createAnalyticsEvent)({
        payload: {
          action: ACTION.CLOSED,
          actionSubject: ACTION_SUBJECT.ELEMENT_BROWSER,
          eventType: EVENT_TYPE.UI,
          attributes: {
            mode: props.mode
          }
        }
      });
    };
  }, [props.createAnalyticsEvent, props.mode]);
  /* Only for hitting enter to select item when focused on search bar,
   * The actual enter key press is handled on individual items level.
   */

  var onItemsEnterKeyPress = useCallback(function (e) {
    if (e.key !== 'Enter') {
      return;
    }

    props.onInsertItem(items[selectedItemIndex]);
  }, [props, items, selectedItemIndex]);
  /**
   * On arrow key selection and clicks the selectedItemIndex will change.
   * Making sure to update parent component.
   */

  var selectedItem = items[selectedItemIndex];
  useEffect(function () {
    if (onSelectItem && selectedItem != null) {
      onSelectItem(selectedItem);
    }
  }, [onSelectItem, selectedItem]);
  return jsx("div", {
    css: wrapper,
    "data-testid": "element-browser"
  }, jsx(ContainerWidthMonitor, null), containerWidth < DEVICE_BREAKPOINT_NUMBERS.medium ? jsx(MobileBrowser, _extends({}, props, {
    selectedItemIndex: selectedItemIndex,
    focusedItemIndex: focusedItemIndex,
    setFocusedItemIndex: setFocusedItemIndex,
    focusOnSearch: focusOnSearch,
    setColumnCount: setColumnCount,
    setFocusOnSearch: setFocusOnSearch,
    onKeyPress: onItemsEnterKeyPress,
    onKeyDown: onKeyDown
  })) : jsx(DesktopBrowser, _extends({}, props, {
    selectedItemIndex: selectedItemIndex,
    focusedItemIndex: focusedItemIndex,
    setFocusedItemIndex: setFocusedItemIndex,
    focusOnSearch: focusOnSearch,
    setColumnCount: setColumnCount,
    setFocusOnSearch: setFocusOnSearch,
    onKeyPress: onItemsEnterKeyPress,
    onKeyDown: onKeyDown
  })));
}

function MobileBrowser(_ref) {
  var showCategories = _ref.showCategories,
      showSearch = _ref.showSearch,
      onSearch = _ref.onSearch,
      mode = _ref.mode,
      categories = _ref.categories,
      onSelectCategory = _ref.onSelectCategory,
      items = _ref.items,
      onInsertItem = _ref.onInsertItem,
      selectedCategory = _ref.selectedCategory,
      selectedItemIndex = _ref.selectedItemIndex,
      focusedItemIndex = _ref.focusedItemIndex,
      setFocusedItemIndex = _ref.setFocusedItemIndex,
      focusOnSearch = _ref.focusOnSearch,
      setColumnCount = _ref.setColumnCount,
      setFocusOnSearch = _ref.setFocusOnSearch,
      onKeyPress = _ref.onKeyPress,
      onKeyDown = _ref.onKeyDown,
      searchTerm = _ref.searchTerm,
      createAnalyticsEvent = _ref.createAnalyticsEvent,
      emptyStateHandler = _ref.emptyStateHandler;
  return jsx("div", {
    css: mobileElementBrowserContainer,
    onKeyPress: onKeyPress,
    onKeyDown: onKeyDown,
    "data-testid": "mobile__element-browser"
  }, jsx("div", {
    css: showCategories ? [mobileSideBar, mobileSideBarShowCategories] : mobileSideBar
  }, showSearch && jsx(ElementSearch, {
    onSearch: onSearch,
    mode: mode,
    focus: focusOnSearch,
    onClick: setFocusOnSearch,
    searchTerm: searchTerm
  }), showCategories && jsx("nav", {
    css: mobileCategoryListWrapper,
    tabIndex: -1
  }, jsx(CategoryList, {
    categories: categories,
    onSelectCategory: onSelectCategory,
    selectedCategory: selectedCategory
  }))), jsx("div", {
    css: mobileMainContent
  }, jsx(ElementList, {
    items: items,
    mode: mode,
    onInsertItem: onInsertItem,
    selectedItemIndex: selectedItemIndex,
    focusedItemIndex: focusedItemIndex,
    setFocusedItemIndex: setFocusedItemIndex,
    setColumnCount: setColumnCount,
    createAnalyticsEvent: createAnalyticsEvent,
    emptyStateHandler: emptyStateHandler,
    selectedCategory: selectedCategory,
    searchTerm: searchTerm
  })));
}

function DesktopBrowser(_ref2) {
  var showCategories = _ref2.showCategories,
      showSearch = _ref2.showSearch,
      onSearch = _ref2.onSearch,
      mode = _ref2.mode,
      categories = _ref2.categories,
      onSelectCategory = _ref2.onSelectCategory,
      items = _ref2.items,
      onInsertItem = _ref2.onInsertItem,
      selectedCategory = _ref2.selectedCategory,
      selectedItemIndex = _ref2.selectedItemIndex,
      focusedItemIndex = _ref2.focusedItemIndex,
      setFocusedItemIndex = _ref2.setFocusedItemIndex,
      focusOnSearch = _ref2.focusOnSearch,
      setColumnCount = _ref2.setColumnCount,
      setFocusOnSearch = _ref2.setFocusOnSearch,
      onKeyPress = _ref2.onKeyPress,
      onKeyDown = _ref2.onKeyDown,
      searchTerm = _ref2.searchTerm,
      createAnalyticsEvent = _ref2.createAnalyticsEvent,
      emptyStateHandler = _ref2.emptyStateHandler;
  return jsx("div", {
    css: elementBrowserContainer,
    "data-testid": "desktop__element-browser"
  }, showCategories && jsx("div", {
    css: showCategories ? sideBarShowCategories : sideBar
  }, jsx("h2", {
    css: sidebarHeading,
    "data-testid": "sidebar-heading"
  }, jsx(FormattedMessage, {
    id: "fabric.editor.elementbrowser.sidebar.heading",
    defaultMessage: "Browse",
    description: "Sidebar heading"
  })), jsx("nav", {
    css: categoryListWrapper
  }, jsx(CategoryList, {
    categories: categories,
    onSelectCategory: onSelectCategory,
    selectedCategory: selectedCategory,
    createAnalyticsEvent: createAnalyticsEvent
  }))), jsx("div", {
    css: mainContent,
    onKeyPress: onKeyPress,
    onKeyDown: onKeyDown,
    "data-testid": "main-content"
  }, showSearch && jsx("div", {
    css: searchContainer
  }, jsx(ElementSearch, {
    onSearch: onSearch,
    mode: mode,
    focus: focusOnSearch,
    onClick: setFocusOnSearch,
    searchTerm: searchTerm
  })), jsx(ElementList, {
    items: items,
    mode: mode,
    onInsertItem: onInsertItem,
    selectedItemIndex: selectedItemIndex,
    focusedItemIndex: focusedItemIndex,
    setFocusedItemIndex: setFocusedItemIndex,
    setColumnCount: setColumnCount,
    createAnalyticsEvent: createAnalyticsEvent,
    emptyStateHandler: emptyStateHandler,
    selectedCategory: selectedCategory,
    searchTerm: searchTerm
  })));
}

var MemoizedElementBrowser = /*#__PURE__*/memo(withAnalyticsContext({
  source: 'ElementBrowser'
})(withAnalyticsEvents()(StatelessElementBrowser)));
export default MemoizedElementBrowser;
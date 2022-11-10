import _extends from "@babel/runtime/helpers/extends";

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
const wrapper = css`
  width: 100%;
  max-height: inherit;
  overflow: hidden;
`;
const baseBrowserContainerStyles = css`
  display: flex;
  height: 100%;
  /** Needed for Safari to work with current css.
  * 100% heights wont work and
  * will default to auto if one of the containers doesn't have a specified height in pixels.
  * Setting the min-height to fill available fits safari's needs and the above 100% height works on the rest of the browsers.
  */

  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */

  /* stylelint-disable-next-line */
  min-height: -webkit-fill-available;
`;
const mobileElementBrowserContainer = css`
  ${baseBrowserContainerStyles};
  flex-direction: column;
`;
const elementBrowserContainer = css`
  ${baseBrowserContainerStyles};
  flex-direction: row;
`;
const baseSidebarStyles = css`
  display: flex;
  flex-direction: column;

  overflow-x: auto;
  overflow-y: hidden;
`;
const mobileSideBar = css`
  ${baseSidebarStyles};
  flex: 0 0 ${INLINE_SIDEBAR_HEIGHT};
  padding: 12px 12px 0 12px;
`;
const mobileSideBarShowCategories = css`
  flex: 0 0 auto;
`;
const sideBar = css`
  ${baseSidebarStyles};
  flex: 0 0 'auto';
`;
const sideBarShowCategories = css`
  ${baseSidebarStyles};
  flex: 0 0 ${SIDEBAR_WIDTH};
`;
const sidebarHeading = css`
  flex: 0 0 ${SIDEBAR_HEADING_WRAPPER_HEIGHT};
  display: inline-flex;
  align-items: center;
  padding-left: ${SIDEBAR_HEADING_PADDING_LEFT};
  font-weight: 700;
`;
const mobileMainContent = css`
  flex: 1 1 auto;

  display: flex;
  flex-direction: column;

  overflow-y: auto;
  height: 100%;
`;
const mainContent = css`
  ${mobileMainContent}
  margin-left: ${GRID_SIZE * 2}px;
  // Needed for safari
  height: auto;
`;
const searchContainer = css`
  padding-bottom: ${GRID_SIZE * 2}px;
`;
const mobileCategoryListWrapper = css`
  display: flex;
  overflow-x: auto;

  padding: ${GRID_SIZE}px 0 ${GRID_SIZE * 2}px 0;
  min-height: ${GRID_SIZE * 4}px;

  overflow: -moz-scrollbars-none;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;
const categoryListWrapper = css`
  ${mobileCategoryListWrapper}
  padding: 0;
  margin-top: ${GRID_SIZE * 3}px;
  flex-direction: column;
`;

function StatelessElementBrowser(props) {
  const {
    items,
    onSelectItem
  } = props;
  const {
    containerWidth,
    ContainerWidthMonitor
  } = useContainerWidth();
  const [columnCount, setColumnCount] = useState(1);
  const {
    selectedItemIndex,
    focusedItemIndex,
    setFocusedItemIndex,
    focusOnSearch,
    onKeyDown,
    setFocusOnSearch
  } = useSelectAndFocusOnArrowNavigation(items.length - 1, columnCount);
  useEffect(() => {
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
    return () => {
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

  const onItemsEnterKeyPress = useCallback(e => {
    if (e.key !== 'Enter') {
      return;
    }

    props.onInsertItem(items[selectedItemIndex]);
  }, [props, items, selectedItemIndex]);
  /**
   * On arrow key selection and clicks the selectedItemIndex will change.
   * Making sure to update parent component.
   */

  const selectedItem = items[selectedItemIndex];
  useEffect(() => {
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

function MobileBrowser({
  showCategories,
  showSearch,
  onSearch,
  mode,
  categories,
  onSelectCategory,
  items,
  onInsertItem,
  selectedCategory,
  selectedItemIndex,
  focusedItemIndex,
  setFocusedItemIndex,
  focusOnSearch,
  setColumnCount,
  setFocusOnSearch,
  onKeyPress,
  onKeyDown,
  searchTerm,
  createAnalyticsEvent,
  emptyStateHandler
}) {
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

function DesktopBrowser({
  showCategories,
  showSearch,
  onSearch,
  mode,
  categories,
  onSelectCategory,
  items,
  onInsertItem,
  selectedCategory,
  selectedItemIndex,
  focusedItemIndex,
  setFocusedItemIndex,
  focusOnSearch,
  setColumnCount,
  setFocusOnSearch,
  onKeyPress,
  onKeyDown,
  searchTerm,
  createAnalyticsEvent,
  emptyStateHandler
}) {
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

const MemoizedElementBrowser = /*#__PURE__*/memo(withAnalyticsContext({
  source: 'ElementBrowser'
})(withAnalyticsEvents()(StatelessElementBrowser)));
export default MemoizedElementBrowser;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _analyticsNext = require("@atlaskit/analytics-next");

var _analytics = require("../../../plugins/analytics");

var _ElementList = _interopRequireDefault(require("./ElementList/ElementList"));

var _CategoryList = _interopRequireDefault(require("./CategoryList"));

var _ElementSearch = _interopRequireDefault(require("./ElementSearch"));

var _constants = require("../constants");

var _useContainerWidth2 = _interopRequireDefault(require("../hooks/use-container-width"));

var _useSelectAndFocusOnArrowNavigation = _interopRequireDefault(require("../hooks/use-select-and-focus-on-arrow-navigation"));

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11, _templateObject12, _templateObject13, _templateObject14, _templateObject15;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var wrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  width: 100%;\n  max-height: inherit;\n  overflow: hidden;\n"])));
var baseBrowserContainerStyles = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  height: 100%;\n  /** Needed for Safari to work with current css.\n  * 100% heights wont work and\n  * will default to auto if one of the containers doesn't have a specified height in pixels.\n  * Setting the min-height to fill available fits safari's needs and the above 100% height works on the rest of the browsers.\n  */\n\n  /* TODO: fix in develop: https://atlassian.slack.com/archives/CFG3PSQ9E/p1647395052443259?thread_ts=1647394572.556029&cid=CFG3PSQ9E */\n\n  /* stylelint-disable-next-line */\n  min-height: -webkit-fill-available;\n"])));
var mobileElementBrowserContainer = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n  flex-direction: column;\n"])), baseBrowserContainerStyles);
var elementBrowserContainer = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n  flex-direction: row;\n"])), baseBrowserContainerStyles);
var baseSidebarStyles = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n\n  overflow-x: auto;\n  overflow-y: hidden;\n"])));
var mobileSideBar = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n  flex: 0 0 ", ";\n  padding: 12px 12px 0 12px;\n"])), baseSidebarStyles, _constants.INLINE_SIDEBAR_HEIGHT);
var mobileSideBarShowCategories = (0, _react2.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 0 0 auto;\n"])));
var sideBar = (0, _react2.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n  flex: 0 0 'auto';\n"])), baseSidebarStyles);
var sideBarShowCategories = (0, _react2.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n  flex: 0 0 ", ";\n"])), baseSidebarStyles, _constants.SIDEBAR_WIDTH);
var sidebarHeading = (0, _react2.css)(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 0 0 ", ";\n  display: inline-flex;\n  align-items: center;\n  padding-left: ", ";\n  font-weight: 700;\n"])), _constants.SIDEBAR_HEADING_WRAPPER_HEIGHT, _constants.SIDEBAR_HEADING_PADDING_LEFT);
var mobileMainContent = (0, _react2.css)(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 1 1 auto;\n\n  display: flex;\n  flex-direction: column;\n\n  overflow-y: auto;\n  height: 100%;\n"])));
var mainContent = (0, _react2.css)(_templateObject12 || (_templateObject12 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n  margin-left: ", "px;\n  // Needed for safari\n  height: auto;\n"])), mobileMainContent, _constants.GRID_SIZE * 2);
var searchContainer = (0, _react2.css)(_templateObject13 || (_templateObject13 = (0, _taggedTemplateLiteral2.default)(["\n  padding-bottom: ", "px;\n"])), _constants.GRID_SIZE * 2);
var mobileCategoryListWrapper = (0, _react2.css)(_templateObject14 || (_templateObject14 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  overflow-x: auto;\n\n  padding: ", "px 0 ", "px 0;\n  min-height: ", "px;\n\n  overflow: -moz-scrollbars-none;\n  ::-webkit-scrollbar {\n    display: none;\n  }\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n"])), _constants.GRID_SIZE, _constants.GRID_SIZE * 2, _constants.GRID_SIZE * 4);
var categoryListWrapper = (0, _react2.css)(_templateObject15 || (_templateObject15 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n  padding: 0;\n  margin-top: ", "px;\n  flex-direction: column;\n"])), mobileCategoryListWrapper, _constants.GRID_SIZE * 3);

function StatelessElementBrowser(props) {
  var items = props.items,
      onSelectItem = props.onSelectItem;

  var _useContainerWidth = (0, _useContainerWidth2.default)(),
      containerWidth = _useContainerWidth.containerWidth,
      ContainerWidthMonitor = _useContainerWidth.ContainerWidthMonitor;

  var _useState = (0, _react.useState)(1),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      columnCount = _useState2[0],
      setColumnCount = _useState2[1];

  var _useSelectAndFocusOnA = (0, _useSelectAndFocusOnArrowNavigation.default)(items.length - 1, columnCount),
      selectedItemIndex = _useSelectAndFocusOnA.selectedItemIndex,
      focusedItemIndex = _useSelectAndFocusOnA.focusedItemIndex,
      setFocusedItemIndex = _useSelectAndFocusOnA.setFocusedItemIndex,
      focusOnSearch = _useSelectAndFocusOnA.focusOnSearch,
      onKeyDown = _useSelectAndFocusOnA.onKeyDown,
      setFocusOnSearch = _useSelectAndFocusOnA.setFocusOnSearch;

  (0, _react.useEffect)(function () {
    (0, _analytics.fireAnalyticsEvent)(props.createAnalyticsEvent)({
      payload: {
        action: _analytics.ACTION.OPENED,
        actionSubject: _analytics.ACTION_SUBJECT.ELEMENT_BROWSER,
        eventType: _analytics.EVENT_TYPE.UI,
        attributes: {
          mode: props.mode
        }
      }
    });
    return function () {
      (0, _analytics.fireAnalyticsEvent)(props.createAnalyticsEvent)({
        payload: {
          action: _analytics.ACTION.CLOSED,
          actionSubject: _analytics.ACTION_SUBJECT.ELEMENT_BROWSER,
          eventType: _analytics.EVENT_TYPE.UI,
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

  var onItemsEnterKeyPress = (0, _react.useCallback)(function (e) {
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
  (0, _react.useEffect)(function () {
    if (onSelectItem && selectedItem != null) {
      onSelectItem(selectedItem);
    }
  }, [onSelectItem, selectedItem]);
  return (0, _react2.jsx)("div", {
    css: wrapper,
    "data-testid": "element-browser"
  }, (0, _react2.jsx)(ContainerWidthMonitor, null), containerWidth < _constants.DEVICE_BREAKPOINT_NUMBERS.medium ? (0, _react2.jsx)(MobileBrowser, (0, _extends2.default)({}, props, {
    selectedItemIndex: selectedItemIndex,
    focusedItemIndex: focusedItemIndex,
    setFocusedItemIndex: setFocusedItemIndex,
    focusOnSearch: focusOnSearch,
    setColumnCount: setColumnCount,
    setFocusOnSearch: setFocusOnSearch,
    onKeyPress: onItemsEnterKeyPress,
    onKeyDown: onKeyDown
  })) : (0, _react2.jsx)(DesktopBrowser, (0, _extends2.default)({}, props, {
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
  return (0, _react2.jsx)("div", {
    css: mobileElementBrowserContainer,
    onKeyPress: onKeyPress,
    onKeyDown: onKeyDown,
    "data-testid": "mobile__element-browser"
  }, (0, _react2.jsx)("div", {
    css: showCategories ? [mobileSideBar, mobileSideBarShowCategories] : mobileSideBar
  }, showSearch && (0, _react2.jsx)(_ElementSearch.default, {
    onSearch: onSearch,
    mode: mode,
    focus: focusOnSearch,
    onClick: setFocusOnSearch,
    searchTerm: searchTerm
  }), showCategories && (0, _react2.jsx)("nav", {
    css: mobileCategoryListWrapper,
    tabIndex: -1
  }, (0, _react2.jsx)(_CategoryList.default, {
    categories: categories,
    onSelectCategory: onSelectCategory,
    selectedCategory: selectedCategory
  }))), (0, _react2.jsx)("div", {
    css: mobileMainContent
  }, (0, _react2.jsx)(_ElementList.default, {
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
  return (0, _react2.jsx)("div", {
    css: elementBrowserContainer,
    "data-testid": "desktop__element-browser"
  }, showCategories && (0, _react2.jsx)("div", {
    css: showCategories ? sideBarShowCategories : sideBar
  }, (0, _react2.jsx)("h2", {
    css: sidebarHeading,
    "data-testid": "sidebar-heading"
  }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, {
    id: "fabric.editor.elementbrowser.sidebar.heading",
    defaultMessage: "Browse",
    description: "Sidebar heading"
  })), (0, _react2.jsx)("nav", {
    css: categoryListWrapper
  }, (0, _react2.jsx)(_CategoryList.default, {
    categories: categories,
    onSelectCategory: onSelectCategory,
    selectedCategory: selectedCategory,
    createAnalyticsEvent: createAnalyticsEvent
  }))), (0, _react2.jsx)("div", {
    css: mainContent,
    onKeyPress: onKeyPress,
    onKeyDown: onKeyDown,
    "data-testid": "main-content"
  }, showSearch && (0, _react2.jsx)("div", {
    css: searchContainer
  }, (0, _react2.jsx)(_ElementSearch.default, {
    onSearch: onSearch,
    mode: mode,
    focus: focusOnSearch,
    onClick: setFocusOnSearch,
    searchTerm: searchTerm
  })), (0, _react2.jsx)(_ElementList.default, {
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

var MemoizedElementBrowser = /*#__PURE__*/(0, _react.memo)((0, _analyticsNext.withAnalyticsContext)({
  source: 'ElementBrowser'
})((0, _analyticsNext.withAnalyticsEvents)()(StatelessElementBrowser)));
var _default = MemoizedElementBrowser;
exports.default = _default;
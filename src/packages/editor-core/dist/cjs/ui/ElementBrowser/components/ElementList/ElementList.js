"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementItem = ElementItem;
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _AutoSizer = require("react-virtualized/dist/commonjs/AutoSizer");

var _Collection = require("react-virtualized/dist/commonjs/Collection");

var _menu = require("@atlaskit/menu");

var _colors = require("@atlaskit/theme/colors");

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _analyticsNext = require("@atlaskit/analytics-next");

var _analytics = require("../../../../plugins/analytics");

var _fallback = _interopRequireDefault(require("../../../../plugins/quick-insert/assets/fallback"));

var _TypeAheadListItem = require("../../../../plugins/type-ahead/ui/TypeAheadListItem");

var _styles = require("../../../styles");

var _constants = require("../../constants");

var _useContainerWidth2 = _interopRequireDefault(require("../../hooks/use-container-width"));

var _useFocus = _interopRequireDefault(require("../../hooks/use-focus"));

var _types = require("../../types");

var _cellSizeAndPositionGetter = _interopRequireDefault(require("./cellSizeAndPositionGetter"));

var _EmptyState = _interopRequireDefault(require("./EmptyState"));

var _utils = require("./utils");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;

var _excluded = ["items", "mode", "selectedItemIndex", "focusedItemIndex", "setColumnCount", "createAnalyticsEvent", "emptyStateHandler", "selectedCategory", "searchTerm"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

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
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _useContainerWidth = (0, _useContainerWidth2.default)(),
      containerWidth = _useContainerWidth.containerWidth,
      ContainerWidthMonitor = _useContainerWidth.ContainerWidthMonitor;

  var _useState = (0, _react.useState)(_constants.SCROLLBAR_WIDTH),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      scrollbarWidth = _useState2[0],
      setScrollbarWidth = _useState2[1];

  var fullMode = mode === _types.Modes.full;
  (0, _react.useEffect)(function () {
    /**
     * More of an optimization condition.
     * Initially the containerWidths are reported 0 twice.
     **/
    if (fullMode && containerWidth > 0) {
      setColumnCount((0, _utils.getColumnCount)(containerWidth));
      var updatedScrollbarWidth = (0, _utils.getScrollbarWidth)();

      if (updatedScrollbarWidth > 0) {
        setScrollbarWidth(updatedScrollbarWidth);
      }
    }
  }, [fullMode, containerWidth, setColumnCount, scrollbarWidth]);
  var onExternalLinkClick = (0, _react.useCallback)(function () {
    (0, _analytics.fireAnalyticsEvent)(createAnalyticsEvent)({
      payload: {
        action: _analytics.ACTION.VISITED,
        actionSubject: _analytics.ACTION_SUBJECT.SMART_LINK,
        eventType: _analytics.EVENT_TYPE.TRACK
      }
    });
  }, [createAnalyticsEvent]);
  var cellRenderer = (0, _react.useMemo)(function () {
    return function (_ref2) {
      var index = _ref2.index,
          key = _ref2.key,
          style = _ref2.style;

      if (items[index] == null) {
        return;
      }

      return (0, _react2.jsx)("div", {
        style: style,
        key: key,
        className: "element-item-wrapper",
        css: elementItemWrapper
      }, (0, _react2.jsx)(MemoizedElementItem, (0, _extends2.default)({
        inlineMode: !fullMode,
        index: index,
        item: items[index],
        selected: selectedItemIndex === index,
        focus: focusedItemIndex === index
      }, props)));
    };
  }, [items, fullMode, selectedItemIndex, focusedItemIndex, props]);
  return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(ContainerWidthMonitor, null), !items.length ? emptyStateHandler ? emptyStateHandler({
    mode: mode,
    selectedCategory: selectedCategory,
    searchTerm: searchTerm
  }) : (0, _react2.jsx)(_EmptyState.default, {
    onExternalLinkClick: onExternalLinkClick
  }) : (0, _react2.jsx)("div", {
    css: elementItemsWrapper,
    "data-testid": "element-items"
  }, (0, _react2.jsx)(_react.Fragment, null, containerWidth > 0 && (0, _react2.jsx)(_AutoSizer.AutoSizer, {
    disableWidth: true
  }, function (_ref3) {
    var height = _ref3.height;
    return (0, _react2.jsx)(_Collection.Collection, {
      cellCount: items.length,
      cellRenderer: cellRenderer,
      cellSizeAndPositionGetter: (0, _cellSizeAndPositionGetter.default)(containerWidth - _constants.ELEMENT_LIST_PADDING * 2, scrollbarWidth),
      height: height,
      width: containerWidth - _constants.ELEMENT_LIST_PADDING * 2 // containerWidth - padding on Left/Right (for focus outline)

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

var MemoizedElementItem = /*#__PURE__*/(0, _react.memo)(ElementItem);
MemoizedElementItem.displayName = 'MemoizedElementItem';

function ElementItem(_ref4) {
  var inlineMode = _ref4.inlineMode,
      selected = _ref4.selected,
      item = _ref4.item,
      index = _ref4.index,
      onInsertItem = _ref4.onInsertItem,
      focus = _ref4.focus,
      setFocusedItemIndex = _ref4.setFocusedItemIndex;
  var ref = (0, _useFocus.default)(focus);
  /**
   * Note: props.onSelectItem(item) is not called here as the StatelessElementBrowser's
   * useEffect would trigger it on selectedItemIndex change. (Line 106-110)
   * This implementation was changed for keyboard/click selection to work with `onInsertItem`.
   */

  var onClick = (0, _react.useCallback)(function (e) {
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
  return (0, _react2.jsx)(_tooltip.default, {
    content: description,
    testId: "element-item-tooltip-".concat(index)
  }, (0, _react2.jsx)(_menu.ButtonItem, {
    onClick: onClick,
    iconBefore: (0, _react2.jsx)(ElementBefore, {
      icon: icon,
      title: title
    }),
    isSelected: selected,
    "aria-describedby": title,
    ref: ref,
    testId: "element-item-".concat(index)
  }, (0, _react2.jsx)(ItemContent, {
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
var ElementBefore = /*#__PURE__*/(0, _react.memo)(function (_ref5) {
  var icon = _ref5.icon,
      title = _ref5.title;
  return (0, _react2.jsx)("div", {
    css: [_TypeAheadListItem.itemIcon, itemIconStyle]
  }, icon ? icon() : (0, _react2.jsx)(_fallback.default, null));
});
var ItemContent = /*#__PURE__*/(0, _react.memo)(function (_ref6) {
  var title = _ref6.title,
      description = _ref6.description,
      keyshortcut = _ref6.keyshortcut;
  return (0, _react2.jsx)("div", {
    css: itemBody,
    className: "item-body"
  }, (0, _react2.jsx)("div", {
    css: itemText
  }, (0, _react2.jsx)("div", {
    css: itemTitleWrapper
  }, (0, _react2.jsx)("p", {
    css: itemTitle
  }, title), (0, _react2.jsx)("div", {
    css: itemAfter
  }, keyshortcut && (0, _react2.jsx)("div", {
    css: _styles.shortcutStyle
  }, keyshortcut))), description && (0, _react2.jsx)("p", {
    css: itemDescription
  }, description)));
});
var elementItemsWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  flex: 1;\n  flex-flow: row wrap;\n  align-items: flex-start;\n  justify-content: flex-start;\n  overflow: hidden;\n  padding: ", "px; // For Focus outline\n\n  .ReactVirtualized__Collection {\n    border-radius: 3px; // Standard border-radius across other components like Search or Item.\n    outline: none;\n\n    :focus {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n    }\n  }\n  .ReactVirtualized__Collection__innerScrollContainer {\n    div[class='element-item-wrapper']:last-child {\n      padding-bottom: 4px;\n    }\n  }\n"])), _constants.ELEMENT_LIST_PADDING, _constants.ELEMENT_LIST_PADDING, (0, _tokens.token)('color.border.focused', _colors.B100));
var elementItemWrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  div {\n    button {\n      height: 75px;\n      align-items: flex-start;\n      padding: 12px 12px 11px;\n    }\n  }\n"])));
var itemBody = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  justify-content: space-between;\n  line-height: 1.4;\n  width: 100%;\n\n  margin-top: -2px; // Fixes the Item Icon and text's alignment issue\n"])));
/*
 * -webkit-line-clamp is also supported by firefox 🎉
 * https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/68#CSS
 */

var multilineStyle = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n"])));
var itemDescription = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  ", ";\n\n  overflow: hidden;\n  font-size: ", ";\n  color: ", ";\n  margin-top: 2px;\n"])), multilineStyle, (0, _editorSharedStyles.relativeFontSizeToBase16)(11.67), (0, _tokens.token)('color.text.subtle', _colors.N200));
var itemText = (0, _react2.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  width: inherit;\n  white-space: initial;\n"])));
var itemTitleWrapper = (0, _react2.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: space-between; // Title and keyboardshortcut are rendered in the same block\n"])));
var itemTitle = (0, _react2.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  width: 100%;\n  overflow: hidden;\n\n  white-space: nowrap;\n  text-overflow: ellipsis;\n"])));
var itemAfter = (0, _react2.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  flex: 0 0 auto;\n"])));
var itemIconStyle = (0, _react2.css)(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n  img {\n    height: 40px;\n    width: 40px;\n    object-fit: cover;\n  }\n"])));
var MemoizedElementListWithAnalytics = /*#__PURE__*/(0, _react.memo)((0, _analyticsNext.withAnalyticsContext)({
  component: 'ElementList'
})(ElementList));
var _default = MemoizedElementListWithAnalytics;
exports.default = _default;
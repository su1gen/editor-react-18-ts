"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypeAheadList = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _menu = require("@atlaskit/menu");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _CellMeasurer = require("react-virtualized/dist/commonjs/CellMeasurer");

var _List = require("react-virtualized/dist/commonjs/List");

var _TypeAheadListItem = require("./TypeAheadListItem");

var _reactIntlNext = require("react-intl-next");

var _messages = require("../messages");

var _utils = require("../utils");

var _updateSelectedIndex = require("../commands/update-selected-index");

var _AssistiveText = require("./AssistiveText");

var _constants = require("../constants");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var LIST_ITEM_ESTIMATED_HEIGHT = _TypeAheadListItem.ICON_HEIGHT + _TypeAheadListItem.ITEM_PADDING * 2;
var LIST_WIDTH = 320;

var TypeaheadAssistiveTextPureComponent = /*#__PURE__*/_react.default.memo(function (_ref) {
  var numberOfResults = _ref.numberOfResults;
  var intl = (0, _reactIntlNext.useIntl)();
  return (0, _react2.jsx)(_AssistiveText.AssistiveText, {
    assistiveText: intl.formatMessage(_messages.typeAheadListMessages.searchResultsLabel, {
      itemsLength: numberOfResults
    }) // when the popup is open its always in focus
    ,
    isInFocus: true,
    id: _constants.TYPE_AHEAD_DECORATION_ELEMENT_ID + '__popup'
  });
});

var TypeAheadListComponent = /*#__PURE__*/_react.default.memo(function (_ref2) {
  var _decorationElement$qu2;

  var items = _ref2.items,
      selectedIndex = _ref2.selectedIndex,
      editorView = _ref2.editorView,
      onItemClick = _ref2.onItemClick,
      intl = _ref2.intl,
      fitHeight = _ref2.fitHeight,
      decorationElement = _ref2.decorationElement;
  var listRef = (0, _react.useRef)();
  var listContainerRef = (0, _react.useRef)(null);
  var lastVisibleIndexes = (0, _react.useRef)({
    overscanStartIndex: 0,
    overscanStopIndex: 0,
    startIndex: 0,
    stopIndex: 0
  });
  var estimatedHeight = items.length * LIST_ITEM_ESTIMATED_HEIGHT;

  var _useState = (0, _react.useState)(Math.min(estimatedHeight, fitHeight)),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  var _useState3 = (0, _react.useState)(new _CellMeasurer.CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT
  })),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      cache = _useState4[0],
      setCache = _useState4[1];

  var onItemsRendered = (0, _react.useCallback)(function (props) {
    lastVisibleIndexes.current = props;
  }, []);
  var actions = (0, _react.useMemo)(function () {
    return {
      onItemClick: onItemClick
    };
  }, [onItemClick]);

  var isNavigationKey = function isNavigationKey(event) {
    return ['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key);
  };

  var focusTargetElement = (0, _react.useCallback)(function () {
    var _decorationElement$qu;

    //To reset the selected index
    (0, _updateSelectedIndex.updateSelectedIndex)(-1)(editorView.state, editorView.dispatch);
    listRef.current.scrollToRow(0);
    decorationElement === null || decorationElement === void 0 ? void 0 : (_decorationElement$qu = decorationElement.querySelector("[role='combobox']")) === null || _decorationElement$qu === void 0 ? void 0 : _decorationElement$qu.focus();
  }, [editorView, listRef, decorationElement]);
  var selectNextItem = (0, _react.useMemo)(function () {
    return (0, _utils.moveSelectedIndex)({
      editorView: editorView,
      direction: 'next'
    });
  }, [editorView]);
  var selectPreviousItem = (0, _react.useMemo)(function () {
    return (0, _utils.moveSelectedIndex)({
      editorView: editorView,
      direction: 'previous'
    });
  }, [editorView]);
  var lastVisibleStartIndex = lastVisibleIndexes.current.startIndex;
  var lastVisibleStopIndex = lastVisibleIndexes.current.stopIndex;
  var onScroll = (0, _react.useCallback)(function (_ref3) {
    var scrollUpdateWasRequested = _ref3.scrollUpdateWasRequested;

    if (!scrollUpdateWasRequested) {
      return;
    } // In case the user scroll to a non-visible item like press ArrowUp from the first index
    // We will force the scroll calling the scrollToItem in the useEffect hook
    // When the scroll happens and we render the elements,
    // we still need calculate the items height and re-draw the List.
    // It is possible the item selected became invisible again (because the items height changed)
    // So, we need to wait for height to be calculated. Then we need to check
    // if the selected item is visible or not. If it isn't visible we call the scrollToItem again.
    //
    // We can't do this check in the first frame because that frame is being used by the resetScreenThrottled
    // to calculate each height. THen, we can schedule a new frame when this one finishs.


    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var isSelectedItemVisible = selectedIndex >= lastVisibleStartIndex && selectedIndex <= lastVisibleStopIndex; //Should scroll to the list item only when the selectedIndex >= 0 and item is not visible

        if (!isSelectedItemVisible && selectedIndex !== -1) {
          listRef.current.scrollToRow(selectedIndex);
        } else if (selectedIndex === -1) {
          listRef.current.scrollToRow(0);
        }
      });
    });
  }, [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex]);
  (0, _react.useLayoutEffect)(function () {
    if (!listRef.current) {
      return;
    }

    var isSelectedItemVisible = selectedIndex >= lastVisibleStartIndex && selectedIndex <= lastVisibleStopIndex; //Should scroll to the list item only when the selectedIndex >= 0 and item is not visible

    if (!isSelectedItemVisible && selectedIndex !== -1) {
      listRef.current.scrollToRow(selectedIndex);
    } else if (selectedIndex === -1) {
      listRef.current.scrollToRow(0);
    }
  }, [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex]);
  (0, _react.useLayoutEffect)(function () {
    setCache(new _CellMeasurer.CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT
    }));
  }, [items]);
  (0, _react.useLayoutEffect)(function () {
    var height = Math.min(items.reduce(function (prevValue, currentValue, index) {
      return prevValue + cache.rowHeight({
        index: index
      });
    }, 0), fitHeight);
    setHeight(height);
  }, [items, cache, fitHeight]);
  (0, _react.useLayoutEffect)(function () {
    if (!listContainerRef.current) {
      return;
    }

    var element = listContainerRef.current;
    /**
     * To handle the key events on the list
     * @param event
     */

    var handleKeyDown = function handleKeyDown(event) {
      if (isNavigationKey(event)) {
        switch (event.key) {
          case 'ArrowDown':
            if (selectedIndex === items.length - 1) {
              event.stopPropagation();
            } else {
              selectNextItem();
            }

            event.preventDefault();
            break;

          case 'ArrowUp':
            if (selectedIndex === 0) {
              //To set focus on target element when up arrow is pressed on first option of list
              focusTargetElement();
            } else {
              selectPreviousItem();
            }

            event.preventDefault();
            break;

          case 'Tab':
            //Tab key quick inserts the selected item.
            onItemClick(_typeAhead.SelectItemMode.TAB, selectedIndex);
            event.preventDefault();
            break;

          case 'Enter':
            //Enter key quick inserts the selected item.
            if (!event.isComposing || event.which !== 229 && event.keyCode !== 229) {
              onItemClick(event.shiftKey ? _typeAhead.SelectItemMode.SHIFT_ENTER : _typeAhead.SelectItemMode.ENTER, selectedIndex);
              event.preventDefault();
            }

            break;

          default:
            event.preventDefault();
        }
      } else {
        //All the remaining keys sets focus on the typeahead query(inputQuery.tsx))
        focusTargetElement();
      }
    };

    element === null || element === void 0 ? void 0 : element.addEventListener('keydown', handleKeyDown);
    return function () {
      element === null || element === void 0 ? void 0 : element.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorView.state, focusTargetElement, selectNextItem, selectPreviousItem, selectedIndex, onItemClick, items.length]);

  var renderRow = function renderRow(_ref4) {
    var index = _ref4.index,
        key = _ref4.key,
        style = _ref4.style,
        parent = _ref4.parent;
    return (0, _react2.jsx)(_CellMeasurer.CellMeasurer, {
      key: key,
      cache: cache,
      parent: parent,
      columnIndex: 0,
      rowIndex: index
    }, (0, _react2.jsx)("div", {
      style: style,
      "data-index": index
    }, (0, _react2.jsx)("div", {
      "data-testid": "list-item-height-observed-".concat(index)
    }, (0, _react2.jsx)(_TypeAheadListItem.TypeAheadListItem, {
      key: items[index].title,
      item: items[index],
      itemsLength: items.length,
      itemIndex: index,
      selectedIndex: selectedIndex,
      onItemClick: actions.onItemClick
    }))));
  };

  if (!Array.isArray(items)) {
    return null;
  }

  var menuGroupId = ((_decorationElement$qu2 = decorationElement.querySelector("[role='combobox']")) === null || _decorationElement$qu2 === void 0 ? void 0 : _decorationElement$qu2.getAttribute('aria-controls')) || _constants.TYPE_AHEAD_DECORATION_ELEMENT_ID;
  return (0, _react2.jsx)(_menu.MenuGroup, {
    "aria-label": intl.formatMessage(_messages.typeAheadListMessages.typeAheadResultLabel),
    "aria-relevant": "additions removals"
  }, (0, _react2.jsx)("div", {
    id: menuGroupId,
    ref: listContainerRef
  }, (0, _react2.jsx)(_List.List, {
    rowRenderer: renderRow,
    ref: listRef,
    rowCount: items.length,
    rowHeight: cache.rowHeight,
    onRowsRendered: onItemsRendered,
    width: LIST_WIDTH,
    onScroll: onScroll,
    height: height,
    overscanRowCount: 3,
    containerRole: "presentation",
    role: "listbox",
    css: (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n              button {\n                padding: 12px 12px 11px;\n                span:last-child span:last-child {\n                  white-space: normal;\n                }\n              }\n            "])))
  }), (0, _react2.jsx)(TypeaheadAssistiveTextPureComponent, {
    numberOfResults: items.length.toString()
  })));
});

var TypeAheadList = (0, _reactIntlNext.injectIntl)(TypeAheadListComponent);
exports.TypeAheadList = TypeAheadList;
TypeAheadList.displayName = 'TypeAheadList';
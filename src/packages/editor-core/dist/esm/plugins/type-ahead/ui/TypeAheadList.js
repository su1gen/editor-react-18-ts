import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

var _templateObject;

/** @jsx jsx */
import React, { useMemo, useRef, useCallback, useLayoutEffect, useState } from 'react';
import { jsx, css } from '@emotion/react';
import { MenuGroup } from '@atlaskit/menu';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List } from 'react-virtualized/dist/commonjs/List';
import { ICON_HEIGHT, ITEM_PADDING, TypeAheadListItem } from './TypeAheadListItem';
import { injectIntl, useIntl } from 'react-intl-next';
import { typeAheadListMessages } from '../messages';
import { moveSelectedIndex } from '../utils';
import { updateSelectedIndex } from '../commands/update-selected-index';
import { AssistiveText } from './AssistiveText';
import { TYPE_AHEAD_DECORATION_ELEMENT_ID } from '../constants';
var LIST_ITEM_ESTIMATED_HEIGHT = ICON_HEIGHT + ITEM_PADDING * 2;
var LIST_WIDTH = 320;
var TypeaheadAssistiveTextPureComponent = /*#__PURE__*/React.memo(function (_ref) {
  var numberOfResults = _ref.numberOfResults;
  var intl = useIntl();
  return jsx(AssistiveText, {
    assistiveText: intl.formatMessage(typeAheadListMessages.searchResultsLabel, {
      itemsLength: numberOfResults
    }) // when the popup is open its always in focus
    ,
    isInFocus: true,
    id: TYPE_AHEAD_DECORATION_ELEMENT_ID + '__popup'
  });
});
var TypeAheadListComponent = /*#__PURE__*/React.memo(function (_ref2) {
  var _decorationElement$qu2;

  var items = _ref2.items,
      selectedIndex = _ref2.selectedIndex,
      editorView = _ref2.editorView,
      onItemClick = _ref2.onItemClick,
      intl = _ref2.intl,
      fitHeight = _ref2.fitHeight,
      decorationElement = _ref2.decorationElement;
  var listRef = useRef();
  var listContainerRef = useRef(null);
  var lastVisibleIndexes = useRef({
    overscanStartIndex: 0,
    overscanStopIndex: 0,
    startIndex: 0,
    stopIndex: 0
  });
  var estimatedHeight = items.length * LIST_ITEM_ESTIMATED_HEIGHT;

  var _useState = useState(Math.min(estimatedHeight, fitHeight)),
      _useState2 = _slicedToArray(_useState, 2),
      height = _useState2[0],
      setHeight = _useState2[1];

  var _useState3 = useState(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT
  })),
      _useState4 = _slicedToArray(_useState3, 2),
      cache = _useState4[0],
      setCache = _useState4[1];

  var onItemsRendered = useCallback(function (props) {
    lastVisibleIndexes.current = props;
  }, []);
  var actions = useMemo(function () {
    return {
      onItemClick: onItemClick
    };
  }, [onItemClick]);

  var isNavigationKey = function isNavigationKey(event) {
    return ['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key);
  };

  var focusTargetElement = useCallback(function () {
    var _decorationElement$qu;

    //To reset the selected index
    updateSelectedIndex(-1)(editorView.state, editorView.dispatch);
    listRef.current.scrollToRow(0);
    decorationElement === null || decorationElement === void 0 ? void 0 : (_decorationElement$qu = decorationElement.querySelector("[role='combobox']")) === null || _decorationElement$qu === void 0 ? void 0 : _decorationElement$qu.focus();
  }, [editorView, listRef, decorationElement]);
  var selectNextItem = useMemo(function () {
    return moveSelectedIndex({
      editorView: editorView,
      direction: 'next'
    });
  }, [editorView]);
  var selectPreviousItem = useMemo(function () {
    return moveSelectedIndex({
      editorView: editorView,
      direction: 'previous'
    });
  }, [editorView]);
  var lastVisibleStartIndex = lastVisibleIndexes.current.startIndex;
  var lastVisibleStopIndex = lastVisibleIndexes.current.stopIndex;
  var onScroll = useCallback(function (_ref3) {
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
  useLayoutEffect(function () {
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
  useLayoutEffect(function () {
    setCache(new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT
    }));
  }, [items]);
  useLayoutEffect(function () {
    var height = Math.min(items.reduce(function (prevValue, currentValue, index) {
      return prevValue + cache.rowHeight({
        index: index
      });
    }, 0), fitHeight);
    setHeight(height);
  }, [items, cache, fitHeight]);
  useLayoutEffect(function () {
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
            onItemClick(SelectItemMode.TAB, selectedIndex);
            event.preventDefault();
            break;

          case 'Enter':
            //Enter key quick inserts the selected item.
            if (!event.isComposing || event.which !== 229 && event.keyCode !== 229) {
              onItemClick(event.shiftKey ? SelectItemMode.SHIFT_ENTER : SelectItemMode.ENTER, selectedIndex);
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
    return jsx(CellMeasurer, {
      key: key,
      cache: cache,
      parent: parent,
      columnIndex: 0,
      rowIndex: index
    }, jsx("div", {
      style: style,
      "data-index": index
    }, jsx("div", {
      "data-testid": "list-item-height-observed-".concat(index)
    }, jsx(TypeAheadListItem, {
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

  var menuGroupId = ((_decorationElement$qu2 = decorationElement.querySelector("[role='combobox']")) === null || _decorationElement$qu2 === void 0 ? void 0 : _decorationElement$qu2.getAttribute('aria-controls')) || TYPE_AHEAD_DECORATION_ELEMENT_ID;
  return jsx(MenuGroup, {
    "aria-label": intl.formatMessage(typeAheadListMessages.typeAheadResultLabel),
    "aria-relevant": "additions removals"
  }, jsx("div", {
    id: menuGroupId,
    ref: listContainerRef
  }, jsx(List, {
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
    css: css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n              button {\n                padding: 12px 12px 11px;\n                span:last-child span:last-child {\n                  white-space: normal;\n                }\n              }\n            "])))
  }), jsx(TypeaheadAssistiveTextPureComponent, {
    numberOfResults: items.length.toString()
  })));
});
export var TypeAheadList = injectIntl(TypeAheadListComponent);
TypeAheadList.displayName = 'TypeAheadList';
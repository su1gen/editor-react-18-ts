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
const LIST_ITEM_ESTIMATED_HEIGHT = ICON_HEIGHT + ITEM_PADDING * 2;
const LIST_WIDTH = 320;
const TypeaheadAssistiveTextPureComponent = /*#__PURE__*/React.memo(({
  numberOfResults
}) => {
  const intl = useIntl();
  return jsx(AssistiveText, {
    assistiveText: intl.formatMessage(typeAheadListMessages.searchResultsLabel, {
      itemsLength: numberOfResults
    }) // when the popup is open its always in focus
    ,
    isInFocus: true,
    id: TYPE_AHEAD_DECORATION_ELEMENT_ID + '__popup'
  });
});
const TypeAheadListComponent = /*#__PURE__*/React.memo(({
  items,
  selectedIndex,
  editorView,
  onItemClick,
  intl,
  fitHeight,
  decorationElement
}) => {
  var _decorationElement$qu2;

  const listRef = useRef();
  const listContainerRef = useRef(null);
  const lastVisibleIndexes = useRef({
    overscanStartIndex: 0,
    overscanStopIndex: 0,
    startIndex: 0,
    stopIndex: 0
  });
  const estimatedHeight = items.length * LIST_ITEM_ESTIMATED_HEIGHT;
  const [height, setHeight] = useState(Math.min(estimatedHeight, fitHeight));
  const [cache, setCache] = useState(new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT
  }));
  const onItemsRendered = useCallback(props => {
    lastVisibleIndexes.current = props;
  }, []);
  const actions = useMemo(() => ({
    onItemClick
  }), [onItemClick]);

  const isNavigationKey = event => {
    return ['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key);
  };

  const focusTargetElement = useCallback(() => {
    var _decorationElement$qu;

    //To reset the selected index
    updateSelectedIndex(-1)(editorView.state, editorView.dispatch);
    listRef.current.scrollToRow(0);
    decorationElement === null || decorationElement === void 0 ? void 0 : (_decorationElement$qu = decorationElement.querySelector(`[role='combobox']`)) === null || _decorationElement$qu === void 0 ? void 0 : _decorationElement$qu.focus();
  }, [editorView, listRef, decorationElement]);
  const selectNextItem = useMemo(() => moveSelectedIndex({
    editorView,
    direction: 'next'
  }), [editorView]);
  const selectPreviousItem = useMemo(() => moveSelectedIndex({
    editorView,
    direction: 'previous'
  }), [editorView]);
  const lastVisibleStartIndex = lastVisibleIndexes.current.startIndex;
  const lastVisibleStopIndex = lastVisibleIndexes.current.stopIndex;
  const onScroll = useCallback(({
    scrollUpdateWasRequested
  }) => {
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


    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const isSelectedItemVisible = selectedIndex >= lastVisibleStartIndex && selectedIndex <= lastVisibleStopIndex; //Should scroll to the list item only when the selectedIndex >= 0 and item is not visible

        if (!isSelectedItemVisible && selectedIndex !== -1) {
          listRef.current.scrollToRow(selectedIndex);
        } else if (selectedIndex === -1) {
          listRef.current.scrollToRow(0);
        }
      });
    });
  }, [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex]);
  useLayoutEffect(() => {
    if (!listRef.current) {
      return;
    }

    const isSelectedItemVisible = selectedIndex >= lastVisibleStartIndex && selectedIndex <= lastVisibleStopIndex; //Should scroll to the list item only when the selectedIndex >= 0 and item is not visible

    if (!isSelectedItemVisible && selectedIndex !== -1) {
      listRef.current.scrollToRow(selectedIndex);
    } else if (selectedIndex === -1) {
      listRef.current.scrollToRow(0);
    }
  }, [selectedIndex, lastVisibleStartIndex, lastVisibleStopIndex]);
  useLayoutEffect(() => {
    setCache(new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: LIST_ITEM_ESTIMATED_HEIGHT
    }));
  }, [items]);
  useLayoutEffect(() => {
    const height = Math.min(items.reduce((prevValue, currentValue, index) => {
      return prevValue + cache.rowHeight({
        index: index
      });
    }, 0), fitHeight);
    setHeight(height);
  }, [items, cache, fitHeight]);
  useLayoutEffect(() => {
    if (!listContainerRef.current) {
      return;
    }

    const {
      current: element
    } = listContainerRef;
    /**
     * To handle the key events on the list
     * @param event
     */

    const handleKeyDown = event => {
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
    return () => {
      element === null || element === void 0 ? void 0 : element.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorView.state, focusTargetElement, selectNextItem, selectPreviousItem, selectedIndex, onItemClick, items.length]);

  const renderRow = ({
    index,
    key,
    style,
    parent
  }) => {
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
      "data-testid": `list-item-height-observed-${index}`
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

  const menuGroupId = ((_decorationElement$qu2 = decorationElement.querySelector(`[role='combobox']`)) === null || _decorationElement$qu2 === void 0 ? void 0 : _decorationElement$qu2.getAttribute('aria-controls')) || TYPE_AHEAD_DECORATION_ELEMENT_ID;
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
    css: css`
              button {
                padding: 12px 12px 11px;
                span:last-child span:last-child {
                  white-space: normal;
                }
              }
            `
  }), jsx(TypeaheadAssistiveTextPureComponent, {
    numberOfResults: items.length.toString()
  })));
});
export const TypeAheadList = injectIntl(TypeAheadListComponent);
TypeAheadList.displayName = 'TypeAheadList';
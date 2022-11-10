/** @jsx jsx */
import React, { useEffect, useState, useRef } from 'react';
import { css, jsx } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { gridSize } from '@atlaskit/theme/constants';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import ChevronRightLargeIcon from '@atlaskit/icon/glyph/chevron-right-large';
import Button from './Button';
import messages from './messages';
import rafSchedule from 'raf-schd';
const akGridSize = gridSize();
const toolbarScrollButtons = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${akGridSize / 2}px;
  padding: ${akGridSize / 2}px ${akGridSize}px;
  border-left: solid ${token('color.border', N30)} 1px;
  flex-shrink: 0;
  align-items: center;
`;
const LeftIcon = ChevronLeftLargeIcon;
const RightIcon = ChevronRightLargeIcon;
export default (({
  intl,
  scrollContainerRef,
  node,
  disabled
}) => {
  var _scrollContainerRef$c, _scrollContainerRef$c2;

  const buttonsContainerRef = useRef(null);
  const [needScroll, setNeedScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(true);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const items = Array.from(((_scrollContainerRef$c = scrollContainerRef.current) === null || _scrollContainerRef$c === void 0 ? void 0 : (_scrollContainerRef$c2 = _scrollContainerRef$c.firstChild) === null || _scrollContainerRef$c2 === void 0 ? void 0 : _scrollContainerRef$c2.childNodes) || {});
  const scheduledSetCanScroll = rafSchedule(() => {
    const {
      scrollLeft,
      scrollWidth,
      offsetWidth
    } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + offsetWidth < scrollWidth - 1); // -1 to account for half pixel
  });

  const onScroll = () => scheduledSetCanScroll();

  const scrollLeft = () => {
    // find the first item partially visible
    for (const [itemIndex, item] of items.reverse().entries()) {
      var _scrollContainerRef$c3;

      const {
        left: itemLeft,
        width: itemWidth
      } = item.getBoundingClientRect();
      const {
        left: scrollContainerLeft = 0,
        width: scrollContainerWidth = 0
      } = ((_scrollContainerRef$c3 = scrollContainerRef.current) === null || _scrollContainerRef$c3 === void 0 ? void 0 : _scrollContainerRef$c3.getBoundingClientRect()) || {}; // if item is partially visible on the left, scroll to it so it became the last item visible

      if (itemLeft <= scrollContainerLeft) {
        var _scrollContainerRef$c4, _scrollContainerRef$c5;

        const gap = scrollContainerWidth - itemWidth;
        let scrollTo = item.offsetLeft - gap; // if scrollTo is same as current scrollLeft

        if (Math.floor(scrollTo) === Math.floor((scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : (_scrollContainerRef$c4 = scrollContainerRef.current) === null || _scrollContainerRef$c4 === void 0 ? void 0 : _scrollContainerRef$c4.scrollLeft) || 0)) {
          // if this is the first item, scroll to the beginning, otherwise find next item to scroll to
          if (itemIndex === items.length - 1) {
            scrollTo = 0;
          } else {
            continue;
          }
        }

        scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : (_scrollContainerRef$c5 = scrollContainerRef.current) === null || _scrollContainerRef$c5 === void 0 ? void 0 : _scrollContainerRef$c5.scrollTo({
          top: 0,
          left: scrollTo,
          behavior: 'smooth'
        });
        break;
      }
    }
  };

  const scrollRight = () => {
    // find the last item partially visible
    for (const item of items) {
      var _scrollContainerRef$c6;

      const {
        left: itemLeft,
        width: itemWidth
      } = item.getBoundingClientRect();
      const {
        left: scrollContainerLeft = 0,
        width: scrollContainerWidth = 0
      } = ((_scrollContainerRef$c6 = scrollContainerRef.current) === null || _scrollContainerRef$c6 === void 0 ? void 0 : _scrollContainerRef$c6.getBoundingClientRect()) || {}; // if item is partially visible on the right

      if (itemLeft + itemWidth >= scrollContainerLeft + scrollContainerWidth) {
        var _scrollContainerRef$c7, _scrollContainerRef$c8, _scrollContainerRef$c9;

        let scrollTo = item.offsetLeft; // if the item is longer than the entire container width, just scroll past it

        if (itemWidth >= scrollContainerWidth && (((_scrollContainerRef$c7 = scrollContainerRef.current) === null || _scrollContainerRef$c7 === void 0 ? void 0 : _scrollContainerRef$c7.scrollLeft) || 0) >= itemLeft - 1) {
          scrollTo = item.offsetLeft + item.offsetWidth;
        } // if scrollTo is same as current scrollLeft, find next item to scroll to


        if (Math.floor(scrollTo) === Math.floor((scrollContainerRef === null || scrollContainerRef === void 0 ? void 0 : (_scrollContainerRef$c8 = scrollContainerRef.current) === null || _scrollContainerRef$c8 === void 0 ? void 0 : _scrollContainerRef$c8.scrollLeft) || 0)) {
          continue;
        }

        (_scrollContainerRef$c9 = scrollContainerRef.current) === null || _scrollContainerRef$c9 === void 0 ? void 0 : _scrollContainerRef$c9.scrollTo({
          top: 0,
          left: scrollTo,
          behavior: 'smooth'
        });
        break;
      }
    }
  };

  const resizeObserver = new ResizeObserver(t => {
    var _scrollContainerRef$c10, _scrollContainerRef$c11, _scrollContainerRef$c12;

    const widthNeededToShowAllItems = ((_scrollContainerRef$c10 = scrollContainerRef.current) === null || _scrollContainerRef$c10 === void 0 ? void 0 : _scrollContainerRef$c10.scrollWidth) || 0;
    const availableSpace = (_scrollContainerRef$c11 = scrollContainerRef.current) === null || _scrollContainerRef$c11 === void 0 ? void 0 : (_scrollContainerRef$c12 = _scrollContainerRef$c11.parentNode) === null || _scrollContainerRef$c12 === void 0 ? void 0 : _scrollContainerRef$c12.offsetWidth;

    if (availableSpace >= widthNeededToShowAllItems) {
      setNeedScroll(false);
    } else {
      setNeedScroll(true);
      onScroll();
    }
  });
  useEffect(() => {
    const scrollContainerRefCurrent = scrollContainerRef.current;
    onScroll();

    if (scrollContainerRefCurrent) {
      // enable/disable scroll buttons depending on scroll position
      scrollContainerRefCurrent.addEventListener('scroll', onScroll); // watch for toolbar resize and show/hide scroll buttons if needed

      resizeObserver.observe(scrollContainerRefCurrent); // reset scroll position when switching from one node with toolbar to another

      scrollContainerRefCurrent.scrollTo({
        left: 0
      });
    }

    return () => {
      if (scrollContainerRefCurrent) {
        scrollContainerRefCurrent.removeEventListener('scroll', onScroll);
        resizeObserver.unobserve(scrollContainerRefCurrent);
      }
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node, scrollContainerRef]);
  return needScroll ? jsx("div", {
    ref: buttonsContainerRef,
    css: toolbarScrollButtons
  }, jsx(Button, {
    title: intl.formatMessage(messages.floatingToolbarScrollLeft),
    icon: jsx(LeftIcon, {
      label: intl.formatMessage(messages.floatingToolbarScrollLeft)
    }),
    onClick: scrollLeft,
    disabled: !canScrollLeft || disabled
  }), jsx(Button, {
    title: intl.formatMessage(messages.floatingToolbarScrollRight),
    icon: jsx(RightIcon, {
      label: intl.formatMessage(messages.floatingToolbarScrollRight)
    }),
    onClick: scrollRight,
    disabled: !canScrollRight || disabled
  })) : null;
});
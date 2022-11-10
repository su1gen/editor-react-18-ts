"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateVirtualizedContainerDatum = generateVirtualizedContainerDatum;
exports.getColumnCount = getColumnCount;
exports.getScrollbarWidth = getScrollbarWidth;

var _constants = require("../../constants");

function getColumnCount(clientWidth) {
  var small = _constants.FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.small,
      medium = _constants.FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.medium,
      large = _constants.FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS.large;

  switch (true) {
    case clientWidth < small:
      return 1;

    case clientWidth >= small && clientWidth < medium:
      return Math.floor(clientWidth / 200);

    case clientWidth >= large:
      return Math.floor(clientWidth / 248);

    default:
      return Math.floor(clientWidth / 220);
  }
}

function generateVirtualizedContainerDatum(containerWidth, options) {
  var scrollbarWidth = options.scrollbarWidth;
  var columnCount = getColumnCount(containerWidth);
  var availableWidth = containerWidth - (scrollbarWidth + _constants.ELEMENT_LIST_PADDING);
  return {
    availableWidth: availableWidth,
    columnCount: columnCount
  };
}

var CALCULATED_SCROLLBAR_WIDTH;

function getScrollbarWidth() {
  if (!CALCULATED_SCROLLBAR_WIDTH) {
    var _container$parentNode;

    var container = document.createElement('div');
    container.style.visibility = 'hidden';
    container.style.overflow = 'scroll';
    document.body.appendChild(container);
    var innerContainer = document.createElement('div');
    container.appendChild(innerContainer);
    var scrollbarWidth = container.offsetWidth - innerContainer.offsetWidth;
    (_container$parentNode = container.parentNode) === null || _container$parentNode === void 0 ? void 0 : _container$parentNode.removeChild(container);

    if (scrollbarWidth) {
      CALCULATED_SCROLLBAR_WIDTH = scrollbarWidth;
      return scrollbarWidth;
    }

    return _constants.SCROLLBAR_WIDTH;
  } else {
    return CALCULATED_SCROLLBAR_WIDTH;
  }
}
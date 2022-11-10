/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { gridSize } from '@atlaskit/theme/constants';
export var GRID_SIZE = gridSize();
export var DEVICE_BREAKPOINT_NUMBERS = {
  small: GRID_SIZE * 40,
  medium: GRID_SIZE * 75,
  large: GRID_SIZE * 128
};
export var FLEX_ITEMS_CONTAINER_BREAKPOINT_NUMBERS = {
  small: GRID_SIZE * 50,
  medium: DEVICE_BREAKPOINT_NUMBERS.medium,
  large: DEVICE_BREAKPOINT_NUMBERS.large
};
export var SIDEBAR_WIDTH = "".concat(GRID_SIZE * 25, "px");
export var SIDEBAR_HEADING_WRAPPER_HEIGHT = "".concat(GRID_SIZE * 6, "px");
export var SIDEBAR_HEADING_PADDING_LEFT = '12px';
export var INLINE_SIDEBAR_HEIGHT = '54px';
export var SEARCH_ITEM_MARGIN = '12px';
export var SEARCH_ITEM_HEIGHT_WIDTH = '20px';
export var SCROLLBAR_WIDTH = 15;
export var ELEMENT_LIST_PADDING = 2;
export var MODAL_WRAPPER_PADDING = 16;
export var ELEMENT_ITEM_HEIGHT = 75;
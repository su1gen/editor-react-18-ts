"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cellSizeAndPositionGetter;

var _constants = require("../../constants");

var _utils = require("./utils");

/**
 * Callback responsible for returning size and offset/position information
 * for a given cell.
 * https://github.com/bvaughn/react-virtualized/blob/master/docs/Collection.md
 **/
function cellSizeAndPositionGetter(containerWidth, scrollbarWidth) {
  var GUTTER_SIZE = 4;
  /**
   * Save the currently rendered columnY positions.
   * Have to be within the current render scope.
   */

  var columnYMap = [];
  return function (_ref) {
    var index = _ref.index;

    var _generateVirtualizedC = (0, _utils.generateVirtualizedContainerDatum)(containerWidth, {
      gutterSize: GUTTER_SIZE,
      scrollbarWidth: scrollbarWidth
    }),
        columnCount = _generateVirtualizedC.columnCount,
        availableWidth = _generateVirtualizedC.availableWidth;

    var width = Math.floor(availableWidth / columnCount);
    var height = _constants.ELEMENT_ITEM_HEIGHT;
    var columnPosition = index % (columnCount || 1);
    var x = columnPosition * width;
    var y = columnYMap[columnPosition] || 0;
    columnYMap[columnPosition] = y + height;
    return {
      height: height,
      width: width,
      x: x,
      y: y
    };
  };
}
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handlePositionCalculatedWith = exports.getOffsetParent = exports.getNearestNonTextNode = void 0;

var getCursorHeightFrom = function getCursorHeightFrom(node) {
  return parseFloat(window.getComputedStyle(node, undefined).lineHeight || '');
};

var getOffsetParent = function getOffsetParent(editorViewDom, popupsMountPoint) {
  return popupsMountPoint ? popupsMountPoint.offsetParent : editorViewDom.offsetParent;
};

exports.getOffsetParent = getOffsetParent;

var getNearestNonTextNode = function getNearestNonTextNode(node) {
  return node.nodeType === Node.TEXT_NODE ? node.parentNode : node;
};
/**
 * We need to translate the co-ordinates because `coordsAtPos` returns co-ordinates
 * relative to `window`. And, also need to adjust the cursor container height.
 * (0, 0)
 * +--------------------- [window] ---------------------+
 * |   (left, top) +-------- [Offset Parent] --------+  |
 * | {coordsAtPos} | [Cursor]   <- cursorHeight      |  |
 * |               | [FloatingToolbar]               |  |
 */


exports.getNearestNonTextNode = getNearestNonTextNode;

var convertFixedCoordinatesToAbsolutePositioning = function convertFixedCoordinatesToAbsolutePositioning(coordinates, offsetParent, cursorHeight) {
  var _offsetParent$getBoun = offsetParent.getBoundingClientRect(),
      offsetParentLeft = _offsetParent$getBoun.left,
      offsetParentTop = _offsetParent$getBoun.top,
      offsetParentHeight = _offsetParent$getBoun.height;

  return {
    left: coordinates.left - offsetParentLeft,
    right: coordinates.right - offsetParentLeft,
    top: coordinates.top - (offsetParentTop - cursorHeight) + offsetParent.scrollTop,
    bottom: offsetParentHeight - (coordinates.top - (offsetParentTop - cursorHeight) - offsetParent.scrollTop)
  };
};

var handlePositionCalculatedWith = function handlePositionCalculatedWith(offsetParent, node, getCurrentFixedCoordinates) {
  return function (position) {
    if (!offsetParent) {
      return position;
    }

    var target = getNearestNonTextNode(node);
    var cursorHeight = getCursorHeightFrom(target);
    var fixedCoordinates = getCurrentFixedCoordinates();
    var absoluteCoordinates = convertFixedCoordinatesToAbsolutePositioning(fixedCoordinates, offsetParent, cursorHeight);
    return {
      left: position.left ? absoluteCoordinates.left : undefined,
      right: position.right ? absoluteCoordinates.right : undefined,
      top: position.top ? absoluteCoordinates.top : undefined,
      bottom: position.bottom ? absoluteCoordinates.bottom : undefined
    };
  };
};

exports.handlePositionCalculatedWith = handlePositionCalculatedWith;
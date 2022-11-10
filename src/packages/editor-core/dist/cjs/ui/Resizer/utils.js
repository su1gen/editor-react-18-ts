"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.snapTo = exports.imageAlignmentMap = exports.handleSides = exports.alignmentLayouts = void 0;

var snapTo = function snapTo(target, points) {
  return points.length === 0 ? // extreme last case if there are no points somehow
  target : points.reduce(function (point, closest) {
    return Math.abs(closest - target) < Math.abs(point - target) ? closest : point;
  });
};

exports.snapTo = snapTo;
var handleSides = ['left', 'right'];
exports.handleSides = handleSides;
var alignmentLayouts = ['align-start', 'align-end'];
exports.alignmentLayouts = alignmentLayouts;
var imageAlignmentMap = {
  left: 'start',
  right: 'end'
};
exports.imageAlignmentMap = imageAlignmentMap;
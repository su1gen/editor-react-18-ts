"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.widthToToolbarSize = exports.toolbarSizeToWidth = void 0;

var _isFullPage = require("../../utils/is-full-page");

var _types = require("./types");

// Toolbar sizes for full page editor a little bit different, because it has more buttons e.g. actions button...
var toolbarSizesFullPage = [{
  width: _types.ToolbarWidthsFullPage.XXL,
  size: _types.ToolbarSize.XXL
}, {
  width: _types.ToolbarWidthsFullPage.XL,
  size: _types.ToolbarSize.XL
}, {
  width: _types.ToolbarWidthsFullPage.L,
  size: _types.ToolbarSize.L
}, {
  width: _types.ToolbarWidthsFullPage.M,
  size: _types.ToolbarSize.M
}, {
  width: _types.ToolbarWidthsFullPage.S,
  size: _types.ToolbarSize.S
}];
var toolbarSizes = [{
  width: _types.ToolbarWidths.XXL,
  size: _types.ToolbarSize.XXL
}, {
  width: _types.ToolbarWidths.XL,
  size: _types.ToolbarSize.XL
}, {
  width: _types.ToolbarWidths.L,
  size: _types.ToolbarSize.L
}, {
  width: _types.ToolbarWidths.M,
  size: _types.ToolbarSize.M
}, {
  width: _types.ToolbarWidths.S,
  size: _types.ToolbarSize.S
}];

var toolbarSizesForAppearance = function toolbarSizesForAppearance(appearance) {
  return (0, _isFullPage.isFullPage)(appearance) ? toolbarSizesFullPage : toolbarSizes;
};

var toolbarSizeToWidth = function toolbarSizeToWidth(toolbarSize, appearance) {
  return (toolbarSizesForAppearance(appearance).find(function (_ref) {
    var size = _ref.size;
    return toolbarSize === size;
  }) || {
    width: _types.ToolbarWidths.S
  }).width;
};

exports.toolbarSizeToWidth = toolbarSizeToWidth;

var widthToToolbarSize = function widthToToolbarSize(toolbarWidth, appearance) {
  return (toolbarSizesForAppearance(appearance).find(function (_ref2) {
    var width = _ref2.width;
    return toolbarWidth > width;
  }) || {
    size: _types.ToolbarSize.XXXS
  }).size;
};

exports.widthToToolbarSize = widthToToolbarSize;
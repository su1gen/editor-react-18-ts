import { isFullPage } from '../../utils/is-full-page';
import { ToolbarSize, ToolbarWidths, ToolbarWidthsFullPage } from './types'; // Toolbar sizes for full page editor a little bit different, because it has more buttons e.g. actions button...

var toolbarSizesFullPage = [{
  width: ToolbarWidthsFullPage.XXL,
  size: ToolbarSize.XXL
}, {
  width: ToolbarWidthsFullPage.XL,
  size: ToolbarSize.XL
}, {
  width: ToolbarWidthsFullPage.L,
  size: ToolbarSize.L
}, {
  width: ToolbarWidthsFullPage.M,
  size: ToolbarSize.M
}, {
  width: ToolbarWidthsFullPage.S,
  size: ToolbarSize.S
}];
var toolbarSizes = [{
  width: ToolbarWidths.XXL,
  size: ToolbarSize.XXL
}, {
  width: ToolbarWidths.XL,
  size: ToolbarSize.XL
}, {
  width: ToolbarWidths.L,
  size: ToolbarSize.L
}, {
  width: ToolbarWidths.M,
  size: ToolbarSize.M
}, {
  width: ToolbarWidths.S,
  size: ToolbarSize.S
}];

var toolbarSizesForAppearance = function toolbarSizesForAppearance(appearance) {
  return isFullPage(appearance) ? toolbarSizesFullPage : toolbarSizes;
};

export var toolbarSizeToWidth = function toolbarSizeToWidth(toolbarSize, appearance) {
  return (toolbarSizesForAppearance(appearance).find(function (_ref) {
    var size = _ref.size;
    return toolbarSize === size;
  }) || {
    width: ToolbarWidths.S
  }).width;
};
export var widthToToolbarSize = function widthToToolbarSize(toolbarWidth, appearance) {
  return (toolbarSizesForAppearance(appearance).find(function (_ref2) {
    var width = _ref2.width;
    return toolbarWidth > width;
  }) || {
    size: ToolbarSize.XXXS
  }).size;
};
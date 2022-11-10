import { isFullPage } from '../../utils/is-full-page';
import { ToolbarSize, ToolbarWidths, ToolbarWidthsFullPage } from './types'; // Toolbar sizes for full page editor a little bit different, because it has more buttons e.g. actions button...

const toolbarSizesFullPage = [{
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
const toolbarSizes = [{
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

const toolbarSizesForAppearance = appearance => isFullPage(appearance) ? toolbarSizesFullPage : toolbarSizes;

export const toolbarSizeToWidth = (toolbarSize, appearance) => {
  return (toolbarSizesForAppearance(appearance).find(({
    size
  }) => toolbarSize === size) || {
    width: ToolbarWidths.S
  }).width;
};
export const widthToToolbarSize = (toolbarWidth, appearance) => {
  return (toolbarSizesForAppearance(appearance).find(({
    width
  }) => toolbarWidth > width) || {
    size: ToolbarSize.XXXS
  }).size;
};
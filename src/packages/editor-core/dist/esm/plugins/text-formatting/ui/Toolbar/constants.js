import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _ResponsiveCustomButt, _ResponsiveCustomMenu;

import { ToolbarSize } from '../../../../ui/Toolbar/types';
import { IconTypes } from './types';
export var DefaultButtonsToolbar = [IconTypes.strong, IconTypes.em];
export var DefaultButtonsMenu = [IconTypes.underline, IconTypes.strike, IconTypes.code, IconTypes.subscript, IconTypes.superscript];
export var ResponsiveCustomButtonToolbar = (_ResponsiveCustomButt = {}, _defineProperty(_ResponsiveCustomButt, ToolbarSize.XXL, DefaultButtonsToolbar), _defineProperty(_ResponsiveCustomButt, ToolbarSize.XL, DefaultButtonsToolbar), _defineProperty(_ResponsiveCustomButt, ToolbarSize.L, DefaultButtonsToolbar), _defineProperty(_ResponsiveCustomButt, ToolbarSize.M, []), _defineProperty(_ResponsiveCustomButt, ToolbarSize.S, []), _defineProperty(_ResponsiveCustomButt, ToolbarSize.XXXS, []), _ResponsiveCustomButt);
export var ResponsiveCustomMenu = (_ResponsiveCustomMenu = {}, _defineProperty(_ResponsiveCustomMenu, ToolbarSize.XXL, DefaultButtonsMenu), _defineProperty(_ResponsiveCustomMenu, ToolbarSize.XL, DefaultButtonsMenu), _defineProperty(_ResponsiveCustomMenu, ToolbarSize.L, DefaultButtonsMenu), _defineProperty(_ResponsiveCustomMenu, ToolbarSize.M, [IconTypes.strong, IconTypes.em].concat(DefaultButtonsMenu)), _defineProperty(_ResponsiveCustomMenu, ToolbarSize.S, [IconTypes.strong, IconTypes.em].concat(DefaultButtonsMenu)), _defineProperty(_ResponsiveCustomMenu, ToolbarSize.XXXS, [IconTypes.strong, IconTypes.em].concat(DefaultButtonsMenu)), _ResponsiveCustomMenu);
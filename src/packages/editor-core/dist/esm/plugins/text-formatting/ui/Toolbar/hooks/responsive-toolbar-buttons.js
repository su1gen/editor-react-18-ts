import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { useMemo } from 'react';
import { ResponsiveCustomButtonToolbar, ResponsiveCustomMenu, DefaultButtonsMenu, DefaultButtonsToolbar } from '../constants';
export var useResponsiveIconTypeButtons = function useResponsiveIconTypeButtons(_ref) {
  var toolbarSize = _ref.toolbarSize,
      responsivenessEnabled = _ref.responsivenessEnabled;
  var iconTypeList = useMemo(function () {
    return ResponsiveCustomButtonToolbar[toolbarSize];
  }, [toolbarSize]);
  return responsivenessEnabled ? iconTypeList : DefaultButtonsToolbar;
};
export var useResponsiveIconTypeMenu = function useResponsiveIconTypeMenu(_ref2) {
  var toolbarSize = _ref2.toolbarSize,
      responsivenessEnabled = _ref2.responsivenessEnabled;
  var iconTypeList = useMemo(function () {
    return ResponsiveCustomMenu[toolbarSize];
  }, [toolbarSize]);
  return responsivenessEnabled ? iconTypeList : DefaultButtonsMenu;
};
export var useResponsiveToolbarButtons = function useResponsiveToolbarButtons(_ref3) {
  var icons = _ref3.icons,
      toolbarSize = _ref3.toolbarSize,
      responsivenessEnabled = _ref3.responsivenessEnabled;
  var iconTypeList = useResponsiveIconTypeButtons({
    toolbarSize: toolbarSize,
    responsivenessEnabled: responsivenessEnabled
  });
  var iconsPosition = useMemo(function () {
    return icons.reduce(function (acc, icon) {
      if (!icon || !icon.iconMark) {
        return acc;
      }

      var isIconSingleButton = iconTypeList.includes(icon.iconMark);

      if (isIconSingleButton) {
        return {
          dropdownItems: acc.dropdownItems,
          singleItems: [].concat(_toConsumableArray(acc.singleItems), [icon])
        };
      }

      return {
        dropdownItems: [].concat(_toConsumableArray(acc.dropdownItems), [icon]),
        singleItems: acc.singleItems
      };
    }, {
      dropdownItems: [],
      singleItems: []
    });
  }, [icons, iconTypeList]);
  return iconsPosition;
};
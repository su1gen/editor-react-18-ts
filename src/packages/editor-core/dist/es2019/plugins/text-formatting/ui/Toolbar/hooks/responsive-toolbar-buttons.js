import { useMemo } from 'react';
import { ResponsiveCustomButtonToolbar, ResponsiveCustomMenu, DefaultButtonsMenu, DefaultButtonsToolbar } from '../constants';
export const useResponsiveIconTypeButtons = ({
  toolbarSize,
  responsivenessEnabled
}) => {
  const iconTypeList = useMemo(() => ResponsiveCustomButtonToolbar[toolbarSize], [toolbarSize]);
  return responsivenessEnabled ? iconTypeList : DefaultButtonsToolbar;
};
export const useResponsiveIconTypeMenu = ({
  toolbarSize,
  responsivenessEnabled
}) => {
  const iconTypeList = useMemo(() => ResponsiveCustomMenu[toolbarSize], [toolbarSize]);
  return responsivenessEnabled ? iconTypeList : DefaultButtonsMenu;
};
export const useResponsiveToolbarButtons = ({
  icons,
  toolbarSize,
  responsivenessEnabled
}) => {
  const iconTypeList = useResponsiveIconTypeButtons({
    toolbarSize,
    responsivenessEnabled
  });
  const iconsPosition = useMemo(() => {
    return icons.reduce((acc, icon) => {
      if (!icon || !icon.iconMark) {
        return acc;
      }

      const isIconSingleButton = iconTypeList.includes(icon.iconMark);

      if (isIconSingleButton) {
        return {
          dropdownItems: acc.dropdownItems,
          singleItems: [...acc.singleItems, icon]
        };
      }

      return {
        dropdownItems: [...acc.dropdownItems, icon],
        singleItems: acc.singleItems
      };
    }, {
      dropdownItems: [],
      singleItems: []
    });
  }, [icons, iconTypeList]);
  return iconsPosition;
};
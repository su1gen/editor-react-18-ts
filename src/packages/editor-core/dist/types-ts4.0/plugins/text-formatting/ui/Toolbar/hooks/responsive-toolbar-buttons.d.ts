import { ToolbarSize } from '../../../../../ui/Toolbar/types';
import { MenuIconItem } from '../types';
export declare const useResponsiveIconTypeButtons: ({ toolbarSize, responsivenessEnabled, }: {
    toolbarSize: ToolbarSize;
    responsivenessEnabled: boolean;
}) => import("../types").IconTypes[];
export declare const useResponsiveIconTypeMenu: ({ toolbarSize, responsivenessEnabled, }: {
    toolbarSize: ToolbarSize;
    responsivenessEnabled: boolean;
}) => import("../types").IconTypes[];
declare type IconsPositions = {
    dropdownItems: Array<MenuIconItem>;
    singleItems: Array<MenuIconItem>;
};
export declare const useResponsiveToolbarButtons: ({ icons, toolbarSize, responsivenessEnabled, }: {
    responsivenessEnabled: boolean;
    toolbarSize: ToolbarSize;
    icons: Array<MenuIconItem | null>;
}) => IconsPositions;
export {};

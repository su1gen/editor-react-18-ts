/** @jsx jsx */
import React from 'react';
import { PaletteColor } from '../ColorPalette/Palettes';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
declare type Props = WithAnalyticsEventsProps & {
    currentColor?: string;
    title?: string;
    onChange?: (color: PaletteColor) => void;
    colorPalette: PaletteColor[];
    placement: string;
    cols?: number;
    alignX?: 'left' | 'right' | 'center' | 'end';
    size?: {
        width: number;
        height: number;
    };
    mountPoint?: HTMLElement;
    setDisableParentScroll?: (disable: boolean) => void;
};
declare const _default: React.ForwardRefExoticComponent<Pick<Omit<Props, keyof WithAnalyticsEventsProps> & React.RefAttributes<any> & import("@atlaskit/analytics-next").WithContextProps, "key" | "title" | "onChange" | "size" | "currentColor" | "cols" | "analyticsContext" | "alignX" | "colorPalette" | "placement" | "mountPoint" | "setDisableParentScroll"> & React.RefAttributes<any>>;
export default _default;

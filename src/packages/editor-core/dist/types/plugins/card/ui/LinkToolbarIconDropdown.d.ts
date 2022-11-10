/// <reference types="react" />
import { jsx } from '@emotion/react';
import type { GlyphProps } from '@atlaskit/icon/types';
import { Props as DropdownProps } from '../../floating-toolbar/ui/Dropdown';
export declare const ICON_HEIGHT = 40;
export declare const ICON_WIDTH = 40;
interface IconSizeProps {
    width?: number;
    height?: number;
}
export interface IconDropdownOptionProps {
    title: string;
    description: string;
    selected: boolean;
    disabled: boolean;
    onClick: () => void;
    icon: (props: GlyphProps & IconSizeProps) => JSX.Element;
    testId?: string;
    tooltipContent?: string | null;
}
export interface LinkToolbarIconDropdownProps extends DropdownProps {
    options: IconDropdownOptionProps[];
}
export declare const LinkToolbarIconDropdown: ({ options, ...rest }: LinkToolbarIconDropdownProps) => jsx.JSX.Element;
export {};

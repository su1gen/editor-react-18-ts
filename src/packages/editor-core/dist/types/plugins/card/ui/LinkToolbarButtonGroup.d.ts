/// <reference types="react" />
import { jsx } from '@emotion/react';
import type { GlyphProps } from '@atlaskit/icon/types';
export interface ButtonOptionProps {
    title: string;
    selected: boolean;
    testId: string;
    disabled: boolean;
    tooltipContent?: string | null;
    onClick: () => void;
    icon: (props: GlyphProps) => JSX.Element;
}
export interface LinkToolbarButtonGroupProps {
    options: ButtonOptionProps[];
}
export declare const LinkToolbarButtonGroup: ({ options, }: LinkToolbarButtonGroupProps) => jsx.JSX.Element;

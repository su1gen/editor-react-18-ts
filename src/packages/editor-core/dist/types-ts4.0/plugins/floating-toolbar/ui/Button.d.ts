import React from 'react';
import type { ButtonAppearance } from '@atlaskit/editor-common/types';
export type { ButtonAppearance };
export interface Props {
    title?: string;
    icon?: React.ReactElement<any>;
    iconAfter?: React.ReactElement<any>;
    onClick?: React.MouseEventHandler;
    onMouseEnter?: <T>(event: React.MouseEvent<T>) => void;
    onMouseLeave?: <T>(event: React.MouseEvent<T>) => void;
    onFocus?: <T>(event: React.FocusEvent<T>) => void;
    onBlur?: <T>(event: React.FocusEvent<T>) => void;
    selected?: boolean;
    disabled?: boolean;
    appearance?: ButtonAppearance;
    ariaHasPopup?: boolean | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid' | undefined;
    href?: string;
    target?: string;
    children?: React.ReactNode;
    className?: string;
    tooltipContent?: React.ReactNode;
    testId?: string;
    hideTooltipOnClick?: boolean;
    tabIndex?: number | null | undefined;
}
declare const _default: ({ title, icon, iconAfter, onClick, onMouseEnter, onMouseLeave, onFocus, onBlur, selected, disabled, href, target, appearance, children, className, tooltipContent, testId, hideTooltipOnClick, ariaHasPopup, tabIndex, }: Props) => JSX.Element;
export default _default;

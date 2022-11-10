/** @jsx jsx */
import { jsx } from '@emotion/react';
import { ToolbarProps } from '../types';
export declare type DropdownProps = ToolbarProps & {
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
};
export declare function ToolbarDropdown(props: DropdownProps): jsx.JSX.Element;

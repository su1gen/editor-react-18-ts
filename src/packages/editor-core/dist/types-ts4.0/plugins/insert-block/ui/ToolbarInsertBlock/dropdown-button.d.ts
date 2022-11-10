/** @jsx jsx */
import React from 'react';
import { ToolbarButtonRef } from '../../../../ui/ToolbarButton';
export interface DropDownButtonProps {
    label: string;
    selected: boolean;
    disabled?: boolean;
    'aria-expanded': React.AriaAttributes['aria-expanded'];
    'aria-haspopup': React.AriaAttributes['aria-haspopup'];
    onClick: React.MouseEventHandler;
    spacing: 'none' | 'default';
    handleRef(el: ToolbarButtonRef): void;
}
export declare const DropDownButton: React.StatelessComponent<DropDownButtonProps>;

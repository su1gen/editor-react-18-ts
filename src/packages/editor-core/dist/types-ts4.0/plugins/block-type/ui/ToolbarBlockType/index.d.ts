/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { BlockTypeState } from '../../pm-plugins/main';
import { BlockType } from '../../types';
import { MenuItem } from '../../../../ui/DropdownMenu/types';
export declare type DropdownItem = MenuItem & {
    value: BlockType;
};
export interface Props {
    isDisabled?: boolean;
    isSmall?: boolean;
    isReducedSpacing?: boolean;
    pluginState: BlockTypeState;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    setBlockType: (type: string) => void;
}
export interface State {
    active: boolean;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

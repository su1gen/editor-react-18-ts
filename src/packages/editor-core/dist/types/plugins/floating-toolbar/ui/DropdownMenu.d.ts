/// <reference types="react" />
import { DropdownOptionT } from './types';
import { WrappedComponentProps } from 'react-intl-next';
export declare const menuItemDimensions: {
    width: number;
    height: number;
};
export declare const itemSpacing: number;
export interface Props {
    hide: Function;
    dispatchCommand: Function;
    items: Array<DropdownOptionT<Function>>;
    showSelected?: boolean;
}
declare const _default: import("react").FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: import("react").ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

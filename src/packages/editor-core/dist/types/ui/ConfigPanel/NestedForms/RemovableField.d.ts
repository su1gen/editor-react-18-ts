/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
declare const _default: React.FC<import("react-intl-next").WithIntlProps<{
    name: string;
    onClickRemove?: ((fieldName: string) => void) | undefined;
    canRemoveField?: boolean | undefined;
    children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
    className?: string | undefined;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        name: string;
        onClickRemove?: ((fieldName: string) => void) | undefined;
        canRemoveField?: boolean | undefined;
        children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
        className?: string | undefined;
    } & WrappedComponentProps<"intl">>;
};
export default _default;

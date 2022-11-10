/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
export interface Props {
    text?: string;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

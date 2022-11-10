/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { Modes } from '../types';
interface Props {
    onSearch: (value: string) => void;
    mode: keyof typeof Modes;
    focus: boolean;
    onClick: (e: React.MouseEvent) => void;
    searchTerm?: string;
}
declare const MemoizedElementSearchWithAnalytics: React.MemoExoticComponent<React.ForwardRefExoticComponent<Omit<Props & WrappedComponentProps<"intl">, "intl"> & {
    forwardedRef?: React.Ref<any> | undefined;
} & {
    children?: React.ReactNode;
} & import("@atlaskit/analytics-next").WithContextProps & React.RefAttributes<any>>>;
export default MemoizedElementSearchWithAnalytics;

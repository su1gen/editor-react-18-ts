/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { IntlShape } from 'react-intl-next';
interface ExpandIconButtonProps {
    allowInteractiveExpand: boolean;
    expanded: boolean;
    intl?: IntlShape;
}
interface ExpandIconButtonWithLabelProps extends ExpandIconButtonProps {
    label: string;
}
export declare const withTooltip: (WrapperComponent: React.ElementType) => {
    new (props: ExpandIconButtonWithLabelProps): {
        render(): jsx.JSX.Element;
        context: any;
        setState<K extends never>(state: {} | ((prevState: Readonly<{}>, props: Readonly<ExpandIconButtonWithLabelProps>) => {} | Pick<{}, K> | null) | Pick<{}, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<ExpandIconButtonWithLabelProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<{}>;
        refs: {
            [key: string]: React.ReactInstance;
        };
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<ExpandIconButtonWithLabelProps>, nextState: Readonly<{}>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<ExpandIconButtonWithLabelProps>, prevState: Readonly<{}>): any;
        componentDidUpdate?(prevProps: Readonly<ExpandIconButtonWithLabelProps>, prevState: Readonly<{}>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<ExpandIconButtonWithLabelProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<ExpandIconButtonWithLabelProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<ExpandIconButtonWithLabelProps>, nextState: Readonly<{}>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<ExpandIconButtonWithLabelProps>, nextState: Readonly<{}>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export declare const CustomButton: (props: ExpandIconButtonWithLabelProps) => jsx.JSX.Element;
export declare const ExpandIconButton: (props: ExpandIconButtonProps) => jsx.JSX.Element;
export {};

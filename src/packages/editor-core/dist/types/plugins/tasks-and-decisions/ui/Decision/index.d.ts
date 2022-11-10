import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
interface Props {
    contentRef: any;
    showPlaceholder?: boolean;
}
export declare class Decision extends React.Component<Props & WrappedComponentProps, {}> {
    static displayName: string;
    render(): JSX.Element;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

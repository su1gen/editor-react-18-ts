/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps } from 'react-intl-next';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
export declare const CONTAINER_WIDTH_IN_PX = 420;
export declare const MAX_ALT_TEXT_LENGTH = 510;
declare type Props = {
    view: EditorView;
    value?: string;
    altTextValidator?: (value: string) => string[];
} & WrappedComponentProps & WithAnalyticsEventsProps;
export declare type AltTextEditComponentState = {
    showClearTextButton: boolean;
    validationErrors: string[] | undefined;
    lastValue: string | undefined;
};
export declare class AltTextEditComponent extends React.Component<Props, AltTextEditComponentState> {
    private fireCustomAnalytics?;
    state: {
        showClearTextButton: boolean;
        validationErrors: string[];
        lastValue: string | undefined;
    };
    constructor(props: Props);
    prevValue: string | undefined;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private getValidationErrors;
    render(): jsx.JSX.Element;
    private closeMediaAltTextMenu;
    private fireAnalytics;
    private dispatchCancelEvent;
    private updateAltText;
    private handleOnChange;
    private handleOnBlur;
    private handleClearText;
}
declare const _default: React.ForwardRefExoticComponent<Omit<React.PropsWithChildren<import("react-intl-next").WithIntlProps<Props>>, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>>;
export default _default;

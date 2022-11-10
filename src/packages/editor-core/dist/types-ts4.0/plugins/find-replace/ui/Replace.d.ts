/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { TRIGGER_METHOD, DispatchAnalyticsEvent } from '../../analytics/types';
export declare type ReplaceProps = {
    canReplace: boolean;
    replaceText?: string;
    onReplace: ({ triggerMethod, replaceText, }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
        replaceText: string;
    }) => void;
    onReplaceAll: ({ replaceText }: {
        replaceText: string;
    }) => void;
    onReplaceTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
    onArrowUp: () => void;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
};
export declare type ReplaceState = {
    replaceText: string;
    isComposing: boolean;
};
declare const _default: React.FC<import("react-intl-next").WithIntlProps<ReplaceProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<ReplaceProps & WrappedComponentProps<"intl">>;
};
export default _default;

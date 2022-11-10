/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { DispatchAnalyticsEvent } from '../../../analytics';
import { DateType } from '../../types';
export interface InputProps {
    /** Locale code string (eg. "en-AU") */
    locale: string;
    date: DateType;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    onNewDate: (date: DateType) => void;
    onSubmitDate: (date: DateType | null) => void;
    onEmptySubmit: () => void;
    /** Automatically focus the text field */
    autoFocus?: boolean;
    /** Automatically select all text in the field. Requires autoFocus to be true. */
    autoSelectAll?: boolean;
}
export interface InputState {
    inputText: string;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<InputProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<InputProps & WrappedComponentProps<"intl">>;
};
export default _default;

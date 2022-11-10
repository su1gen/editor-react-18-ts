/** @jsx jsx */
import React from 'react';
import { DateType } from '../../types';
import { INPUT_METHOD } from '../../../analytics/types/enums';
import { DispatchAnalyticsEvent } from '../../../analytics';
import { WrappedComponentProps } from 'react-intl-next';
export interface Props {
    element: HTMLElement | null;
    closeDatePicker: () => void;
    /** Whether the date is newly created, selcting and focusing the input */
    isNew: boolean;
    /** Whether to automatically focus the input */
    autoFocus?: boolean;
    onSelect: (date: DateType | null, commitMethod: INPUT_METHOD.PICKER | INPUT_METHOD.KEYBOARD) => void;
    onDelete: () => void;
    mountTo?: HTMLElement;
    boundariesElement?: HTMLElement;
    scrollableElement?: HTMLElement;
    closeDatePickerWithAnalytics: ({ date }: {
        date?: DateType;
    }) => void;
    onTextChanged: (date: DateType) => void;
    showTextField?: boolean;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}
export interface State {
    date: DateType;
    selected: Array<string>;
    setInputSelectionPos?: number;
    latestValidDate: DateType;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

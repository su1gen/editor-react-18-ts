/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { FindReplaceProps } from './FindReplace';
import { DispatchAnalyticsEvent } from '../../analytics/types';
export interface FindReplaceToolbarButtonProps extends Omit<FindReplaceProps, 'count'> {
    index: number;
    numMatches: number;
    isActive: boolean;
    onActivate: () => void;
    isReducedSpacing?: boolean;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    takeFullWidth: boolean;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<FindReplaceToolbarButtonProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<FindReplaceToolbarButtonProps & WrappedComponentProps<"intl">>;
};
export default _default;

import React from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { EditorProps } from './internal/editor-props-type';
export interface MobileEditorProps extends EditorProps {
    isMaxContentSizeReached?: boolean;
    maxHeight?: number;
}
export declare function MobileEditor(props: MobileEditorProps & WithAnalyticsEventsProps): JSX.Element;
export declare namespace MobileEditor {
    var displayName: string;
}
export declare const Mobile: React.ForwardRefExoticComponent<Omit<MobileEditorProps & WithAnalyticsEventsProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>>;

import React from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { EditorProps } from '../../types';
import EditorActions from '../../actions';
export declare type FullPageProps = EditorProps & {
    onMount?: (actions: EditorActions) => void;
} & WithAnalyticsEventsProps;
declare const FullPageWithAnalytics: React.ForwardRefExoticComponent<Omit<FullPageProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>>;
export { FullPageWithAnalytics as FullPage };

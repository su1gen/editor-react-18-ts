import React from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';
import { Category } from '../types';
interface Props {
    categories?: Category[];
    onSelectCategory: (category: Category) => void;
    selectedCategory?: string;
}
declare const MemoizedCategoryListWithAnalytics: React.MemoExoticComponent<React.ForwardRefExoticComponent<Pick<Props & WithAnalyticsEventsProps & import("@atlaskit/analytics-next").WithContextProps, "createAnalyticsEvent" | "analyticsContext" | keyof Props> & React.RefAttributes<any>>>;
export default MemoizedCategoryListWithAnalytics;

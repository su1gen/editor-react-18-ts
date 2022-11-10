import { IntlShape } from 'react-intl-next';
export declare const transformTimeStamp: (intl: IntlShape, lastViewedDate?: Date | undefined, lastUpdatedDate?: Date | undefined) => {
    pageAction: string;
    dateString: string;
    timeSince?: undefined;
} | {
    pageAction: string;
    dateString: string;
    timeSince: string;
} | undefined;

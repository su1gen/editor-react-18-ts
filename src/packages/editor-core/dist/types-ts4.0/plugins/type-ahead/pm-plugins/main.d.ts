import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { IntlShape } from 'react-intl-next';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Dispatch } from '../../../event-dispatcher';
import type { PopupMountPointReference, TypeAheadHandler } from '../types';
declare type Props = {
    reactDispatch: Dispatch;
    popupMountRef: PopupMountPointReference;
    typeAheadHandlers: Array<TypeAheadHandler>;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    getIntl: () => IntlShape;
};
export declare function createPlugin({ reactDispatch, popupMountRef, createAnalyticsEvent, typeAheadHandlers, getIntl, }: Props): SafePlugin;
export {};

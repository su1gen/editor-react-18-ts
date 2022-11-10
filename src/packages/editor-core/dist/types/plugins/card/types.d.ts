import { INPUT_METHOD, ACTION } from '../analytics/types/enums';
import { CardProvider, CardAppearance, CardAdf } from '@atlaskit/editor-common/provider-factory';
import { SmartLinkEvents } from '@atlaskit/smart-card';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { CardOptions } from '@atlaskit/editor-common/card';
import { LinkPickerOptions } from '../hyperlink/types';
export declare type CardInfo = {
    title?: string;
    url?: string;
    pos: number;
};
export declare type Request = {
    pos: number;
    url: string;
    appearance: CardAppearance;
    compareLinkText: boolean;
    source: CardReplacementInputMethod;
    analyticsAction?: ACTION;
    shouldReplaceLink?: boolean;
};
export declare type OutstandingRequests = {
    [key: string]: Promise<void | CardAdf>;
};
export declare type CardPluginState = {
    requests: Request[];
    provider: CardProvider | null;
    cards: CardInfo[];
    showLinkingToolbar: boolean;
    smartLinkEvents?: SmartLinkEvents;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
};
export declare type CardPluginOptions = CardOptions & {
    platform: 'mobile' | 'web';
    fullWidthMode?: boolean;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    linkPicker?: LinkPickerOptions;
};
export declare type SetProvider = {
    type: 'SET_PROVIDER';
    provider: CardProvider | null;
};
export declare type Queue = {
    type: 'QUEUE';
    requests: Request[];
};
export declare type Resolve = {
    type: 'RESOLVE';
    url: string;
};
export declare type Register = {
    type: 'REGISTER';
    info: CardInfo;
};
export declare type ShowLinkToolbar = {
    type: 'SHOW_LINK_TOOLBAR';
};
export declare type HideLinkToolbar = {
    type: 'HIDE_LINK_TOOLBAR';
};
export declare type RegisterSmartCardEvents = {
    type: 'REGISTER_EVENTS';
    smartLinkEvents: SmartLinkEvents;
};
export declare type CardPluginAction = SetProvider | Queue | Resolve | Register | ShowLinkToolbar | HideLinkToolbar | RegisterSmartCardEvents;
export declare type CardReplacementInputMethod = INPUT_METHOD.CLIPBOARD | INPUT_METHOD.AUTO_DETECT | INPUT_METHOD.FORMATTING | INPUT_METHOD.MANUAL | INPUT_METHOD.TYPEAHEAD;

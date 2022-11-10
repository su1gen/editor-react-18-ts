import { ACTION, ACTION_SUBJECT, EVENT_TYPE, AnalyticsEventPayload, ACTION_SUBJECT_ID, INPUT_METHOD } from '../plugins/analytics';
export declare const buildEditLinkPayload: (type: LinkType) => AnalyticsEventPayload;
export declare type LinkType = ACTION_SUBJECT_ID.CARD_INLINE | ACTION_SUBJECT_ID.CARD_BLOCK | ACTION_SUBJECT_ID.EMBEDS | ACTION_SUBJECT_ID.HYPERLINK;
export declare const buildVisitedLinkPayload: (type: LinkType) => AnalyticsEventPayload;
export declare const buildOpenedSettingsPayload: (type: LinkType) => AnalyticsEventPayload;
export declare const unlinkPayload: (type: LinkType) => {
    action: ACTION;
    actionSubject: ACTION_SUBJECT;
    actionSubjectId: ACTION_SUBJECT_ID.CARD_INLINE | undefined;
    attributes: {
        inputMethod: INPUT_METHOD;
    };
    eventType: EVENT_TYPE;
};

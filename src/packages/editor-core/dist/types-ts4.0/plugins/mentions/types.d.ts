/// <reference types="react" />
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { MentionDescription, MentionProvider } from '@atlaskit/mention';
import { TeamMentionProvider } from '@atlaskit/mention/resource';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
export interface TeamInfoAttrAnalytics {
    teamId: String;
    includesYou: boolean;
    memberCount: number;
}
export interface MentionPluginConfig {
    HighlightComponent?: React.ComponentType;
    insertDisplayName?: boolean;
}
export interface MentionPluginOptions extends MentionPluginConfig {
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    sanitizePrivateContent?: boolean;
    allowZeroWidthSpaceAfter?: boolean;
}
export declare type MentionPluginState = {
    mentionProvider?: MentionProvider | TeamMentionProvider;
    contextIdentifierProvider?: ContextIdentifierProvider;
    mentions?: Array<MentionDescription>;
};
export declare type FireElementsChannelEvent = <T extends AnalyticsEventPayload>(payload: T) => void;

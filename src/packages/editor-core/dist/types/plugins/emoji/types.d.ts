import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import { EmojiProvider, EmojiDescription } from '@atlaskit/emoji';
export interface EmojiPluginOptions {
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
    headless?: boolean;
}
export declare type EmojiPluginState = {
    emojiProvider?: EmojiProvider;
    asciiMap?: Map<string, EmojiDescription>;
};

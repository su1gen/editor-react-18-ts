import { EditorState, ReadonlyTransaction } from 'prosemirror-state';
import { CardPluginState, Request } from '../../types';
export declare const getPluginState: (editorState: EditorState) => CardPluginState | undefined;
export declare const getPluginStateWithUpdatedPos: (pluginState: CardPluginState, tr: ReadonlyTransaction) => {
    requests: {
        pos: number;
        url: string;
        appearance: import("@atlaskit/editor-common/provider-factory").CardAppearance;
        compareLinkText: boolean;
        source: import("../../types").CardReplacementInputMethod;
        analyticsAction?: import("@atlaskit/editor-common/analytics").ACTION | undefined;
        shouldReplaceLink?: boolean | undefined;
    }[];
    cards: {
        pos: number;
        title?: string | undefined;
        url?: string | undefined;
    }[];
    provider: import("@atlaskit/editor-common/provider-factory").CardProvider | null;
    showLinkingToolbar: boolean;
    smartLinkEvents?: import("@atlaskit/smart-card").SmartLinkEvents | undefined;
    createAnalyticsEvent?: import("@atlaskit/analytics-next").CreateUIAnalyticsEvent | undefined;
};
export declare const getNewRequests: (oldState: CardPluginState | undefined, currentState: CardPluginState) => Request[];

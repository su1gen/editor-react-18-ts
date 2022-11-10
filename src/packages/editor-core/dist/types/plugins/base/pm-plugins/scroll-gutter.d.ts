import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView } from 'prosemirror-view';
export declare const GUTTER_SIZE_IN_PX = 120;
export declare const GUTTER_SIZE_MOBILE_IN_PX = 36;
export declare const GUTTER_SELECTOR = "#editor-scroll-gutter";
export declare type ScrollGutterPluginOptions = {
    /** Element the page uses for scrolling */
    getScrollElement?: (view: EditorView) => HTMLElement | null;
    /**
     * Whether to allow custom functionality to scroll to gutter element in
     * plugin's handleScrollToSelection function
     * Default is true
     */
    allowCustomScrollHandler?: boolean;
    /**
     * Persist scroll gutter when the mobile appearance is COMPACT
     * Default is false
     */
    persistScrollGutter?: boolean;
    gutterSize?: number;
};
declare const _default: (pluginOptions?: ScrollGutterPluginOptions) => SafePlugin<any, any> | undefined;
export default _default;

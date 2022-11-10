import { EditorPlugin } from '../../types';
import { ScrollGutterPluginOptions } from './pm-plugins/scroll-gutter';
import { InputTracking, BrowserFreezetracking } from '../../types/performance-tracking';
export interface BasePluginOptions {
    allowScrollGutter?: ScrollGutterPluginOptions;
    allowInlineCursorTarget?: boolean;
    inputTracking?: InputTracking;
    browserFreezeTracking?: BrowserFreezetracking;
    ufo?: boolean;
}
export declare const isChromeWithSelectionBug: any;
declare const basePlugin: (options?: BasePluginOptions | undefined) => EditorPlugin;
export default basePlugin;

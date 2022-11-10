import { EditorPlugin } from '../../types/editor-plugin';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
export declare type TypeAheadPluginOptions = {
    isMobile?: boolean;
    createAnalyticsEvent?: CreateUIAnalyticsEvent;
};
/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
declare const typeAheadPlugin: (options?: TypeAheadPluginOptions | undefined) => EditorPlugin;
export default typeAheadPlugin;
export { typeAheadPluginKey };
export type { TypeAheadHandler, TypeAheadPluginState } from './types';

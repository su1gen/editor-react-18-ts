import { EditorPlugin } from '../../types';
import { HyperlinkPluginOptions } from './types';
declare const hyperlinkPlugin: (options?: HyperlinkPluginOptions | undefined) => EditorPlugin;
export type { HyperlinkState } from './pm-plugins/main';
export default hyperlinkPlugin;

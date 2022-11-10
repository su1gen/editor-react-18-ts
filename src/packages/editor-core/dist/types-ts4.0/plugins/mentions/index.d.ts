import { EditorPlugin } from '../../types';
import { MentionPluginOptions } from './types';
import { mentionPluginKey } from './pm-plugins/key';
export { mentionPluginKey };
declare const mentionsPlugin: (options?: MentionPluginOptions | undefined) => EditorPlugin;
export default mentionsPlugin;

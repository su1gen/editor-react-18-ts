import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Dispatch } from '../../../event-dispatcher';
import { TextFormattingState } from '../types';
import { pluginKey } from './plugin-key';
export { pluginKey };
export type { TextFormattingState };
export declare const plugin: (dispatch: Dispatch) => SafePlugin<any, any>;

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Dispatch } from '../../../../event-dispatcher';
export declare const createPlugin: (dispatch: Dispatch) => SafePlugin<import("./types").FloatingToolbarPluginData, import("prosemirror-model").Schema<any, any>>;

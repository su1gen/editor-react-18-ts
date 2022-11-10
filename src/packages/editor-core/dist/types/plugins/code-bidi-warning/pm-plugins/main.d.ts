import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorProps, PMPluginFactoryParams } from '../../../types';
export declare const createPlugin: ({ dispatch, getIntl }: PMPluginFactoryParams, { appearance }: {
    appearance: EditorProps['appearance'];
}) => SafePlugin<import("./types").CodeBidiWarningPluginState, import("prosemirror-model").Schema<any, any>>;

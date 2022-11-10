import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { InlineCommentPluginState, InlineCommentPluginOptions } from './types';
export declare const inlineCommentPlugin: (options: InlineCommentPluginOptions) => SafePlugin<InlineCommentPluginState, import("prosemirror-model").Schema<any, any>>;

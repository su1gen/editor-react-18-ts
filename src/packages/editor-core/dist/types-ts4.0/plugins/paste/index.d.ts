import { EditorPlugin } from '../../types';
import { CardOptions } from '@atlaskit/editor-common/card';
export declare type PastePluginOptions = {
    plainTextPasteLinkification?: boolean;
    cardOptions?: CardOptions;
    sanitizePrivateContent?: boolean;
};
declare const pastePlugin: ({ cardOptions, sanitizePrivateContent, plainTextPasteLinkification, }: PastePluginOptions) => EditorPlugin;
export default pastePlugin;

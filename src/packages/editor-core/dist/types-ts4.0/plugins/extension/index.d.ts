import { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { EditorPlugin, EditorAppearance } from '../../types';
import { LongPressSelectionPluginOptions } from '../selection/types';
interface ExtensionPluginOptions extends LongPressSelectionPluginOptions {
    allowAutoSave?: boolean;
    breakoutEnabled?: boolean;
    extensionHandlers?: ExtensionHandlers;
    stickToolbarToBottom?: boolean;
    appearance?: EditorAppearance;
}
declare const extensionPlugin: (options?: ExtensionPluginOptions) => EditorPlugin;
export default extensionPlugin;

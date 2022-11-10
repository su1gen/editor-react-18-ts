import type { EditorAppearance } from '../../types';
import { LongPressSelectionPluginOptions } from '../selection/types';
export interface CodeBlockOptions extends LongPressSelectionPluginOptions {
    allowCopyToClipboard?: boolean;
    allowCompositionInputOverride?: boolean;
    appearance?: EditorAppearance | undefined;
}

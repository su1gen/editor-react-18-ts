import { IntlShape } from 'react-intl-next';
import { FloatingToolbarButton, FloatingToolbarCustom, FloatingToolbarConfig } from '../../floating-toolbar/types';
import { Command } from '../../../types';
import { MediaToolbarBaseConfig } from '../types';
import { EditorState } from 'prosemirror-state';
export declare const altTextButton: (intl: IntlShape, state: EditorState) => FloatingToolbarButton<Command>;
export declare const altTextEditComponent: (options?: AltTextToolbarOptions | undefined) => FloatingToolbarCustom<Command>;
export interface AltTextToolbarOptions {
    altTextValidator?: (value: string) => string[];
}
export declare const getAltTextToolbar: (toolbarBaseConfig: MediaToolbarBaseConfig, options?: AltTextToolbarOptions | undefined) => FloatingToolbarConfig;

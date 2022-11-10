import { EditorAppearance } from '../../types';
import { ToolbarSize } from './types';
export declare const toolbarSizeToWidth: (toolbarSize: ToolbarSize, appearance?: EditorAppearance | undefined) => number;
export declare const widthToToolbarSize: (toolbarWidth: number, appearance?: EditorAppearance | undefined) => ToolbarSize;

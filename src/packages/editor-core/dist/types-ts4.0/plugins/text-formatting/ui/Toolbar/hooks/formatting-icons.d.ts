import { EditorState } from 'prosemirror-state';
import { IconHookProps, MenuIconItem, IconTypes } from '../types';
export declare const useFormattingIcons: ({ isToolbarDisabled, editorState, intl, }: IconHookProps) => Array<MenuIconItem | null>;
declare type Props = {
    editorState: EditorState;
    iconTypeList: IconTypes[];
};
export declare const useHasFormattingActived: ({ editorState, iconTypeList, }: Props) => boolean;
export {};

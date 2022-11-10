/// <reference types="react" />
import { EditorView } from 'prosemirror-view';
import { LinkPickerProps } from '@atlaskit/link-picker';
export interface EditorLinkPickerProps extends Omit<LinkPickerProps, 'onCancel'> {
    view: EditorView;
}
export declare const EditorLinkPicker: ({ view, ...restProps }: EditorLinkPickerProps) => JSX.Element;

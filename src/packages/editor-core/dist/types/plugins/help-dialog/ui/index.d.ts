/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { Schema } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import * as keymaps from '../../../keymaps';
export interface Format {
    name: string;
    type: string;
    keymap?: Function;
    autoFormatting?: Function;
    imageEnabled?: boolean;
}
export declare const formatting: (intl: IntlShape) => Format[];
export declare const getSupportedFormatting: (schema: Schema, intl: IntlShape, imageEnabled?: boolean | undefined, quickInsertEnabled?: boolean | undefined) => Format[];
export declare const getComponentFromKeymap: (keymap: keymaps.Keymap) => jsx.JSX.Element;
export interface Props {
    editorView: EditorView;
    isVisible: boolean;
    imageEnabled?: boolean;
    quickInsertEnabled?: boolean;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
interface Props {
    editorView: EditorView;
    mountPoint?: HTMLElement;
    node: PMNode | null;
    boundariesElement?: HTMLElement;
    scrollableElement?: HTMLElement;
    handleClick?: Function;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

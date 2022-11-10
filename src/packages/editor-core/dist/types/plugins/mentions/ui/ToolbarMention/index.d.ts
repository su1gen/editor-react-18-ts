import React from 'react';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps } from 'react-intl-next';
export interface Props {
    editorView?: EditorView;
    isDisabled?: boolean;
    testId?: string;
}
export interface State {
    disabled: boolean;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

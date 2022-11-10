import React, { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps } from 'react-intl-next';
export interface Props {
    editorView?: EditorView;
    isDisabled?: boolean;
    isReducedSpacing?: boolean;
}
export interface State {
    disabled: boolean;
}
export declare class ToolbarDecision extends PureComponent<Props & WrappedComponentProps, State> {
    state: State;
    render(): JSX.Element;
    private handleInsertDecision;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

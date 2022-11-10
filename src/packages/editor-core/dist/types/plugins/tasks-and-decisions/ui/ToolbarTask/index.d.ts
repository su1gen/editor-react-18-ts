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
export declare class ToolbarTask extends PureComponent<Props & WrappedComponentProps, State> {
    state: State;
    render(): JSX.Element;
    private handleInsertTask;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

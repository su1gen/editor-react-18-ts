/** @jsx jsx */
import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import { WrappedComponentProps } from 'react-intl-next';
import { EditorView } from 'prosemirror-view';
import { HistoryPluginState } from '../../../history/types';
export interface Props {
    undoDisabled?: boolean;
    redoDisabled?: boolean;
    disabled?: boolean;
    isReducedSpacing?: boolean;
    historyState: HistoryPluginState;
    editorView: EditorView;
}
export declare class ToolbarUndoRedo extends PureComponent<Props & WrappedComponentProps> {
    render(): jsx.JSX.Element;
}
declare const _default: import("react").FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: import("react").ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

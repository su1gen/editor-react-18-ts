/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { WidthPluginState } from '../../plugins/width';
import { EditorView } from 'prosemirror-view';
import { BreakoutMarkAttrs } from '@atlaskit/adf-schema';
export declare type Props = {
    visible: boolean;
    children?: React.ReactElement;
};
declare type EditorWidth = WidthPluginState & {
    contentBreakoutModes: BreakoutMarkAttrs['mode'][];
};
export declare const shouldPanelBePositionedOverEditor: (editorWidth: EditorWidth, panelWidth: number) => boolean;
export declare const panel: import("@emotion/react").SerializedStyles;
export declare const content: import("@emotion/react").SerializedStyles;
declare type SwappableContentAreaProps = {
    pluginContent?: React.ReactNode;
    editorView?: EditorView;
    editorWidth?: EditorWidth;
} & Props;
declare type State = {
    mounted: boolean;
    currentPluginContent?: React.ReactNode;
};
export declare class SwappableContentArea extends React.PureComponent<SwappableContentAreaProps, State> {
    state: {
        mounted: boolean;
        currentPluginContent: undefined;
    };
    static getDerivedStateFromProps(props: SwappableContentAreaProps, state: State): State | null;
    private unsetPluginContent;
    componentDidMount(): void;
    showPluginContent: () => jsx.JSX.Element | undefined;
    showProvidedContent: (isVisible: boolean) => jsx.JSX.Element | undefined;
    render(): jsx.JSX.Element;
}
export default class ContextPanel extends React.Component<Props> {
    render(): jsx.JSX.Element;
}
export {};

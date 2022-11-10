import React from 'react';
import { EditorProps, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import type { PMPluginFactoryParams } from '../types';
export declare type InlineNodeViewComponentProps = {
    view: EditorView;
    getPos: NodeViewParams['getPos'];
    node: PMNode;
};
declare type InlineNodeViewComponent<ExtraComponentProps> = React.ComponentType<InlineNodeViewComponentProps & ExtraComponentProps>;
export declare const inlineNodeViewClassname = "inlineNodeView";
declare type NodeViewProducer = NonNullable<EditorProps['nodeViews']>[string];
declare type NodeViewParams = {
    node: Parameters<NodeViewProducer>[0];
    view: Parameters<NodeViewProducer>[1];
    getPos: Parameters<NodeViewProducer>[2];
    decorations: Parameters<NodeViewProducer>[3];
};
export declare function getInlineNodeViewProducer<ExtraComponentProps>({ pmPluginFactoryParams, Component, extraComponentProps, }: {
    pmPluginFactoryParams: PMPluginFactoryParams;
    Component: InlineNodeViewComponent<ExtraComponentProps>;
    extraComponentProps?: ExtraComponentProps;
}): NodeViewProducer;
export {};

import React from 'react';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { PanelType, PanelAttributes } from '@atlaskit/adf-schema';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { PanelPluginOptions } from '../types';
export declare const panelIcons: {
    [key in PanelType]: React.ComponentType<{
        label: string;
    }>;
};
interface PanelIconAttributes {
    panelAttributes: PanelAttributes;
    providerFactory?: ProviderFactory;
    allowCustomPanel?: boolean;
}
export declare const PanelIcon: React.FC<PanelIconAttributes>;
declare class PanelNodeView {
    node: Node;
    dom: HTMLElement;
    contentDOM: HTMLElement;
    icon: HTMLElement;
    getPos: getPosHandlerNode;
    view: EditorView;
    providerFactory?: ProviderFactory;
    pluginOptions: PanelPluginOptions;
    constructor(node: Node, view: EditorView, getPos: getPosHandlerNode, pluginOptions: PanelPluginOptions, providerFactory?: ProviderFactory);
    ignoreMutation(mutation: MutationRecord | {
        type: 'selection';
        target: Element;
    }): boolean;
}
export declare const getPanelNodeView: (pluginOptions: PanelPluginOptions, providerFactory?: ProviderFactory | undefined) => (node: any, view: EditorView, getPos: getPosHandler) => PanelNodeView;
export {};

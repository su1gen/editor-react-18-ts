import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { LinkPickerOptions } from '../../hyperlink/types';
import { Command } from '../../../types';
import { FloatingToolbarItem, FloatingToolbarConfig } from '../../floating-toolbar/types';
export declare type EditLinkToolbarProps = {
    view: EditorView;
    providerFactory: ProviderFactory;
    url: string | undefined;
    text: string;
    node: Node;
    onSubmit?: (href: string, text?: string) => void;
    linkPickerOptions?: LinkPickerOptions;
};
export declare class EditLinkToolbar extends React.Component<EditLinkToolbarProps> {
    componentDidUpdate(prevProps: EditLinkToolbarProps): void;
    componentWillUnmount(): void;
    private hideLinkToolbar;
    render(): JSX.Element;
}
export declare const editLink: Command;
export declare const buildEditLinkToolbar: ({ providerFactory, node, linkPicker, }: {
    providerFactory: ProviderFactory;
    node: Node;
    linkPicker?: LinkPickerOptions | undefined;
}) => FloatingToolbarItem<Command>;
export declare const editLinkToolbarConfig: Partial<FloatingToolbarConfig>;

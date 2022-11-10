/** @jsx jsx */
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { DispatchAnalyticsEvent } from '../../analytics';
import { FloatingToolbarItem } from '../types';
import { WrappedComponentProps } from 'react-intl-next';
export declare type Item = FloatingToolbarItem<Function>;
export interface Props {
    items: Array<Item>;
    dispatchCommand: (command?: Function) => void;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    providerFactory?: ProviderFactory;
    className?: string;
    focusEditor?: () => void;
    editorView?: EditorView;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    target?: HTMLElement;
    node: Node;
    extensionsProvider?: ExtensionProvider;
    scrollable?: boolean;
}
export declare const isSameItem: (leftItem: Item, rightItem: Item) => boolean;
export declare const areSameItems: (leftArr?: Item[] | undefined, rightArr?: Item[] | undefined) => boolean;
export interface State {
    scrollDisabled: boolean;
    mounted: boolean;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

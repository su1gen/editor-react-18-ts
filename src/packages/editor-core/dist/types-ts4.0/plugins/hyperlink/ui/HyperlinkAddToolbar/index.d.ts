import React from 'react';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { LinkInputType, LinkPickerOptions } from '../../types';
export interface Props {
    view: EditorView;
    providerFactory: ProviderFactory;
    onSubmit: (href: string, title: string | undefined, displayText: string | undefined, inputMethod: LinkInputType) => void;
    linkPickerOptions?: LinkPickerOptions;
    displayText?: string;
    displayUrl?: string;
}
export default class HyperlinkAddToolbar extends React.PureComponent<Props> {
    render(): JSX.Element;
}

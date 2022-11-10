import { PureComponent } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { MentionEventHandlers } from '@atlaskit/editor-common/ui';
export interface MentionProps {
    id: string;
    providers?: ProviderFactory;
    eventHandlers?: MentionEventHandlers;
    text: string;
    accessLevel?: string;
}
export default class Mention extends PureComponent<MentionProps, {}> {
    static displayName: string;
    private providerFactory;
    constructor(props: MentionProps);
    componentWillUnmount(): void;
    private renderWithProvider;
    render(): JSX.Element;
}

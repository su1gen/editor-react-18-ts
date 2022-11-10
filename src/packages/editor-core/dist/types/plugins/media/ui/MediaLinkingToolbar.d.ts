/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { IntlShape, WrappedComponentProps } from 'react-intl-next';
import { RecentSearchInputTypes } from '../../../ui/LinkSearch/types';
export declare type Props = {
    intl: IntlShape;
    providerFactory: ProviderFactory;
    editing: boolean;
    onBack: (url: string, meta: {
        inputMethod?: RecentSearchInputTypes;
    }) => void;
    onUnlink: () => void;
    onCancel: () => void;
    onBlur: (href: string) => void;
    onSubmit: (href: string, meta: {
        inputMethod: RecentSearchInputTypes;
    }) => void;
    displayUrl?: string;
};
export declare class LinkAddToolbar extends React.PureComponent<Props & WrappedComponentProps> {
    state: {
        validationErrors: never[];
    };
    private handleSubmit;
    private handleOnBack;
    private handleCancel;
    private handleUnlink;
    private handleOnBlur;
    private getValidationErrors;
    private renderContainer;
    render(): jsx.JSX.Element;
}
export default LinkAddToolbar;

/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import { EmptyStateHandler } from '../../types/empty-state-handler';
export interface State {
    isOpen: boolean;
}
export interface Props {
    getItems: (query?: string, category?: string) => QuickInsertItem[];
    onInsertItem: (item: QuickInsertItem) => void;
    isOpen?: boolean;
    onClose: () => void;
    helpUrl?: string | undefined;
    emptyStateHandler?: EmptyStateHandler;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { MessageDescriptor } from '../../../../types/i18n';
export interface BlockTypeButtonProps {
    isSmall?: boolean;
    isReducedSpacing?: boolean;
    'aria-expanded': React.AriaAttributes['aria-expanded'];
    selected: boolean;
    disabled: boolean;
    title: MessageDescriptor;
    onClick(e: React.MouseEvent): void;
    formatMessage: WrappedComponentProps['intl']['formatMessage'];
}
export declare const messages: {
    textStyles: {
        id: string;
        defaultMessage: string;
        description: string;
    };
};
export declare const BlockTypeButton: React.StatelessComponent<BlockTypeButtonProps>;

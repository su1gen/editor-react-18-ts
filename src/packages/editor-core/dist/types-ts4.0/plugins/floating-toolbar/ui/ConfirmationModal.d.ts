import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { ConfirmDialogOptions } from '../types';
declare type ConfirmationDialogProps = {
    onConfirm: () => void;
    onClose: () => void;
    options?: ConfirmDialogOptions;
    testId?: string;
};
export declare const ConfirmationModal: React.FC<import("react-intl-next").WithIntlProps<ConfirmationDialogProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<ConfirmationDialogProps & WrappedComponentProps<"intl">>;
};
export {};

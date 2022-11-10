import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { DateField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
declare const _default: React.FC<import("react-intl-next").WithIntlProps<{
    name: string;
    field: DateField;
    autoFocus?: boolean | undefined;
    onFieldChange: OnFieldChange;
    placeholder?: string | undefined;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        name: string;
        field: DateField;
        autoFocus?: boolean | undefined;
        onFieldChange: OnFieldChange;
        placeholder?: string | undefined;
    } & WrappedComponentProps<"intl">>;
};
export default _default;

import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { CustomField, ExtensionManifest, Parameters } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
declare const _default: React.FC<import("react-intl-next").WithIntlProps<{
    name: string;
    field: CustomField;
    extensionManifest: ExtensionManifest<Parameters>;
    onFieldChange: OnFieldChange;
    autoFocus?: boolean | undefined;
    placeholder?: string | undefined;
    parameters?: Parameters | undefined;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        name: string;
        field: CustomField;
        extensionManifest: ExtensionManifest<Parameters>;
        onFieldChange: OnFieldChange;
        autoFocus?: boolean | undefined;
        placeholder?: string | undefined;
        parameters?: Parameters | undefined;
    } & WrappedComponentProps<"intl">>;
};
export default _default;

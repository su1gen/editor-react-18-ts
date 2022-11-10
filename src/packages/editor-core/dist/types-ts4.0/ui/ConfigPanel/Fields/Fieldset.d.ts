/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import type { ExtensionManifest } from '@atlaskit/editor-common/extensions';
import { Fieldset, Parameters } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
declare type Props = {
    name: string;
    extensionManifest: ExtensionManifest;
    field: Fieldset;
    parameters?: Parameters;
    onFieldChange: OnFieldChange;
    firstVisibleFieldName?: string;
    error?: string;
} & WrappedComponentProps;
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props>> & {
    WrappedComponent: React.ComponentType<Props>;
};
export default _default;

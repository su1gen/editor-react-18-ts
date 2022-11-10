/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
export declare const expandContainer: import("@emotion/react").SerializedStyles;
export declare const expandControl: import("@emotion/react").SerializedStyles;
declare const _default: React.FC<import("react-intl-next").WithIntlProps<{
    field: FieldDefinition;
    children: React.ReactNode;
    isExpanded?: boolean | undefined;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        field: FieldDefinition;
        children: React.ReactNode;
        isExpanded?: boolean | undefined;
    } & WrappedComponentProps<"intl">>;
};
export default _default;

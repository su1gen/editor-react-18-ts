/// <reference types="@emotion/core" />
/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { TabGroupField, TabField } from '@atlaskit/editor-common/extensions';
declare const TabGroup: React.FC<import("react-intl-next").WithIntlProps<{
    field: TabGroupField;
    renderPanel: (tabField: TabField) => JSX.Element;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        field: TabGroupField;
        renderPanel: (tabField: TabField) => JSX.Element;
    } & WrappedComponentProps<"intl">>;
};
export default TabGroup;

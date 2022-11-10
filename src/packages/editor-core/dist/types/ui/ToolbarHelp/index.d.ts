import React from 'react';
import { PositionType } from '@atlaskit/tooltip/types';
import { WrappedComponentProps } from 'react-intl-next';
interface Props {
    title?: string;
    titlePosition?: PositionType;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

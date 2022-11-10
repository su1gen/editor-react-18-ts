/// <reference types="react" />
import { WrappedComponentProps } from 'react-intl-next';
import { DateRangeField } from '@atlaskit/editor-common/extensions';
import { OnFieldChange } from '../types';
declare const _default: import("react").FC<import("react-intl-next").WithIntlProps<{
    name: string;
    field: DateRangeField;
    onFieldChange: OnFieldChange;
    autoFocus?: boolean | undefined;
    placeholder?: string | undefined;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: import("react").ComponentType<{
        name: string;
        field: DateRangeField;
        onFieldChange: OnFieldChange;
        autoFocus?: boolean | undefined;
        placeholder?: string | undefined;
    } & WrappedComponentProps<"intl">>;
};
export default _default;

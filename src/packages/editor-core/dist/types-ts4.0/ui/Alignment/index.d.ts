/// <reference types="react" />
import { WrappedComponentProps } from 'react-intl-next';
import { AlignmentState } from '../../plugins/alignment/pm-plugins/types';
export interface Props {
    selectedAlignment?: string;
    onClick: (value: AlignmentState) => void;
    className?: string;
}
declare const _default: import("react").FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: import("react").ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

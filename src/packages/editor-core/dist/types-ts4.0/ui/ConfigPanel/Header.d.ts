/// <reference types="react" />
import { WrappedComponentProps } from 'react-intl-next';
import { Icon } from '@atlaskit/editor-common/extensions';
declare const _default: import("react").FC<import("react-intl-next").WithIntlProps<{
    title: string;
    description?: string | undefined;
    summary?: string | undefined;
    documentationUrl?: string | undefined;
    icon: Icon;
    onClose: () => void;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: import("react").ComponentType<{
        title: string;
        description?: string | undefined;
        summary?: string | undefined;
        documentationUrl?: string | undefined;
        icon: Icon;
        onClose: () => void;
    } & WrappedComponentProps<"intl">>;
};
export default _default;

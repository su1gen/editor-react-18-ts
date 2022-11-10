/** @jsx jsx */
import React from 'react';
import { LinkSearchListItemData } from './types';
import { WrappedComponentProps } from 'react-intl-next';
export declare const container: import("@emotion/react").SerializedStyles;
export declare const containerSelected: import("@emotion/react").SerializedStyles;
export declare const nameStyle: import("@emotion/react").SerializedStyles;
export declare const containerName: import("@emotion/react").SerializedStyles;
export interface Props {
    item: LinkSearchListItemData;
    selected: boolean;
    onSelect: (href: string, text: string) => void;
    onMouseMove?: (objectId: string) => void;
    onMouseEnter?: (objectId: string) => void;
    onMouseLeave?: (objectId: string) => void;
    id?: string;
    role?: string;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

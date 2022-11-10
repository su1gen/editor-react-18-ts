import { MentionDescription } from '@atlaskit/mention/resource';
import { UserRole } from '@atlaskit/mention';
import React, { SyntheticEvent } from 'react';
import { WrappedComponentProps } from 'react-intl-next';
export interface OnMentionEvent {
    (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}
export declare const INVITE_ITEM_MIN_HEIGHT: number;
export declare const INVITE_ITEM_DESCRIPTION: {
    id: string;
};
export interface Props {
    productName?: string;
    onMount?: () => void;
    onMouseEnter?: OnMentionEvent;
    onSelection?: OnMentionEvent;
    selected?: boolean;
    userRole?: UserRole;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

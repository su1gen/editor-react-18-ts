/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { LinkSearchListItemData } from './types';
export declare const linkSearchList: import("@emotion/react").SerializedStyles;
export interface Props {
    items?: LinkSearchListItemData[];
    isLoading: boolean;
    selectedIndex: number;
    onSelect: (href: string, text: string) => void;
    onMouseMove?: (objectId: string) => void;
    onMouseEnter?: (objectId: string) => void;
    onMouseLeave?: (objectId: string) => void;
    ariaControls?: string;
    role?: string;
    id?: string;
}
export default class LinkSearchList extends PureComponent<Props, {}> {
    render(): jsx.JSX.Element;
}

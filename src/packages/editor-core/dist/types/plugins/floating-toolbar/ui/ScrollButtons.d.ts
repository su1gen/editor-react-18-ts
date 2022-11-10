/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { Node } from 'prosemirror-model';
import { IntlShape } from 'react-intl-next';
export interface Props {
    intl: IntlShape;
    scrollContainerRef: React.RefObject<HTMLDivElement>;
    node: Node;
    disabled: boolean;
}
declare const _default: ({ intl, scrollContainerRef, node, disabled }: Props) => jsx.JSX.Element | null;
export default _default;

/** @jsx jsx */
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { IntlShape } from 'react-intl-next';
import { Color, StatusStyle } from '@atlaskit/status/element';
import { EventDispatcher } from '../../../event-dispatcher';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';
import { StatusPluginOptions } from '../types';
export interface ContainerProps {
    view: EditorView;
    intl: IntlShape;
    text?: string;
    color: Color;
    style?: StatusStyle;
    localId?: string;
    eventDispatcher?: EventDispatcher;
}
export declare const IntlStatusContainerView: React.FC<import("react-intl-next").WithIntlProps<ContainerProps>> & {
    WrappedComponent: React.ComponentType<ContainerProps>;
};
export declare type Props = InlineNodeViewComponentProps & {
    options: StatusPluginOptions | undefined;
};
export declare const StatusNodeView: React.FC<Props>;

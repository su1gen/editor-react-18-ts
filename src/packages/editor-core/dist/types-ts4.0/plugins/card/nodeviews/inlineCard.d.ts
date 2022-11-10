import React from 'react';
import PropTypes from 'prop-types';
import { SmartCardProps } from './genericCard';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';
export declare class InlineCardComponent extends React.PureComponent<SmartCardProps> {
    private scrollContainer?;
    private onClick;
    static contextTypes: {
        contextAdapter: PropTypes.Requireable<object>;
    };
    UNSAFE_componentWillMount(): void;
    onResolve: (data: {
        url?: string | undefined;
        title?: string | undefined;
    }) => void;
    onError: (data: {
        url?: string | undefined;
    }) => void;
    render(): JSX.Element | null;
}
export declare type InlineCardNodeViewProps = Pick<SmartCardProps, 'useAlternativePreloader'>;
export declare function InlineCardNodeView(props: InlineNodeViewComponentProps & InlineCardNodeViewProps): JSX.Element;

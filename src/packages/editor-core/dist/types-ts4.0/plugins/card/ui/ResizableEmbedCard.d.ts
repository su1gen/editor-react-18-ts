/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import { Props as ResizerProps } from '../../../ui/Resizer/types';
declare type State = {
    offsetLeft: number;
    resizedPctWidth?: number;
};
export declare type Props = Omit<ResizerProps, 'height' | 'width'> & {
    width?: number;
    height?: number;
    aspectRatio: number;
};
export default class ResizableEmbedCard extends React.Component<Props, State> {
    static defaultProps: {
        aspectRatio: number;
    };
    state: State;
    componentDidUpdate(): void;
    get wrappedLayout(): boolean;
    UNSAFE_componentWillReceiveProps(nextProps: Props): void;
    /**
     * When returning to center layout from a wrapped/aligned layout, it might actually
     * be wide or full-width
     */
    checkLayout(oldLayout: RichMediaLayout, newLayout: RichMediaLayout): void;
    calcNewSize: (newWidth: number, stop: boolean) => {
        width: number | null;
        layout: RichMediaLayout;
    };
    calcUnwrappedLayout: (pct: number, width: number) => 'center' | 'wide' | 'full-width';
    get $pos(): import("prosemirror-model").ResolvedPos<any> | null;
    /**
     * The maxmimum number of grid columns this node can resize to.
     */
    get gridWidth(): number;
    calcOffsetLeft(): number;
    calcColumnLeftOffset: () => number;
    wrapper?: HTMLElement;
    get wideLayoutWidth(): number;
    calcSnapPoints(): number[];
    calcPxWidth: (useLayout?: RichMediaLayout | undefined) => number;
    get insideInlineLike(): boolean;
    highlights: (newWidth: number, snapPoints: number[]) => string[] | number[];
    /**
     * Previously height of the box was controlled with paddingTop/paddingBottom trick inside Wrapper.
     * It allowed height to be defined by a given percent ratio and so absolute value was defined by actual width.
     * Also, it was part of styled component, which was fine because it was static through out life time of component.
     *
     * Now, two things changed:
     * 1. If `height` is present we take it as actual height of the box, and hence we don't need
     * (or even can't have, due to lack of width value) paddingTop trick.
     * 2. Since `height` can be changing through out life time of a component, we can't have it as part of styled component,
     * and hence we use `style` prop.
     */
    private getHeightDefiningComponent;
    render(): jsx.JSX.Element;
}
export {};

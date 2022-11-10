import React from 'react';
import { RefObject } from 'react';
import { Resizable } from 're-resizable';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import { Props as ResizableMediaSingleProps, EnabledHandles } from './types';
import { DispatchAnalyticsEvent } from '../../plugins/analytics';
export interface ResizableNumberSize {
    width: number;
    height: number;
}
export declare type ResizerProps = Omit<ResizableMediaSingleProps, 'height' | 'width'> & {
    selected?: boolean;
    enable: EnabledHandles;
    calcNewSize: (newWidth: number, stop: boolean) => {
        layout: RichMediaLayout;
        width: number | null;
    };
    snapPoints: number[];
    scaleFactor?: number;
    highlights: (width: number, snapPoints: number[]) => number[] | string[];
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    nodeType?: 'media' | 'embed';
    innerPadding?: number;
    height?: number;
    width: number;
    ratio?: string;
    handleComponentFunc?: (side: string) => React.ReactElement<any> | undefined;
};
export declare type ResizerState = {
    isResizing: boolean;
};
export default class Resizer extends React.Component<ResizerProps, ResizerState> {
    resizable: RefObject<Resizable>;
    state: {
        isResizing: boolean;
    };
    private handleResizeStart;
    private handleResize;
    private handleResizeStop;
    render(): JSX.Element;
}

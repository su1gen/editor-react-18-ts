/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { NumericalCardDimensions } from '@atlaskit/media-card';
export declare const MediaInlineNodeSelector = "media-inline-node";
export declare const MediaSingleNodeSelector = "media-single-node";
export declare const figureWrapper: import("@emotion/react").SerializedStyles;
declare type MediaCardWrapperProps = {
    dimensions: NumericalCardDimensions;
    children: React.ReactNode;
    onContextMenu?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};
export declare const MediaCardWrapper: ({ dimensions, children, onContextMenu, }: MediaCardWrapperProps) => jsx.JSX.Element;
export {};

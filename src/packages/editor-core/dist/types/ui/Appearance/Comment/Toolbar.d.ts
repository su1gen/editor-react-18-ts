/** @jsx jsx */
import React, { RefObject } from 'react';
export declare const TableControlsPadding = 20;
declare type MainToolbarProps = {
    useStickyToolbar?: boolean | RefObject<HTMLElement>;
};
export declare const MainToolbar: React.FC<MainToolbarProps>;
export declare const mainToolbarCustomComponentsSlotStyle: import("@emotion/react").SerializedStyles;
export {};

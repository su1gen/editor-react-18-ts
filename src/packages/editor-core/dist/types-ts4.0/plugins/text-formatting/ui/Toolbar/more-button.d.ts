/** @jsx jsx */
import React from 'react';
declare type MoreButtonProps = {
    label: string;
    isReducedSpacing: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    'aria-expanded': React.AriaAttributes['aria-expanded'];
    onClick?: () => void;
};
export declare const MoreButton: React.FC<MoreButtonProps>;
export {};

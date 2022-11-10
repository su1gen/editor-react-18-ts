import React from 'react';
import type { LinkContentType } from '@atlaskit/editor-common/provider-factory';
export declare const mapContentTypeToIcon: {
    [key in LinkContentType]?: React.ReactElement;
};
export declare const sha1: (input: string) => string;
export declare const wordCount: (input: string) => number;

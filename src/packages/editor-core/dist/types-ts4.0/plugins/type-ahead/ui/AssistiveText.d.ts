/// <reference types="lodash" />
/** @jsx jsx */
import debounce from 'lodash/debounce';
import React from 'react';
import { jsx } from '@emotion/react';
declare type Cancelable = ReturnType<typeof debounce>;
declare type AssistiveTextProps = {
    assistiveText: string;
    isInFocus: boolean;
    id: string;
    statusDebounceMillis?: number;
    debounce?: boolean;
};
declare type AssistiveTextState = {
    bump: boolean;
    debounced: boolean;
    silenced: boolean;
};
declare class AssistveTextComponent extends React.Component<AssistiveTextProps, AssistiveTextState> {
    static defaultProps: AssistiveTextProps;
    debounceStatusUpdate: (() => void) & Cancelable;
    state: {
        bump: boolean;
        debounced: boolean;
        silenced: boolean;
    };
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(): void;
    render(): jsx.JSX.Element;
}
export declare const AssistiveText: typeof AssistveTextComponent;
export {};

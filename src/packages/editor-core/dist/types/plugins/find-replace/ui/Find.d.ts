/** @jsx jsx */
import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { TRIGGER_METHOD } from '../../analytics/types';
import { MatchCaseProps } from '../types';
export declare type FindProps = {
    findText?: string;
    count: {
        index: number;
        total: number;
    };
    shouldFocus: boolean;
    onFindBlur: () => void;
    onFind: (findText?: string) => void;
    onFindNext: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
    }) => void;
    onFindPrev: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
    }) => void;
    onFindTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
    onCancel: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.BUTTON;
    }) => void;
    onArrowDown: () => void;
} & MatchCaseProps;
declare const _default: React.FC<import("react-intl-next").WithIntlProps<{
    findText?: string | undefined;
    count: {
        index: number;
        total: number;
    };
    shouldFocus: boolean;
    onFindBlur: () => void;
    onFind: (findText?: string | undefined) => void;
    onFindNext: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.BUTTON | TRIGGER_METHOD.KEYBOARD;
    }) => void;
    onFindPrev: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.BUTTON | TRIGGER_METHOD.KEYBOARD;
    }) => void;
    onFindTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
    onCancel: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.BUTTON | TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR;
    }) => void;
    onArrowDown: () => void;
} & MatchCaseProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        findText?: string | undefined;
        count: {
            index: number;
            total: number;
        };
        shouldFocus: boolean;
        onFindBlur: () => void;
        onFind: (findText?: string | undefined) => void;
        onFindNext: ({ triggerMethod, }: {
            triggerMethod: TRIGGER_METHOD.BUTTON | TRIGGER_METHOD.KEYBOARD;
        }) => void;
        onFindPrev: ({ triggerMethod, }: {
            triggerMethod: TRIGGER_METHOD.BUTTON | TRIGGER_METHOD.KEYBOARD;
        }) => void;
        onFindTextfieldRefSet: (ref: React.RefObject<HTMLInputElement>) => void;
        onCancel: ({ triggerMethod, }: {
            triggerMethod: TRIGGER_METHOD.BUTTON | TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR;
        }) => void;
        onArrowDown: () => void;
    } & MatchCaseProps & WrappedComponentProps<"intl">>;
};
export default _default;

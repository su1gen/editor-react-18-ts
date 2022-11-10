/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { TRIGGER_METHOD, DispatchAnalyticsEvent } from '../../analytics/types';
import { MatchCaseProps } from '../types';
export declare type FindReplaceProps = {
    findText?: string;
    replaceText?: string;
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
    onReplace: ({ triggerMethod, replaceText, }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.BUTTON;
        replaceText: string;
    }) => void;
    onReplaceAll: ({ replaceText }: {
        replaceText: string;
    }) => void;
    onCancel: ({ triggerMethod, }: {
        triggerMethod: TRIGGER_METHOD.KEYBOARD | TRIGGER_METHOD.TOOLBAR | TRIGGER_METHOD.BUTTON;
    }) => void;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
} & MatchCaseProps;
declare class FindReplace extends React.PureComponent<FindReplaceProps> {
    private findTextfield;
    private replaceTextfield?;
    setFindTextfieldRef: (findTextfieldRef: React.RefObject<HTMLInputElement>) => void;
    setReplaceTextfieldRef: (replaceTextfieldRef: React.RefObject<HTMLInputElement>) => void;
    setFocusToFind: () => void;
    setFocusToReplace: () => void;
    render(): jsx.JSX.Element;
}
export default FindReplace;

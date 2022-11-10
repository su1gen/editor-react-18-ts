import React from 'react';
import { DispatchAnalyticsEvent } from '../../plugins/analytics/types';
import { ACTION, ErrorEventPayload } from '../../plugins/analytics';
declare type ErrorCrashPayload = Extract<ErrorEventPayload, {
    action: ACTION.EDITOR_CRASHED;
}>;
interface ErrorBoundaryProps {
    component: ErrorCrashPayload['actionSubject'];
    componentId?: ErrorCrashPayload['actionSubjectId'];
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    fallbackComponent?: React.ReactNode;
}
interface ErrorBoundaryState {
    errorCaptured: boolean;
}
export declare class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: {
        errorCaptured: boolean;
    };
    hasFallback(): boolean;
    shouldRecover(): boolean;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    render(): React.ReactNode;
}
export {};

import { ACTION_SUBJECT, ACTION, FireAnalyticsCallback } from '../../../plugins/analytics';
declare type RenderActions = ACTION.RE_RENDERED;
declare type RenderActionSubjects = ACTION_SUBJECT.EDITOR | ACTION_SUBJECT.REACT_EDITOR_VIEW;
export declare type RenderTrackingProps<ComponentProps> = {
    componentProps: ComponentProps;
    action: RenderActions;
    actionSubject: RenderActionSubjects;
    handleAnalyticsEvent: FireAnalyticsCallback;
    propsToIgnore?: Array<keyof ComponentProps>;
    useShallow?: boolean;
};
export declare function RenderTracking<Props>(props: RenderTrackingProps<Props>): null;
export {};

import React, { PureComponent, ReactElement } from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ContentRef } from '@atlaskit/task-decision';
export interface TaskProps {
    taskId: string;
    isDone: boolean;
    contentRef?: ContentRef;
    onChange?: (taskId: string, isChecked: boolean) => void;
    showPlaceholder?: boolean;
    children?: ReactElement<any>;
    providers?: ProviderFactory;
    disabled?: boolean;
}
export declare class TaskItem extends PureComponent<TaskProps & WrappedComponentProps, {}> {
    static displayName: string;
    private providerFactory;
    constructor(props: TaskProps & WrappedComponentProps);
    componentWillUnmount(): void;
    private renderWithProvider;
    render(): JSX.Element;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<TaskProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<TaskProps & WrappedComponentProps<"intl">>;
};
export default _default;

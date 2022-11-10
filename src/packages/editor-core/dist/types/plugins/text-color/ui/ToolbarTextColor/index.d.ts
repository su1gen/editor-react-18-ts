/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps } from 'react-intl-next';
import { DispatchAnalyticsEvent } from '../../../analytics';
import { TextColorPluginState } from '../../pm-plugins/main';
export declare const messages: {
    textColor: {
        id: string;
        defaultMessage: string;
        description: string;
    };
};
export interface State {
    isOpen: boolean;
}
export interface Props {
    pluginState: TextColorPluginState;
    editorView: EditorView;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    isReducedSpacing?: boolean;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    disabled?: boolean;
}
export declare class ToolbarTextColor extends React.Component<Props & WrappedComponentProps, State> {
    state: State;
    changeColor: (color: string) => boolean;
    render(): jsx.JSX.Element;
    private changeTextColor;
    private toggleOpen;
    private handleOpenChange;
    private hide;
    private getCommonAnalyticsAttributes;
    private buildAnalyticsPalette;
    private buildAnalyticsSelectColor;
    private dispatchAnalyticsEvent;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { WrappedComponentProps } from 'react-intl-next';
import { AlignmentPluginState, AlignmentState } from '../../pm-plugins/types';
export interface State {
    isOpen: boolean;
}
export interface Props {
    pluginState: AlignmentPluginState;
    changeAlignment: (align: AlignmentState) => void;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    isReducedSpacing?: boolean;
    disabled?: boolean;
}
export declare class AlignmentToolbar extends React.Component<Props & WrappedComponentProps, State> {
    static displayName: string;
    state: State;
    render(): jsx.JSX.Element;
    private changeAlignment;
    private toggleOpen;
    private handleOpenChange;
    private hide;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

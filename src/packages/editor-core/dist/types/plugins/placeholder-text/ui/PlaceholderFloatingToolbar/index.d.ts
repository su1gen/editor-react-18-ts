import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { Coordinates } from '../../../../ui/FloatingToolbar';
export declare const messages: {
    placeholderTextPlaceholder: {
        id: string;
        defaultMessage: string;
        description: string;
    };
};
export interface Props {
    getNodeFromPos: (pos: number) => Node;
    getFixedCoordinatesFromPos: (pos: number) => Coordinates;
    insertPlaceholder: (value: string) => void;
    hidePlaceholderFloatingToolbar: () => void;
    setFocusInEditor: () => void;
    showInsertPanelAt: number;
    editorViewDOM: HTMLElement;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props & WrappedComponentProps<"intl">>;
};
export default _default;

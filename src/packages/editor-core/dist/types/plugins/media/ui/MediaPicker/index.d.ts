import React from 'react';
import { MediaPluginState } from '../../pm-plugins/types';
import { EditorAppearance } from '../../../../types/editor-appearance';
declare type Props = {
    mediaState: MediaPluginState;
    editorDomElement: Element;
    appearance: EditorAppearance;
};
declare type State = {
    isPopupOpened: boolean;
};
export declare class MediaPickerComponents extends React.Component<Props, State> {
    static displayName: string;
    state: {
        isPopupOpened: boolean;
    };
    componentDidMount(): void;
    onBrowseFn: (nativeBrowseFn: () => void) => void;
    render(): JSX.Element;
}
export {};

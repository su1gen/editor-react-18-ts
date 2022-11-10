/// <reference types="react" />
import { MediaPluginState } from '../../pm-plugins/types';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { EditorAppearance } from '../../../../types/editor-appearance';
declare type Props = {
    mediaState: MediaPluginState;
    isActive: boolean;
    featureFlags?: MediaFeatureFlags;
    editorDomElement: Element;
    appearance: EditorAppearance;
};
export declare const DropzoneWrapper: ({ mediaState, isActive, featureFlags, editorDomElement, appearance, }: Props) => JSX.Element;
export {};

/** @jsx jsx */
import React, { ReactElement } from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import { WrappedComponentProps } from 'react-intl-next';
import { EditorAppearance, ToolbarUIComponentFactory, PrimaryToolbarComponents } from '../../../types';
import { CollabEditOptions } from '../../../plugins/collab-edit';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorActions } from '../../..';
import { FeatureFlags } from '../../../types/feature-flags';
export interface FullPageToolbarProps {
    appearance?: EditorAppearance;
    providerFactory: ProviderFactory;
    editorActions?: EditorActions;
    editorDOMElement: JSX.Element;
    editorView: EditorView;
    eventDispatcher: EventDispatcher;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    primaryToolbarComponents?: ToolbarUIComponentFactory[];
    customPrimaryToolbarComponents?: PrimaryToolbarComponents;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    disabled: boolean;
    collabEdit?: CollabEditOptions;
    showKeyline: boolean;
    containerElement: HTMLElement | null;
    beforeIcon?: ReactElement;
    hasMinWidth?: boolean;
    featureFlags?: FeatureFlags;
}
export declare const EditorToolbar: React.FunctionComponent<FullPageToolbarProps & WrappedComponentProps>;
export declare const FullPageToolbar: React.FC<import("react-intl-next").WithIntlProps<FullPageToolbarProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<FullPageToolbarProps & WrappedComponentProps<"intl">>;
};

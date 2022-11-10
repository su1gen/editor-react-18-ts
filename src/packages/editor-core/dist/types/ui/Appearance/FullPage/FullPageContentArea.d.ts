import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorView } from 'prosemirror-view';
import React, { ReactElement } from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import EditorActions from '../../../actions';
import { EventDispatcher } from '../../../event-dispatcher';
import { ReactComponents, EditorAppearance, UIComponentFactory } from '../../../types';
import { DispatchAnalyticsEvent } from '../../../plugins/analytics';
interface FullPageEditorContentAreaProps {
    appearance: EditorAppearance | undefined;
    contentArea: HTMLElement | undefined;
    contentComponents: UIComponentFactory[] | undefined;
    contextPanel: ReactComponents | undefined;
    customContentComponents: ReactComponents | undefined;
    disabled: boolean | undefined;
    dispatchAnalyticsEvent: DispatchAnalyticsEvent | undefined;
    editorActions: EditorActions | undefined;
    editorDOMElement: ReactElement;
    editorView: EditorView;
    eventDispatcher: EventDispatcher | undefined;
    popupsMountPoint: HTMLElement | undefined;
    popupsBoundariesElement: HTMLElement | undefined;
    popupsScrollableElement: HTMLElement | undefined;
    providerFactory: ProviderFactory;
    scrollContainer: HTMLElement | null;
    contentAreaRef(ref: HTMLElement | null): void;
    scrollContainerRef(ref: HTMLElement | null): void;
    wrapperElement: HTMLElement | null;
}
export declare const CONTENT_AREA_TEST_ID = "ak-editor-fp-content-area";
export declare const FullPageContentArea: React.FC<import("react-intl-next").WithIntlProps<FullPageEditorContentAreaProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<FullPageEditorContentAreaProps & WrappedComponentProps<"intl">>;
};
export {};

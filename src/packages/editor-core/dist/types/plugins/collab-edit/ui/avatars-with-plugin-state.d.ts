import React from 'react';
import { WrappedComponentProps } from 'react-intl-next';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../../../event-dispatcher';
import { CollabInviteToEditProps } from '../types';
export declare type AvatarsWithPluginStateProps = {
    editorView?: EditorView;
    eventDispatcher?: EventDispatcher;
} & CollabInviteToEditProps;
declare const _default: React.FC<import("react-intl-next").WithIntlProps<{
    editorView?: EditorView<any> | undefined;
    eventDispatcher?: EventDispatcher<any> | undefined;
} & CollabInviteToEditProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        editorView?: EditorView<any> | undefined;
        eventDispatcher?: EventDispatcher<any> | undefined;
    } & CollabInviteToEditProps & WrappedComponentProps<"intl">>;
};
export default _default;

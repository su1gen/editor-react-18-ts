import React from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../../../../event-dispatcher';
import { MediaPluginState } from '../../pm-plugins/types';
import { WrappedComponentProps } from 'react-intl-next';
export interface Props<T extends MediaPluginState> {
    editorView: EditorView;
    pluginKey: PluginKey<T>;
    eventDispatcher: EventDispatcher;
    isDisabled?: boolean;
    isReducedSpacing?: boolean;
}
declare const _default: React.FC<import("react-intl-next").WithIntlProps<Props<MediaPluginState> & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<Props<MediaPluginState> & WrappedComponentProps<"intl">>;
};
export default _default;

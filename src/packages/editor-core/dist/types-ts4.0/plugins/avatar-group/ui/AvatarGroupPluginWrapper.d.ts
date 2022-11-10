import { jsx } from '@emotion/react';
import { EventDispatcher } from '../../../event-dispatcher';
import { EditorView } from 'prosemirror-view';
import { CollabEditOptions } from '../../collab-edit';
import { DispatchAnalyticsEvent } from '../../analytics';
declare const AvatarGroupPluginWrapper: (props: {
    collabEdit?: CollabEditOptions | undefined;
    editorView: EditorView;
    eventDispatcher: EventDispatcher<any>;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent | undefined;
    takeFullWidth: boolean;
}) => jsx.JSX.Element;
export default AvatarGroupPluginWrapper;

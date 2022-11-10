import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState } from 'prosemirror-state';
import type { CollabEditProvider } from '@atlaskit/editor-common/collab';
export declare const nativeCollabProviderPlugin: ({ providerPromise, }: {
    providerPromise: Promise<CollabEditProvider>;
}) => SafePlugin<CollabEditProvider<import("@atlaskit/editor-common/collab").CollabEventData> | null, any>;
export declare const getCollabProvider: (editorState: EditorState) => CollabEditProvider | null;

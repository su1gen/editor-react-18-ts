import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView } from 'prosemirror-view';
import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin, EditorProps } from '../../types';
export declare function createPlugin(eventDispatch: Dispatch, onSave?: (editorView: EditorView) => void): SafePlugin | undefined;
declare const submitEditorPlugin: (onSave?: EditorProps['onSave']) => EditorPlugin;
export default submitEditorPlugin;

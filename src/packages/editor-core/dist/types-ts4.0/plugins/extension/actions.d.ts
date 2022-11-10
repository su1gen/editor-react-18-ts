import { EditorView } from 'prosemirror-view';
import { Schema, Node as PmNode, Fragment, Mark } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { UpdateExtension, ExtensionAPI } from '@atlaskit/editor-common/extensions';
import { MacroProvider } from '@atlaskit/editor-common/provider-factory';
export { transformSliceToRemoveOpenBodiedExtension } from '@atlaskit/editor-common/transforms';
import { Command, CommandDispatch } from '../../types';
import EditorActions from '../../actions';
export declare const buildExtensionNode: <S extends Schema<any, any>>(type: 'inlineExtension' | 'extension' | 'bodiedExtension', schema: S, attrs: object, content?: Fragment<any> | undefined, marks?: Mark<S>[] | undefined) => PmNode<Schema<any, any>>;
export declare const performNodeUpdate: (type: 'inlineExtension' | 'extension' | 'bodiedExtension', newAttrs: object, content: Fragment<any>, marks: Mark[], shouldScrollIntoView: boolean) => Command;
export declare const updateExtensionParams: (updateExtension: UpdateExtension<object>, node: {
    node: PmNode;
    pos: number;
}, actions: ExtensionAPI) => (state: EditorState, dispatch?: CommandDispatch | undefined, view?: EditorView<any> | undefined) => Promise<boolean>;
export declare const editSelectedExtension: (editorActions: EditorActions) => boolean;
export declare const editExtension: (macroProvider: MacroProvider | null, updateExtension?: Promise<void | UpdateExtension<object>> | undefined) => Command;

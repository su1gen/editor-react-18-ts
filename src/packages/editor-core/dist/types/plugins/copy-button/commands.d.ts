import { Command, CommandDispatch } from '../../types';
import { MarkType, NodeType } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
export declare function createToolbarCopyCommandForMark(markType: MarkType): Command;
export declare function getProvideMarkVisualFeedbackForCopyButtonCommand(markType: MarkType): (state: EditorState, dispatch: CommandDispatch | undefined) => boolean;
export declare function removeMarkVisualFeedbackForCopyButtonCommand(state: EditorState, dispatch: CommandDispatch | undefined): boolean;
export declare const createToolbarCopyCommandForNode: (nodeType: NodeType | Array<NodeType>) => Command;
export declare const resetCopiedState: (nodeType: NodeType | Array<NodeType>, onMouseLeave?: Command | undefined) => Command;

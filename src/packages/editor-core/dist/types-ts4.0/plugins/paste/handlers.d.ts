import { Schema, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { ExtensionAutoConvertHandler } from '@atlaskit/editor-common/extensions';
import { Command } from '../../types';
import { InputMethodInsertMedia } from '../analytics';
import { CardOptions } from '@atlaskit/editor-common/card';
export declare function handleMention(slice: Slice, schema: Schema): Slice;
export declare function handlePasteIntoTaskOrDecisionOrPanel(slice: Slice): Command;
export declare function handlePastePanelIntoList(slice: Slice): Command;
export declare function handlePasteLinkOnSelectedText(slice: Slice): Command;
export declare function handlePasteAsPlainText(slice: Slice, _event: ClipboardEvent): Command;
export declare function handlePastePreservingMarks(slice: Slice): Command;
export declare function handleMacroAutoConvert(text: string, slice: Slice, cardsOptions?: CardOptions, extensionAutoConverter?: ExtensionAutoConvertHandler): Command;
export declare function handleCodeBlock(text: string): Command;
export declare function handleMediaSingle(inputMethod: InputMethodInsertMedia): (slice: Slice) => Command;
export declare function handleExpandPasteInTable(slice: Slice): Command;
export declare function handleMarkdown(markdownSlice: Slice, from?: number, to?: number): Command;
export declare function handleParagraphBlockMarks(state: EditorState, slice: Slice): Slice<any>;
/**
 * ED-6300: When a nested list is pasted in a table cell and the slice has openStart > openEnd,
 * it splits the table. As a workaround, we flatten the list to even openStart and openEnd.
 *
 * Note: this only happens if the first child is a list
 *
 * Example: copying "one" and "two"
 * - zero
 *   - one
 * - two
 *
 * Before:
 * ul
 *   ┗━ li
 *     ┗━ ul
 *       ┗━ li
 *         ┗━ p -> "one"
 *   ┗━ li
 *     ┗━ p -> "two"
 *
 * After:
 * ul
 *   ┗━ li
 *     ┗━ p -> "one"
 *   ┗━ li
 *     ┗━p -> "two"
 */
export declare function flattenNestedListInSlice(slice: Slice): Slice<any>;
export declare function handleRichText(slice: Slice): Command;
export declare function handlePasteIntoCaption(slice: Slice): Command;
export declare const handleSelectedTable: (slice: Slice) => Command;

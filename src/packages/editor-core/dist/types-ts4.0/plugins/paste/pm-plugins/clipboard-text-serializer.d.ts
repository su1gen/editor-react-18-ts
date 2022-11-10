import { Slice } from 'prosemirror-model';
/**
 * Returns a plain text serialization of a given slice. This is used for populating the plain text
 * section of the clipboard on copy.
 * The current implementation is bare bones - only inlineCards and blockCards are tested (they
 * previously were empty on plain text copy).
 * Unknown nodes are passed to node.textBetween().
 *
 * By default (without this function passed to the editor), the editor uses
 * `slice.content.textBetween(0, slice.content.size, "\n\n")`
 * (see https://prosemirror.net/docs/ref/#view.EditorProps.clipboardTextSerializer)
 */
export declare function clipboardTextSerializer(slice: Slice): string;

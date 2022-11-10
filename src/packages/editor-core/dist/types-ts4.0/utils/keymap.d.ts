import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
/**
 * A workaround for mostly Cyrillic but should have a positive affect
 * on other languages / layouts. Attempts a similar approach to OS X.
 * @see ED-7310
 * @see https://github.com/ProseMirror/prosemirror/issues/957
 * @param bindings
 */
export declare function keymap(bindings: {
    [key: string]: any;
}): SafePlugin<any, any>;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keymap = keymap;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _w3cKeyname = require("w3c-keyname");

/**
 * A workaround for mostly Cyrillic but should have a positive affect
 * on other languages / layouts. Attempts a similar approach to OS X.
 * @see ED-7310
 * @see https://github.com/ProseMirror/prosemirror/issues/957
 * @param bindings
 */
function keymap(bindings) {
  return new _safePlugin.SafePlugin({
    props: {
      handleKeyDown: function handleKeyDown(view, event) {
        var name = (0, _w3cKeyname.keyName)(event);
        var keyboardEvent = event;

        if (event.ctrlKey && name.length === 1 && // Check the unicode of the character to
        // assert that its not an ASCII character.
        // These are characters outside Latin's range.
        /[^\u0000-\u007f]/.test(name)) {
          keyboardEvent = new KeyboardEvent('keydown', {
            key: _w3cKeyname.base[event.keyCode],
            code: event.code,
            ctrlKey: true
          });
        }

        return (0, _prosemirrorKeymap.keydownHandler)(bindings)(view, keyboardEvent);
      }
    }
  });
}
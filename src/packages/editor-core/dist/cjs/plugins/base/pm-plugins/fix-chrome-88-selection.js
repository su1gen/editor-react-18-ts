"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixChromeSelectionKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

function isDivHTMLElement(elm) {
  return elm.tagName.toLowerCase() === 'div';
}

var fixChromeSelectionKey = new _prosemirrorState.PluginKey('fixChromeSelectionPlugin');
exports.fixChromeSelectionKey = fixChromeSelectionKey;

var _default = function _default() {
  return new _safePlugin.SafePlugin({
    key: fixChromeSelectionKey,
    props: {
      handleDOMEvents: {
        focus: function focus(view) {
          // We don't need to reset when there's a NodeSelection
          // It creates other problem. @see HOT-94478
          if (isDivHTMLElement(view.dom) && !(0, _prosemirrorUtils.isNodeSelection)(view.state.selection)) {
            view.dom.style.display = 'inline-block';
            view.dom.offsetHeight;
            view.dom.style.display = 'block';
          }

          return false;
        }
      }
    }
  });
};

exports.default = _default;
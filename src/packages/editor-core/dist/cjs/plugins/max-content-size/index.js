"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var pluginKey = new _prosemirrorState.PluginKey('maxContentSizePlugin');
exports.pluginKey = pluginKey;

function createPlugin(dispatch, maxContentSize) {
  if (!maxContentSize) {
    return;
  }

  var maxContentSizeReached = false;
  return new _safePlugin.SafePlugin({
    filterTransaction: function filterTransaction(tr) {
      var result = tr.doc && tr.doc.nodeSize > maxContentSize;

      if (result || result !== maxContentSizeReached) {
        dispatch(pluginKey, {
          maxContentSizeReached: result
        });
      }

      maxContentSizeReached = result;
      return !result;
    }
  });
}

var maxContentSizePlugin = function maxContentSizePlugin(maxContentSize) {
  return {
    name: 'maxContentSize',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'maxContentSize',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, maxContentSize);
        }
      }];
    }
  };
};

var _default = maxContentSizePlugin;
exports.default = _default;
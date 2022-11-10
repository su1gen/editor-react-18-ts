"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollIntoViewPluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

/**
 * Plugin to scroll the user's selection into view whenever the user updates
 * the document eg. inserting, deleting, formatting
 *
 * Behaviour is on by default, can be explicitly opted out of for a transaction by
 * setting scrollIntoView=false meta
 * We ignore collab transactions, appended transactions, transactions without steps,
 * transactions with addToHistory=false meta and typeahead trigger transactions
 */
var scrollIntoViewPluginKey = new _prosemirrorState.PluginKey('scrollIntoViewPlugin');
exports.scrollIntoViewPluginKey = scrollIntoViewPluginKey;

var createPlugin = function createPlugin() {
  return new _safePlugin.SafePlugin({
    key: scrollIntoViewPluginKey,
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      if (!transactions.length) {
        return;
      }

      var tr = transactions[0];

      if ((tr.docChanged || tr.storedMarksSet) && !tr.scrolledIntoView && tr.getMeta('scrollIntoView') !== false && // ignore anything we would not want to undo
      // this covers things like autofixing layouts, hovering table rows/cols
      tr.getMeta('addToHistory') !== false && // ignore collab changes from another user
      !tr.getMeta('isRemote') && // ignore any transaction coming from the input text rule plugin
      !tr.getMeta(_prosemirrorInputRules.TEXT_INPUT_RULE_TRANSACTION_KEY)) {
        return newState.tr.scrollIntoView();
      }
    }
  });
};

var scrollIntoViewPlugin = function scrollIntoViewPlugin() {
  return {
    name: 'scrollIntoView',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'scrollIntoView',
        plugin: function plugin() {
          return createPlugin();
        }
      }];
    }
  };
};

var _default = scrollIntoViewPlugin;
exports.default = _default;
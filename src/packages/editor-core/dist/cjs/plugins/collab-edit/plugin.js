"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PluginState", {
  enumerable: true,
  get: function get() {
    return _pluginState.PluginState;
  }
});
exports.createPlugin = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _initialize = require("./events/initialize");

var _pluginState = require("./plugin-state");

var _pluginKey = require("./plugin-key");

var _analytics = require("./analytics");

var _fireAnalyticsEvent = require("../analytics/fire-analytics-event");

var _analytics2 = require("../analytics");

var createPlugin = function createPlugin(dispatch, providerFactory, collabProviderCallback, options) {
  var fireAnalyticsCallback = (0, _fireAnalyticsEvent.fireAnalyticsEvent)(options === null || options === void 0 ? void 0 : options.createAnalyticsEvent);
  return new _safePlugin.SafePlugin({
    key: _pluginKey.pluginKey,
    state: {
      init: function init(config) {
        return _pluginState.PluginState.init(config);
      },
      apply: function apply(transaction, prevPluginState, oldEditorState, newEditorState) {
        var pluginState = prevPluginState.apply(transaction);
        dispatch(_pluginKey.pluginKey, pluginState);
        return pluginState;
      }
    },
    props: {
      decorations: function decorations(state) {
        return this.getState(state).decorations;
      }
    },
    filterTransaction: function filterTransaction(tr, state) {
      var pluginState = _pluginKey.pluginKey.getState(state);

      var collabInitialiseTr = tr.getMeta('collabInitialised'); // Don't allow transactions that modifies the document before
      // collab-plugin is ready.

      if (collabInitialiseTr) {
        return true;
      }

      if (!pluginState.isReady && tr.docChanged) {
        return false;
      }

      return true;
    },
    view: function view(_view) {
      var addErrorAnalytics = (0, _analytics.addSynchronyErrorAnalytics)(_view.state, _view.state.tr);

      var onSyncUpError = function onSyncUpError(attributes) {
        fireAnalyticsCallback({
          payload: {
            action: _analytics2.ACTION.NEW_COLLAB_SYNC_UP_ERROR_NO_STEPS,
            actionSubject: _analytics2.ACTION_SUBJECT.EDITOR,
            eventType: _analytics2.EVENT_TYPE.OPERATIONAL,
            attributes: attributes
          }
        });
      };

      options.onSyncUpError = onSyncUpError;
      var cleanup = collabProviderCallback((0, _initialize.initialize)({
        view: _view,
        options: options,
        providerFactory: providerFactory
      }), addErrorAnalytics);
      return {
        destroy: function destroy() {
          providerFactory.unsubscribeAll('collabEditProvider');

          if (cleanup) {
            cleanup.then(function (unsubscribe) {
              if (unsubscribe) {
                unsubscribe();
              }
            });
          }
        }
      };
    }
  });
};

exports.createPlugin = createPlugin;
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { initialize } from './events/initialize';
import { PluginState } from './plugin-state';
import { pluginKey } from './plugin-key';
import { addSynchronyErrorAnalytics } from './analytics';
import { fireAnalyticsEvent } from '../analytics/fire-analytics-event';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../analytics';
export { PluginState, pluginKey };
export var createPlugin = function createPlugin(dispatch, providerFactory, collabProviderCallback, options) {
  var fireAnalyticsCallback = fireAnalyticsEvent(options === null || options === void 0 ? void 0 : options.createAnalyticsEvent);
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init(config) {
        return PluginState.init(config);
      },
      apply: function apply(transaction, prevPluginState, oldEditorState, newEditorState) {
        var pluginState = prevPluginState.apply(transaction);
        dispatch(pluginKey, pluginState);
        return pluginState;
      }
    },
    props: {
      decorations: function decorations(state) {
        return this.getState(state).decorations;
      }
    },
    filterTransaction: function filterTransaction(tr, state) {
      var pluginState = pluginKey.getState(state);
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
      var addErrorAnalytics = addSynchronyErrorAnalytics(_view.state, _view.state.tr);

      var onSyncUpError = function onSyncUpError(attributes) {
        fireAnalyticsCallback({
          payload: {
            action: ACTION.NEW_COLLAB_SYNC_UP_ERROR_NO_STEPS,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: attributes
          }
        });
      };

      options.onSyncUpError = onSyncUpError;
      var cleanup = collabProviderCallback(initialize({
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
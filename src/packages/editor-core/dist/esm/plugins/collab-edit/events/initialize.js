import { Step } from 'prosemirror-transform';
import memoizeOne from 'memoize-one';
import { subscribe } from './handlers';
import { pluginKey } from '../plugin-key';

var initCollab = function initCollab(collabEditProvider, view) {
  if (collabEditProvider.initialize) {
    collabEditProvider.initialize(function () {
      return view.state;
    }, function (json) {
      return Step.fromJSON(view.state.schema, json);
    });
  }
};

var initNewCollab = function initNewCollab(collabEditProvider, view, onSyncUpError) {
  collabEditProvider.setup({
    getState: function getState() {
      return view.state;
    },
    onSyncUpError: onSyncUpError
  });
};

var initCollabMemo = memoizeOne(initCollab);
export var initialize = function initialize(_ref) {
  var options = _ref.options,
      providerFactory = _ref.providerFactory,
      view = _ref.view;
  return function (provider) {
    var cleanup;
    var pluginState = pluginKey.getState(view.state);

    if (pluginState.isReady && cleanup) {
      cleanup();
    }

    cleanup = subscribe(view, provider, options, providerFactory); // Initialize provider

    if (options.useNativePlugin) {
      // ED-13912 For NCS we don't want to use memoizeOne because it causes
      // infinite text while changing page-width
      initNewCollab(provider, view, options.onSyncUpError);
    } else {
      /**
       * We only want to initialise once, if we reload/reconfigure this plugin
       * We dont want to re-init collab, it would break existing sessions
       */
      initCollabMemo(provider, view);
    }

    return cleanup;
  };
};
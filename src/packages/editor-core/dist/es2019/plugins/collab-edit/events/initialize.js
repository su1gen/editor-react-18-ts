import { Step } from 'prosemirror-transform';
import memoizeOne from 'memoize-one';
import { subscribe } from './handlers';
import { pluginKey } from '../plugin-key';

const initCollab = (collabEditProvider, view) => {
  if (collabEditProvider.initialize) {
    collabEditProvider.initialize(() => view.state, json => Step.fromJSON(view.state.schema, json));
  }
};

const initNewCollab = (collabEditProvider, view, onSyncUpError) => {
  collabEditProvider.setup({
    getState: () => view.state,
    onSyncUpError
  });
};

const initCollabMemo = memoizeOne(initCollab);
export const initialize = ({
  options,
  providerFactory,
  view
}) => provider => {
  let cleanup;
  const pluginState = pluginKey.getState(view.state);

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
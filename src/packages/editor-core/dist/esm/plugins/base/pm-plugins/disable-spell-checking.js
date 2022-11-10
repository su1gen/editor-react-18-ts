import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { getFeatureFlags } from '../../feature-flags-context';
import { browser as browserEnv } from '@atlaskit/editor-common/utils';

function getCurrentBrowserAndVersion() {
  switch (true) {
    case browserEnv.chrome === true:
      return {
        browser: 'chrome',
        version: browserEnv.chrome_version
      };

    case browserEnv.ie === true:
      return {
        browser: 'ie',
        version: browserEnv.ie_version
      };

    case browserEnv.gecko === true:
      return {
        browser: 'gecko',
        version: browserEnv.gecko_version
      };

    case browserEnv.safari === true:
      return {
        browser: 'safari',
        version: browserEnv.safari_version
      };
  }

  return undefined;
}

export default (function () {
  return new SafePlugin({
    key: new PluginKey('disableSpellchecking'),
    props: {
      attributes: function attributes(editorState) {
        var featureFlags = getFeatureFlags(editorState) || undefined;

        if (!featureFlags) {
          return;
        }

        var browserConfigFeatureFlag = featureFlags.disableSpellcheckByBrowser;
        var userCurrentBrowserAndVersion = getCurrentBrowserAndVersion();

        if (!userCurrentBrowserAndVersion || !browserConfigFeatureFlag) {
          return;
        }

        var browserVersionDisableRange = browserConfigFeatureFlag[userCurrentBrowserAndVersion.browser];

        if (!browserVersionDisableRange || !browserEnv[userCurrentBrowserAndVersion.browser]) {
          return;
        }

        var shouldDisableSpellcheck = !!browserVersionDisableRange.maximum ? userCurrentBrowserAndVersion.version >= browserVersionDisableRange.minimum && userCurrentBrowserAndVersion.version <= browserVersionDisableRange.maximum : browserEnv[userCurrentBrowserAndVersion.browser] && userCurrentBrowserAndVersion.version >= browserVersionDisableRange.minimum;

        if (shouldDisableSpellcheck) {
          return {
            spellcheck: 'false'
          };
        }

        return;
      }
    }
  });
});
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _featureFlagsContext = require("../../feature-flags-context");

var _utils = require("@atlaskit/editor-common/utils");

function getCurrentBrowserAndVersion() {
  switch (true) {
    case _utils.browser.chrome === true:
      return {
        browser: 'chrome',
        version: _utils.browser.chrome_version
      };

    case _utils.browser.ie === true:
      return {
        browser: 'ie',
        version: _utils.browser.ie_version
      };

    case _utils.browser.gecko === true:
      return {
        browser: 'gecko',
        version: _utils.browser.gecko_version
      };

    case _utils.browser.safari === true:
      return {
        browser: 'safari',
        version: _utils.browser.safari_version
      };
  }

  return undefined;
}

var _default = function _default() {
  return new _safePlugin.SafePlugin({
    key: new _prosemirrorState.PluginKey('disableSpellchecking'),
    props: {
      attributes: function attributes(editorState) {
        var featureFlags = (0, _featureFlagsContext.getFeatureFlags)(editorState) || undefined;

        if (!featureFlags) {
          return;
        }

        var browserConfigFeatureFlag = featureFlags.disableSpellcheckByBrowser;
        var userCurrentBrowserAndVersion = getCurrentBrowserAndVersion();

        if (!userCurrentBrowserAndVersion || !browserConfigFeatureFlag) {
          return;
        }

        var browserVersionDisableRange = browserConfigFeatureFlag[userCurrentBrowserAndVersion.browser];

        if (!browserVersionDisableRange || !_utils.browser[userCurrentBrowserAndVersion.browser]) {
          return;
        }

        var shouldDisableSpellcheck = !!browserVersionDisableRange.maximum ? userCurrentBrowserAndVersion.version >= browserVersionDisableRange.minimum && userCurrentBrowserAndVersion.version <= browserVersionDisableRange.maximum : _utils.browser[userCurrentBrowserAndVersion.browser] && userCurrentBrowserAndVersion.version >= browserVersionDisableRange.minimum;

        if (shouldDisableSpellcheck) {
          return {
            spellcheck: 'false'
          };
        }

        return;
      }
    }
  });
};

exports.default = _default;
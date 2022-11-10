"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _messages = require("@atlaskit/editor-common/messages");

var _pluginKey = require("../plugin-key");

var _pluginFactory = require("./plugin-factory");

var createPlugin = function createPlugin(_ref, _ref2) {
  var dispatch = _ref.dispatch,
      getIntl = _ref.getIntl;
  var appearance = _ref2.appearance;
  var intl = getIntl();
  var codeBidiWarningLabel = intl.formatMessage(_messages.codeBidiWarningMessages.label);
  return new _safePlugin.SafePlugin({
    key: _pluginKey.codeBidiWarningPluginKey,
    state: (0, _pluginFactory.createPluginState)(dispatch, function (state) {
      // The appearance being mobile indicates we are in an editor being
      // rendered by mobile bridge in a web view.
      // The tooltip is likely to have unexpected behaviour there, with being cut
      // off, so we disable it. This is also to keep the behaviour consistent with
      // the rendering in the mobile Native Renderer.
      var tooltipEnabled = appearance !== 'mobile';
      return {
        decorationSet: (0, _pluginFactory.createBidiWarningsDecorationSetFromDoc)({
          doc: state.doc,
          codeBidiWarningLabel: codeBidiWarningLabel,
          tooltipEnabled: tooltipEnabled
        }),
        codeBidiWarningLabel: codeBidiWarningLabel,
        tooltipEnabled: tooltipEnabled
      };
    }),
    props: {
      decorations: function decorations(state) {
        var _getPluginState = (0, _pluginFactory.getPluginState)(state),
            decorationSet = _getPluginState.decorationSet;

        return decorationSet;
      }
    }
  });
};

exports.createPlugin = createPlugin;
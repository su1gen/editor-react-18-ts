"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialize = void 0;

var _prosemirrorTransform = require("prosemirror-transform");

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _handlers = require("./handlers");

var _pluginKey = require("../plugin-key");

var initCollab = function initCollab(collabEditProvider, view) {
  if (collabEditProvider.initialize) {
    collabEditProvider.initialize(function () {
      return view.state;
    }, function (json) {
      return _prosemirrorTransform.Step.fromJSON(view.state.schema, json);
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

var initCollabMemo = (0, _memoizeOne.default)(initCollab);

var initialize = function initialize(_ref) {
  var options = _ref.options,
      providerFactory = _ref.providerFactory,
      view = _ref.view;
  return function (provider) {
    var cleanup;

    var pluginState = _pluginKey.pluginKey.getState(view.state);

    if (pluginState.isReady && cleanup) {
      cleanup();
    }

    cleanup = (0, _handlers.subscribe)(view, provider, options, providerFactory); // Initialize provider

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

exports.initialize = initialize;
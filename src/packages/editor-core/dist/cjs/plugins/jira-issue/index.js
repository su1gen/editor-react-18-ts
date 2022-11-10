"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _nodeviews = require("../../nodeviews");

var _jiraIssue = _interopRequireDefault(require("./nodeviews/jira-issue"));

var pluginKey = new _prosemirrorState.PluginKey('jiraIssuePlugin');
exports.pluginKey = pluginKey;

var createPlugin = function createPlugin(_ref) {
  var portalProviderAPI = _ref.portalProviderAPI,
      eventDispatcher = _ref.eventDispatcher;
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceJiraIssue: _nodeviews.ReactNodeView.fromComponent(_jiraIssue.default, portalProviderAPI, eventDispatcher)
      }
    }
  });
};

var jiraIssuePlugin = function jiraIssuePlugin() {
  return {
    name: 'confluenceJiraIssue',
    nodes: function nodes() {
      return [{
        name: 'confluenceJiraIssue',
        node: _adfSchema.confluenceJiraIssue
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'jiraIssue',
        plugin: createPlugin
      }];
    }
  };
};

var _default = jiraIssuePlugin;
exports.default = _default;
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { confluenceJiraIssue } from '@atlaskit/adf-schema';
import { ReactNodeView } from '../../nodeviews';
import ReactJIRAIssueNode from './nodeviews/jira-issue';
export var pluginKey = new PluginKey('jiraIssuePlugin');

var createPlugin = function createPlugin(_ref) {
  var portalProviderAPI = _ref.portalProviderAPI,
      eventDispatcher = _ref.eventDispatcher;
  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceJiraIssue: ReactNodeView.fromComponent(ReactJIRAIssueNode, portalProviderAPI, eventDispatcher)
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
        node: confluenceJiraIssue
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

export default jiraIssuePlugin;
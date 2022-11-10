import React from 'react';
import { rule } from '@atlaskit/adf-schema';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { IconDivider } from '../quick-insert/assets';
import inputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';

var rulePlugin = function rulePlugin() {
  return {
    name: 'rule',
    nodes: function nodes() {
      return [{
        name: 'rule',
        node: rule
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'ruleInputRule',
        plugin: function plugin(_ref) {
          var schema = _ref.schema,
              featureFlags = _ref.featureFlags;
          return inputRulePlugin(schema, featureFlags);
        }
      }, {
        name: 'ruleKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        return [{
          id: 'rule',
          title: formatMessage(messages.horizontalRule),
          description: formatMessage(messages.horizontalRuleDescription),
          keywords: ['horizontal', 'rule', 'line', 'hr'],
          priority: 1200,
          keyshortcut: '---',
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconDivider, null);
          },
          action: function action(insert, state) {
            var tr = insert(state.schema.nodes.rule.createChecked());
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: ACTION_SUBJECT_ID.DIVIDER,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              },
              eventType: EVENT_TYPE.TRACK
            });
          }
        }];
      }
    }
  };
};

export default rulePlugin;
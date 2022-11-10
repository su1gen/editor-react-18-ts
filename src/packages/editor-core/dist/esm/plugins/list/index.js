import React from 'react';
import { orderedList, bulletList, listItem } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rules';
import keymapPlugin from './pm-plugins/keymap';
import { messages } from './messages';
import { addAnalytics, ACTION, EVENT_TYPE, INPUT_METHOD, ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../analytics';
import { tooltip, toggleBulletList, toggleOrderedList } from '../../keymaps';
import { IconList, IconListNumber } from '../quick-insert/assets';

var listPlugin = function listPlugin() {
  return {
    name: 'list',
    nodes: function nodes() {
      return [{
        name: 'bulletList',
        node: bulletList
      }, {
        name: 'orderedList',
        node: orderedList
      }, {
        name: 'listItem',
        node: listItem
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'list',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }, {
        name: 'listInputRule',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              featureFlags = _ref2.featureFlags;
          return inputRulePlugin(schema, featureFlags);
        }
      }, {
        name: 'listKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'unorderedList',
          title: formatMessage(messages.unorderedList),
          description: formatMessage(messages.unorderedListDescription),
          keywords: ['ul', 'unordered'],
          priority: 1100,
          keyshortcut: tooltip(toggleBulletList),
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconList, null);
          },
          action: function action(insert, state) {
            var tr = insert(state.schema.nodes.bulletList.createChecked({}, state.schema.nodes.listItem.createChecked({}, state.schema.nodes.paragraph.createChecked())));
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.LIST,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_BULLET,
              eventType: EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              }
            });
          }
        }, {
          id: 'orderedList',
          title: formatMessage(messages.orderedList),
          description: formatMessage(messages.orderedListDescription),
          keywords: ['ol', 'ordered'],
          priority: 1200,
          keyshortcut: tooltip(toggleOrderedList),
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconListNumber, null);
          },
          action: function action(insert, state) {
            var tr = insert(state.schema.nodes.orderedList.createChecked({}, state.schema.nodes.listItem.createChecked({}, state.schema.nodes.paragraph.createChecked())));
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.LIST,
              actionSubjectId: ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER,
              eventType: EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              }
            });
          }
        }];
      }
    }
  };
};

export default listPlugin;
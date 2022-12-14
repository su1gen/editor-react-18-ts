import React from 'react';
import { orderedList, bulletList, listItem } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import inputRulePlugin from './pm-plugins/input-rules';
import keymapPlugin from './pm-plugins/keymap';
import { messages } from './messages';
import { addAnalytics, ACTION, EVENT_TYPE, INPUT_METHOD, ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../analytics';
import { tooltip, toggleBulletList, toggleOrderedList } from '../../keymaps';
import { IconList, IconListNumber } from '../quick-insert/assets';

const listPlugin = () => ({
  name: 'list',

  nodes() {
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

  pmPlugins() {
    return [{
      name: 'list',
      plugin: ({
        dispatch
      }) => createPlugin(dispatch)
    }, {
      name: 'listInputRule',
      plugin: ({
        schema,
        featureFlags
      }) => inputRulePlugin(schema, featureFlags)
    }, {
      name: 'listKeymap',
      plugin: () => keymapPlugin()
    }];
  },

  pluginsOptions: {
    quickInsert: ({
      formatMessage
    }) => [{
      id: 'unorderedList',
      title: formatMessage(messages.unorderedList),
      description: formatMessage(messages.unorderedListDescription),
      keywords: ['ul', 'unordered'],
      priority: 1100,
      keyshortcut: tooltip(toggleBulletList),
      icon: () => /*#__PURE__*/React.createElement(IconList, null),

      action(insert, state) {
        const tr = insert(state.schema.nodes.bulletList.createChecked({}, state.schema.nodes.listItem.createChecked({}, state.schema.nodes.paragraph.createChecked())));
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
      icon: () => /*#__PURE__*/React.createElement(IconListNumber, null),

      action(insert, state) {
        const tr = insert(state.schema.nodes.orderedList.createChecked({}, state.schema.nodes.listItem.createChecked({}, state.schema.nodes.paragraph.createChecked())));
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

    }]
  }
});

export default listPlugin;
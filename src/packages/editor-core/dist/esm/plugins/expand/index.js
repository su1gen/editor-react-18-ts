import _typeof from "@babel/runtime/helpers/typeof";
import React from 'react';
import { expand, nestedExpand } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { expandKeymap } from './pm-plugins/keymap';
import { IconExpand } from '../quick-insert/assets';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { getToolbarConfig } from './toolbar';
import { createExpandNode } from './commands';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';

var expandPlugin = function expandPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'expand',
    nodes: function nodes() {
      return [{
        name: 'expand',
        node: expand
      }, {
        name: 'nestedExpand',
        node: nestedExpand
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'expand',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              getIntl = _ref.getIntl;
          return createPlugin(dispatch, getIntl, options.appearance, options.useLongPressSelection);
        }
      }, {
        name: 'expandKeymap',
        plugin: expandKeymap
      }];
    },
    pluginsOptions: {
      floatingToolbar: getToolbarConfig,
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;

        if (options && options.allowInsertion !== true) {
          return [];
        }

        return [{
          id: 'expand',
          title: formatMessage(messages.expand),
          description: formatMessage(messages.expandDescription),
          keywords: ['accordion', 'collapse'],
          priority: 600,
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconExpand, null);
          },
          action: function action(insert, state) {
            var node = createExpandNode(state);
            var tr = insert(node);
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: node.type === state.schema.nodes.nestedExpand ? ACTION_SUBJECT_ID.NESTED_EXPAND : ACTION_SUBJECT_ID.EXPAND,
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

export default expandPlugin;
export function isExpandInsertionEnabled(_ref3) {
  var allowExpand = _ref3.allowExpand;

  if (allowExpand && _typeof(allowExpand) === 'object') {
    return !!allowExpand.allowInsertion;
  }

  return false;
}
export { pluginKey } from './pm-plugins/plugin-factory';
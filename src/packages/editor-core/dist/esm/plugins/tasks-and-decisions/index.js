import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { decisionItem, decisionList, taskItem, taskList } from '@atlaskit/adf-schema';
import { INPUT_METHOD } from '../analytics';
import { messages as insertBlockMessages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { IconAction, IconDecision } from '../quick-insert/assets';
import { insertTaskDecisionAction, getListTypes } from './commands';
import inputRulePlugin from './pm-plugins/input-rules';
import keymap from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import ToolbarDecision from './ui/ToolbarDecision';
import ToolbarTask from './ui/ToolbarTask';
var taskDecisionToolbarGroup = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n"])));

var addItem = function addItem(insert, listType, schema) {
  return function (_ref) {
    var listLocalId = _ref.listLocalId,
        itemLocalId = _ref.itemLocalId;

    var _getListTypes = getListTypes(listType, schema),
        list = _getListTypes.list,
        item = _getListTypes.item;

    return insert(list.createChecked({
      localId: listLocalId
    }, item.createChecked({
      localId: itemLocalId
    })));
  };
};

var tasksAndDecisionsPlugin = function tasksAndDecisionsPlugin() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      allowNestedTasks = _ref2.allowNestedTasks,
      consumeTabs = _ref2.consumeTabs,
      useLongPressSelection = _ref2.useLongPressSelection;

  return {
    name: 'taskDecision',
    nodes: function nodes() {
      return [{
        name: 'decisionList',
        node: decisionList
      }, {
        name: 'decisionItem',
        node: decisionItem
      }, {
        name: 'taskList',
        node: taskList
      }, {
        name: 'taskItem',
        node: taskItem
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'tasksAndDecisions',
        plugin: function plugin(_ref3) {
          var portalProviderAPI = _ref3.portalProviderAPI,
              providerFactory = _ref3.providerFactory,
              eventDispatcher = _ref3.eventDispatcher,
              dispatch = _ref3.dispatch;
          return createPlugin(portalProviderAPI, eventDispatcher, providerFactory, dispatch, useLongPressSelection);
        }
      }, {
        name: 'tasksAndDecisionsInputRule',
        plugin: function plugin(_ref4) {
          var schema = _ref4.schema,
              featureFlags = _ref4.featureFlags;
          return inputRulePlugin(schema, featureFlags);
        }
      }, {
        name: 'tasksAndDecisionsKeyMap',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema;
          return keymap(schema, allowNestedTasks, consumeTabs);
        }
      } // Needs to be after "save-on-enter"
      ];
    },
    secondaryToolbarComponent: function secondaryToolbarComponent(_ref6) {
      var editorView = _ref6.editorView,
          disabled = _ref6.disabled;
      return jsx("div", {
        css: taskDecisionToolbarGroup
      }, jsx(ToolbarDecision, {
        editorView: editorView,
        isDisabled: disabled,
        isReducedSpacing: true
      }), jsx(ToolbarTask, {
        editorView: editorView,
        isDisabled: disabled,
        isReducedSpacing: true
      }));
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref7) {
        var formatMessage = _ref7.formatMessage;
        return [{
          id: 'action',
          title: formatMessage(insertBlockMessages.action),
          description: formatMessage(insertBlockMessages.actionDescription),
          priority: 100,
          keywords: ['checkbox', 'task', 'todo'],
          keyshortcut: '[]',
          icon: function icon() {
            return jsx(IconAction, null);
          },
          action: function action(insert, state) {
            return insertTaskDecisionAction(state, 'taskList', INPUT_METHOD.QUICK_INSERT, addItem(insert, 'taskList', state.schema));
          }
        }, {
          id: 'decision',
          title: formatMessage(insertBlockMessages.decision),
          description: formatMessage(insertBlockMessages.decisionDescription),
          priority: 900,
          keyshortcut: '<>',
          icon: function icon() {
            return jsx(IconDecision, null);
          },
          action: function action(insert, state) {
            return insertTaskDecisionAction(state, 'decisionList', INPUT_METHOD.QUICK_INSERT, addItem(insert, 'decisionList', state.schema));
          }
        }];
      }
    }
  };
};

export default tasksAndDecisionsPlugin;
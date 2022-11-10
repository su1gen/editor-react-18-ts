"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _adfSchema = require("@atlaskit/adf-schema");

var _analytics = require("../analytics");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _assets = require("../quick-insert/assets");

var _commands = require("./commands");

var _inputRules = _interopRequireDefault(require("./pm-plugins/input-rules"));

var _keymaps = _interopRequireDefault(require("./pm-plugins/keymaps"));

var _main = require("./pm-plugins/main");

var _ToolbarDecision = _interopRequireDefault(require("./ui/ToolbarDecision"));

var _ToolbarTask = _interopRequireDefault(require("./ui/ToolbarTask"));

var _templateObject;

var taskDecisionToolbarGroup = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n"])));

var addItem = function addItem(insert, listType, schema) {
  return function (_ref) {
    var listLocalId = _ref.listLocalId,
        itemLocalId = _ref.itemLocalId;

    var _getListTypes = (0, _commands.getListTypes)(listType, schema),
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
        node: _adfSchema.decisionList
      }, {
        name: 'decisionItem',
        node: _adfSchema.decisionItem
      }, {
        name: 'taskList',
        node: _adfSchema.taskList
      }, {
        name: 'taskItem',
        node: _adfSchema.taskItem
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
          return (0, _main.createPlugin)(portalProviderAPI, eventDispatcher, providerFactory, dispatch, useLongPressSelection);
        }
      }, {
        name: 'tasksAndDecisionsInputRule',
        plugin: function plugin(_ref4) {
          var schema = _ref4.schema,
              featureFlags = _ref4.featureFlags;
          return (0, _inputRules.default)(schema, featureFlags);
        }
      }, {
        name: 'tasksAndDecisionsKeyMap',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema;
          return (0, _keymaps.default)(schema, allowNestedTasks, consumeTabs);
        }
      } // Needs to be after "save-on-enter"
      ];
    },
    secondaryToolbarComponent: function secondaryToolbarComponent(_ref6) {
      var editorView = _ref6.editorView,
          disabled = _ref6.disabled;
      return (0, _react.jsx)("div", {
        css: taskDecisionToolbarGroup
      }, (0, _react.jsx)(_ToolbarDecision.default, {
        editorView: editorView,
        isDisabled: disabled,
        isReducedSpacing: true
      }), (0, _react.jsx)(_ToolbarTask.default, {
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
          title: formatMessage(_messages.messages.action),
          description: formatMessage(_messages.messages.actionDescription),
          priority: 100,
          keywords: ['checkbox', 'task', 'todo'],
          keyshortcut: '[]',
          icon: function icon() {
            return (0, _react.jsx)(_assets.IconAction, null);
          },
          action: function action(insert, state) {
            return (0, _commands.insertTaskDecisionAction)(state, 'taskList', _analytics.INPUT_METHOD.QUICK_INSERT, addItem(insert, 'taskList', state.schema));
          }
        }, {
          id: 'decision',
          title: formatMessage(_messages.messages.decision),
          description: formatMessage(_messages.messages.decisionDescription),
          priority: 900,
          keyshortcut: '<>',
          icon: function icon() {
            return (0, _react.jsx)(_assets.IconDecision, null);
          },
          action: function action(insert, state) {
            return (0, _commands.insertTaskDecisionAction)(state, 'decisionList', _analytics.INPUT_METHOD.QUICK_INSERT, addItem(insert, 'decisionList', state.schema));
          }
        }];
      }
    }
  };
};

var _default = tasksAndDecisionsPlugin;
exports.default = _default;
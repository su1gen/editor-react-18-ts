"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _analytics = require("../analytics");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _assets = require("../quick-insert/assets");

var _inputRule = _interopRequireDefault(require("./pm-plugins/input-rule"));

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var rulePlugin = function rulePlugin() {
  return {
    name: 'rule',
    nodes: function nodes() {
      return [{
        name: 'rule',
        node: _adfSchema.rule
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'ruleInputRule',
        plugin: function plugin(_ref) {
          var schema = _ref.schema,
              featureFlags = _ref.featureFlags;
          return (0, _inputRule.default)(schema, featureFlags);
        }
      }, {
        name: 'ruleKeymap',
        plugin: function plugin() {
          return (0, _keymap.default)();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        return [{
          id: 'rule',
          title: formatMessage(_messages.messages.horizontalRule),
          description: formatMessage(_messages.messages.horizontalRuleDescription),
          keywords: ['horizontal', 'rule', 'line', 'hr'],
          priority: 1200,
          keyshortcut: '---',
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconDivider, null);
          },
          action: function action(insert, state) {
            var tr = insert(state.schema.nodes.rule.createChecked());
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.DIVIDER,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.TRACK
            });
          }
        }];
      }
    }
  };
};

var _default = rulePlugin;
exports.default = _default;
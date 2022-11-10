"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _toolbar = require("./toolbar");

var _keymaps = _interopRequireDefault(require("./pm-plugins/keymaps"));

var _analytics = require("../analytics");

var _assets = require("../quick-insert/assets");

var _messages = require("../block-type/messages");

var _customPanel = _interopRequireDefault(require("../quick-insert/assets/custom-panel"));

var _colors = require("@atlaskit/theme/colors");

var insertPanelTypeWithAnalytics = function insertPanelTypeWithAnalytics(panelAttributes, state, insert) {
  var tr = insert(insertPanelType(panelAttributes, state));

  if (tr) {
    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.ACTION.INSERTED,
      actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.PANEL,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT,
        panelType: panelAttributes.panelType
      },
      eventType: _analytics.EVENT_TYPE.TRACK
    });
  }

  return tr;
};

var insertPanelType = function insertPanelType(panelAttributes, state) {
  return state.schema.nodes.panel.createChecked(panelAttributes, state.schema.nodes.paragraph.createChecked());
};

var panelPlugin = function panelPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'panel',
    nodes: function nodes() {
      var panelNode = (0, _adfSchema.panel)(!!options.allowCustomPanel);
      return [{
        name: 'panel',
        node: panelNode
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'panel',
        plugin: function plugin(_ref) {
          var providerFactory = _ref.providerFactory,
              dispatch = _ref.dispatch;
          return (0, _main.createPlugin)(dispatch, providerFactory, options);
        }
      }, {
        name: 'panelKeyMap',
        plugin: function plugin() {
          return (0, _keymaps.default)();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        var quickInsertOptions = [{
          id: 'infopanel',
          title: formatMessage(_messages.messages.infoPanel),
          keywords: ['panel'],
          description: formatMessage(_messages.messages.infoPanelDescription),
          priority: 800,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconPanel, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: _adfSchema.PanelType.INFO
            }, state, insert);
          }
        }, {
          id: 'notepanel',
          title: formatMessage(_messages.messages.notePanel),
          description: formatMessage(_messages.messages.notePanelDescription),
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconPanelNote, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: _adfSchema.PanelType.NOTE
            }, state, insert);
          }
        }, {
          id: 'successpanel',
          title: formatMessage(_messages.messages.successPanel),
          description: formatMessage(_messages.messages.successPanelDescription),
          keywords: ['tip'],
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconPanelSuccess, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: _adfSchema.PanelType.SUCCESS
            }, state, insert);
          }
        }, {
          id: 'warningpanel',
          title: formatMessage(_messages.messages.warningPanel),
          description: formatMessage(_messages.messages.warningPanelDescription),
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconPanelWarning, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: _adfSchema.PanelType.WARNING
            }, state, insert);
          }
        }, {
          id: 'errorpanel',
          title: formatMessage(_messages.messages.errorPanel),
          description: formatMessage(_messages.messages.errorPanelDescription),
          priority: 1000,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconPanelError, null);
          },
          action: function action(insert, state) {
            return insertPanelTypeWithAnalytics({
              panelType: _adfSchema.PanelType.ERROR
            }, state, insert);
          }
        }];

        if (options.allowCustomPanel && options.allowCustomPanelEdit) {
          quickInsertOptions.push({
            id: 'custompanel',
            title: formatMessage(_messages.messages.customPanel),
            description: formatMessage(_messages.messages.customPanelDescription),
            priority: 1000,
            icon: function icon() {
              return /*#__PURE__*/_react.default.createElement(_customPanel.default, null);
            },
            action: function action(insert, state) {
              return insertPanelTypeWithAnalytics({
                panelType: _adfSchema.PanelType.CUSTOM,
                panelIcon: ':rainbow:',
                panelIconId: '1f308',
                panelIconText: '🌈',
                // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
                panelColor: _colors.T50
              }, state, insert);
            }
          });
        }

        return quickInsertOptions;
      },
      floatingToolbar: function floatingToolbar(state, intl, providerFactory) {
        return (0, _toolbar.getToolbarConfig)(state, intl, options, providerFactory);
      }
    }
  };
};

var _default = panelPlugin;
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = _interopRequireDefault(require("./pm-plugins/main"));

var _toolbar = require("./toolbar");

var _actions = require("./actions");

var _assets = require("../quick-insert/assets");

var _analytics = require("../analytics");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _pluginKey = require("./pm-plugins/plugin-key");

var layoutPlugin = function layoutPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'layout',
    nodes: function nodes() {
      return [{
        name: 'layoutSection',
        node: _adfSchema.layoutSection
      }, {
        name: 'layoutColumn',
        node: _adfSchema.layoutColumn
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'layout',
        plugin: function plugin() {
          return (0, _main.default)(options);
        }
      }];
    },
    pluginsOptions: {
      floatingToolbar: function floatingToolbar(state, intl) {
        var _ref = _pluginKey.pluginKey.getState(state),
            pos = _ref.pos,
            allowBreakout = _ref.allowBreakout,
            addSidebarLayouts = _ref.addSidebarLayouts,
            allowSingleColumnLayout = _ref.allowSingleColumnLayout;

        if (pos !== null) {
          return (0, _toolbar.buildToolbar)(state, intl, pos, allowBreakout, addSidebarLayouts, allowSingleColumnLayout);
        }

        return undefined;
      },
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        return [{
          id: 'layout',
          title: formatMessage(_messages.messages.columns),
          description: formatMessage(_messages.messages.columnsDescription),
          keywords: ['column', 'section'],
          priority: 1100,
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconLayout, null);
          },
          action: function action(insert, state) {
            var tr = insert((0, _actions.createDefaultLayoutSection)(state));
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.LAYOUT,
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

var _default = layoutPlugin;
exports.default = _default;
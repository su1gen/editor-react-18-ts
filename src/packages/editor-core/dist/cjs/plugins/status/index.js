"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _prosemirrorUtils = require("prosemirror-utils");

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _analytics = require("../analytics");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _assets = require("../quick-insert/assets");

var _actions = require("./actions");

var _keymap = require("./keymap");

var _plugin = _interopRequireDefault(require("./plugin"));

var _pluginKey = require("./plugin-key");

var _statusPicker = _interopRequireDefault(require("./ui/statusPicker"));

var baseStatusPlugin = function baseStatusPlugin(options) {
  return {
    name: 'status',
    nodes: function nodes() {
      return [{
        name: 'status',
        node: _adfSchema.status
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'status',
        plugin: function plugin(pmPluginFactoryParams) {
          return (0, _plugin.default)(pmPluginFactoryParams, options);
        }
      }, {
        name: 'statusKeymap',
        plugin: _keymap.keymapPlugin
      }];
    },
    contentComponent: function contentComponent(_ref) {
      var editorView = _ref.editorView;
      var domAtPos = editorView.domAtPos.bind(editorView);
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          statusState: _pluginKey.pluginKey
        },
        render: function render(_ref2) {
          var _ref2$statusState = _ref2.statusState,
              statusState = _ref2$statusState === void 0 ? {} : _ref2$statusState;
          var showStatusPickerAt = statusState.showStatusPickerAt;

          if (typeof showStatusPickerAt !== 'number') {
            return null;
          }

          var target = (0, _prosemirrorUtils.findDomRefAtPos)(showStatusPickerAt, domAtPos);
          var statusNode = editorView.state.doc.nodeAt(showStatusPickerAt);

          if (!statusNode || statusNode.type.name !== 'status') {
            return null;
          }

          var _statusNode$attrs = statusNode.attrs,
              text = _statusNode$attrs.text,
              color = _statusNode$attrs.color,
              localId = _statusNode$attrs.localId;
          return /*#__PURE__*/_react.default.createElement(_statusPicker.default, {
            isNew: statusState.isNew,
            target: target,
            defaultText: text,
            defaultColor: color,
            defaultLocalId: localId,
            onSelect: function onSelect(status) {
              (0, _actions.updateStatus)(status)(editorView.state, editorView.dispatch);
            },
            onTextChanged: function onTextChanged(status) {
              (0, _actions.updateStatus)(status)(editorView.state, editorView.dispatch);
            },
            closeStatusPicker: function closeStatusPicker() {
              (0, _actions.commitStatusPicker)()(editorView);
            },
            onEnter: function onEnter() {
              (0, _actions.commitStatusPicker)()(editorView);
            }
          });
        }
      });
    }
  };
};

var decorateWithPluginOptions = function decorateWithPluginOptions(plugin, options) {
  if (options.menuDisabled === true) {
    return plugin;
  }

  plugin.pluginsOptions = {
    quickInsert: function quickInsert(_ref3) {
      var formatMessage = _ref3.formatMessage;
      return [{
        id: 'status',
        title: formatMessage(_messages.messages.status),
        description: formatMessage(_messages.messages.statusDescription),
        priority: 700,
        keywords: ['lozenge'],
        icon: function icon() {
          return /*#__PURE__*/_react.default.createElement(_assets.IconStatus, null);
        },
        action: function action(insert, state) {
          return (0, _analytics.addAnalytics)(state, (0, _actions.createStatus)()(insert, state), {
            action: _analytics.ACTION.INSERTED,
            actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: _analytics.ACTION_SUBJECT_ID.STATUS,
            attributes: {
              inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
            },
            eventType: _analytics.EVENT_TYPE.TRACK
          });
        }
      }];
    }
  };
  return plugin;
};

var statusPlugin = function statusPlugin(options) {
  return decorateWithPluginOptions(baseStatusPlugin(options), options);
};

var _default = statusPlugin;
exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _react = _interopRequireDefault(require("react"));

var _prosemirrorUtils = require("prosemirror-utils");

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _actions = require("./actions");

var _main = _interopRequireDefault(require("./pm-plugins/main"));

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var _featureFlagsContext = require("../feature-flags-context");

var _editorDisabled = require("../editor-disabled");

var _assets = require("../quick-insert/assets");

var _analytics = require("../analytics");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _pluginKey = require("./pm-plugins/plugin-key");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || (0, _typeof2.default)(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var DatePicker = (0, _reactLoadable.default)({
  loader: function loader() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require('./ui/DatePicker'));
    }).then(function (mod) {
      return mod.default;
    });
  },
  loading: function loading() {
    return null;
  }
});

var datePlugin = function datePlugin() {
  return {
    name: 'date',
    nodes: function nodes() {
      return [{
        name: 'date',
        node: _adfSchema.date
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'date',
        plugin: function plugin(options) {
          DatePicker.preload();
          return (0, _main.default)(options);
        }
      }, {
        name: 'dateKeymap',
        plugin: function plugin() {
          DatePicker.preload();
          return (0, _keymap.default)();
        }
      }];
    },
    contentComponent: function contentComponent(_ref) {
      var editorView = _ref.editorView,
          dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
          popupsMountPoint = _ref.popupsMountPoint,
          popupsBoundariesElement = _ref.popupsBoundariesElement,
          popupsScrollableElement = _ref.popupsScrollableElement;
      var state = editorView.state,
          dispatch = editorView.dispatch;
      var domAtPos = editorView.domAtPos.bind(editorView);
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          datePlugin: _pluginKey.pluginKey,
          editorDisabledPlugin: _editorDisabled.pluginKey
        },
        render: function render(_ref2) {
          var editorDisabledPlugin = _ref2.editorDisabledPlugin,
              datePlugin = _ref2.datePlugin;

          if (!(datePlugin !== null && datePlugin !== void 0 && datePlugin.showDatePickerAt) || editorDisabledPlugin !== null && editorDisabledPlugin !== void 0 && editorDisabledPlugin.editorDisabled) {
            return null;
          }

          var showDatePickerAt = datePlugin.showDatePickerAt,
              isNew = datePlugin.isNew,
              focusDateInput = datePlugin.focusDateInput;
          var element = (0, _prosemirrorUtils.findDomRefAtPos)(showDatePickerAt, domAtPos);
          var allFlags = (0, _featureFlagsContext.getFeatureFlags)(state);
          var keyboardAccessibleDatepicker = allFlags.keyboardAccessibleDatepicker;
          return /*#__PURE__*/_react.default.createElement(DatePicker, {
            mountTo: popupsMountPoint,
            boundariesElement: popupsBoundariesElement,
            scrollableElement: popupsScrollableElement,
            key: showDatePickerAt,
            showTextField: keyboardAccessibleDatepicker,
            element: element,
            isNew: isNew,
            autoFocus: focusDateInput,
            onDelete: function onDelete() {
              (0, _actions.deleteDate)()(editorView.state, dispatch);
              editorView.focus();
              return;
            },
            onSelect: function onSelect(date, commitMethod) {
              // Undefined means couldn't parse date, null means invalid (out of bounds) date
              if (date === undefined || date === null) {
                return;
              }

              (0, _actions.insertDate)(date, undefined, commitMethod)(editorView.state, dispatch);
              editorView.focus();
            },
            onTextChanged: function onTextChanged(date) {
              (0, _actions.insertDate)(date, undefined, undefined, false)(editorView.state, dispatch);
            },
            closeDatePicker: function closeDatePicker() {
              (0, _actions.closeDatePicker)()(editorView.state, dispatch);
              editorView.focus();
            },
            closeDatePickerWithAnalytics: function closeDatePickerWithAnalytics(_ref3) {
              var date = _ref3.date;
              (0, _actions.closeDatePickerWithAnalytics)({
                date: date
              })(editorView.state, dispatch);
              editorView.focus();
            },
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          });
        }
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref4) {
        var formatMessage = _ref4.formatMessage;
        return [{
          id: 'date',
          title: formatMessage(_messages.messages.date),
          description: formatMessage(_messages.messages.dateDescription),
          priority: 800,
          keywords: ['calendar', 'day', 'time', 'today', '/'],
          keyshortcut: '//',
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconDate, null);
          },
          action: function action(insert, state) {
            var tr = (0, _actions.createDate)(true)(insert, state);
            (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INSERTED,
              actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.DATE,
              eventType: _analytics.EVENT_TYPE.TRACK,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              }
            });
            return tr;
          }
        }];
      }
    }
  };
};

var _default = datePlugin;
exports.default = _default;
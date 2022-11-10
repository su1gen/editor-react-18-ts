"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackerStore = exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var trackerStore = new WeakMap();
exports.trackerStore = trackerStore;
var Tracker = /*#__PURE__*/(0, _createClass2.default)(function Tracker() {
  var _this = this;

  (0, _classCallCheck2.default)(this, Tracker);
  (0, _defineProperty2.default)(this, "update", function (props) {
    _this.subscriptions.forEach(function (cb) {
      return cb(props);
    });
  });
  (0, _defineProperty2.default)(this, "add", function (subscription) {
    _this.subscriptions.push(subscription);
  });
  (0, _defineProperty2.default)(this, "remove", function (subscription) {
    _this.subscriptions = _this.subscriptions.filter(function (s) {
      return s !== subscription;
    });
  });
  this.subscriptions = [];
});
var pluginKey = new _prosemirrorState.PluginKey('viewUpdateSubscriptionKey');

var createViewUpdateSubscriptionPlugin = function createViewUpdateSubscriptionPlugin() {
  var tracker;
  var lastUpdateRef = {
    current: null,
    initial: null,
    transactions: [],
    queued: false
  };
  return {
    name: 'viewUpdateSubscription',
    pmPlugins: function pmPlugins() {
      var createPlugin = function createPlugin() {
        return new _safePlugin.SafePlugin({
          key: pluginKey,
          view: function view(editorView) {
            tracker = trackerStore.get(editorView);

            if (!tracker) {
              tracker = new Tracker();
              trackerStore.set(editorView, tracker);
            }

            return {};
          }
        });
      };

      return [{
        name: 'viewUpdateSubscription',
        plugin: createPlugin
      }];
    },
    onEditorViewStateUpdated: function onEditorViewStateUpdated(props) {
      var _lastUpdateRef$transa;

      lastUpdateRef.current = props;

      (_lastUpdateRef$transa = lastUpdateRef.transactions).push.apply(_lastUpdateRef$transa, (0, _toConsumableArray2.default)(props.transactions));

      if (!lastUpdateRef.queued) {
        lastUpdateRef.initial = props;
        lastUpdateRef.queued = true;
        queueMicrotask(function () {
          if (!lastUpdateRef.current || !lastUpdateRef.initial) {
            return;
          }

          if (tracker) {
            var _lastUpdateRef$initia;

            tracker.update({
              newEditorState: lastUpdateRef.current.newEditorState,
              oldEditorState: (_lastUpdateRef$initia = lastUpdateRef.initial) === null || _lastUpdateRef$initia === void 0 ? void 0 : _lastUpdateRef$initia.oldEditorState,
              transactions: lastUpdateRef.transactions
            });
          }

          lastUpdateRef.queued = false;
          lastUpdateRef.current = null;
          lastUpdateRef.transactions = [];
        });
      }
    }
  };
};

var _default = createViewUpdateSubscriptionPlugin;
exports.default = _default;
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export var trackerStore = new WeakMap();

var Tracker = /*#__PURE__*/_createClass(function Tracker() {
  var _this = this;

  _classCallCheck(this, Tracker);

  _defineProperty(this, "update", function (props) {
    _this.subscriptions.forEach(function (cb) {
      return cb(props);
    });
  });

  _defineProperty(this, "add", function (subscription) {
    _this.subscriptions.push(subscription);
  });

  _defineProperty(this, "remove", function (subscription) {
    _this.subscriptions = _this.subscriptions.filter(function (s) {
      return s !== subscription;
    });
  });

  this.subscriptions = [];
});

var pluginKey = new PluginKey('viewUpdateSubscriptionKey');

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
        return new SafePlugin({
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

      (_lastUpdateRef$transa = lastUpdateRef.transactions).push.apply(_lastUpdateRef$transa, _toConsumableArray(props.transactions));

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

export default createViewUpdateSubscriptionPlugin;
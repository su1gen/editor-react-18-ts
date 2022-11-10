"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _plugin.pluginKey;
  }
});

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _prosemirrorCollab = require("prosemirror-collab");

var _plugin = require("./plugin");

var _sendTransaction = require("./events/send-transaction");

var _analytics = require("./analytics");

var _nativeCollabProviderPlugin = require("./native-collab-provider-plugin");

var providerBuilder = function providerBuilder(collabEditProviderPromise) {
  return /*#__PURE__*/function () {
    var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(codeToExecute, onError) {
      var provider;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return collabEditProviderPromise;

            case 3:
              provider = _context.sent;

              if (!provider) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", codeToExecute(provider));

            case 6:
              _context.next = 11;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);

              if (onError) {
                onError(_context.t0);
              } else {
                // eslint-disable-next-line no-console
                console.error(_context.t0);
              }

            case 11:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
};

var collabEditPlugin = function collabEditPlugin(options) {
  var providerResolver = function providerResolver() {};

  var collabEditProviderPromise = new Promise(function (_providerResolver) {
    providerResolver = _providerResolver;
  });
  var executeProviderCode = providerBuilder(collabEditProviderPromise);
  return {
    name: 'collabEdit',
    pmPlugins: function pmPlugins() {
      var _ref2 = options || {},
          _ref2$useNativePlugin = _ref2.useNativePlugin,
          useNativePlugin = _ref2$useNativePlugin === void 0 ? false : _ref2$useNativePlugin,
          _ref2$userId = _ref2.userId,
          userId = _ref2$userId === void 0 ? null : _ref2$userId;

      return [].concat((0, _toConsumableArray2.default)(useNativePlugin ? [{
        name: 'pmCollab',
        plugin: function plugin() {
          return (0, _prosemirrorCollab.collab)({
            clientID: userId
          });
        }
      }, {
        name: 'nativeCollabProviderPlugin',
        plugin: function plugin() {
          return (0, _nativeCollabProviderPlugin.nativeCollabProviderPlugin)({
            providerPromise: collabEditProviderPromise
          });
        }
      }] : []), [{
        name: 'collab',
        plugin: function plugin(_ref3) {
          var dispatch = _ref3.dispatch,
              providerFactory = _ref3.providerFactory;
          providerFactory && providerFactory.subscribe('collabEditProvider', function (_name, providerPromise) {
            if (providerPromise) {
              providerPromise.then(function (provider) {
                return providerResolver(provider);
              });
            }
          });
          return (0, _plugin.createPlugin)(dispatch, providerFactory, executeProviderCode, options);
        }
      }]);
    },
    onEditorViewStateUpdated: function onEditorViewStateUpdated(props) {
      var addErrorAnalytics = (0, _analytics.addSynchronyErrorAnalytics)(props.newEditorState, props.newEditorState.tr);
      executeProviderCode((0, _sendTransaction.sendTransaction)({
        originalTransaction: props.originalTransaction,
        transactions: props.transactions,
        oldEditorState: props.oldEditorState,
        newEditorState: props.newEditorState,
        useNativePlugin: options && options.useNativePlugin
      }), addErrorAnalytics);
    }
  };
};

var _default = collabEditPlugin;
exports.default = _default;
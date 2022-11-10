import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { collab } from 'prosemirror-collab';
import { createPlugin, pluginKey } from './plugin';
import { sendTransaction } from './events/send-transaction';
import { addSynchronyErrorAnalytics } from './analytics';
import { nativeCollabProviderPlugin } from './native-collab-provider-plugin';
export { pluginKey };

var providerBuilder = function providerBuilder(collabEditProviderPromise) {
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(codeToExecute, onError) {
      var provider;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
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

      return [].concat(_toConsumableArray(useNativePlugin ? [{
        name: 'pmCollab',
        plugin: function plugin() {
          return collab({
            clientID: userId
          });
        }
      }, {
        name: 'nativeCollabProviderPlugin',
        plugin: function plugin() {
          return nativeCollabProviderPlugin({
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
          return createPlugin(dispatch, providerFactory, executeProviderCode, options);
        }
      }]);
    },
    onEditorViewStateUpdated: function onEditorViewStateUpdated(props) {
      var addErrorAnalytics = addSynchronyErrorAnalytics(props.newEditorState, props.newEditorState.tr);
      executeProviderCode(sendTransaction({
        originalTransaction: props.originalTransaction,
        transactions: props.transactions,
        oldEditorState: props.oldEditorState,
        newEditorState: props.newEditorState,
        useNativePlugin: options && options.useNativePlugin
      }), addErrorAnalytics);
    }
  };
};

export default collabEditPlugin;
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import memoizeOne from 'memoize-one';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { pluginKey } from './plugin-key';
import { searchQuickInsertItems } from './search';
import ModalElementBrowser from './ui/ModalElementBrowser';
export { pluginKey };

var quickInsertPlugin = function quickInsertPlugin(options) {
  return {
    name: 'quickInsert',
    pmPlugins: function pmPlugins(quickInsert) {
      return [{
        name: 'quickInsert',
        // It's important that this plugin is above TypeAheadPlugin
        plugin: function plugin(_ref) {
          var providerFactory = _ref.providerFactory,
              getIntl = _ref.getIntl,
              dispatch = _ref.dispatch;
          return quickInsertPluginFactory(quickInsert, providerFactory, getIntl, dispatch, options === null || options === void 0 ? void 0 : options.emptyStateHandler);
        }
      }];
    },
    pluginsOptions: {
      typeAhead: {
        id: TypeAheadAvailableNodes.QUICK_INSERT,
        trigger: '/',
        headless: options ? options.headless : undefined,
        getItems: function getItems(_ref2) {
          var query = _ref2.query,
              editorState = _ref2.editorState;
          var quickInsertState = pluginKey.getState(editorState);
          return Promise.resolve(searchQuickInsertItems(quickInsertState, options)(query));
        },
        selectItem: function selectItem(state, item, insert) {
          return item.action(insert, state);
        }
      }
    },
    contentComponent: function contentComponent(_ref3) {
      var editorView = _ref3.editorView;

      if (options && options.enableElementBrowser) {
        return /*#__PURE__*/React.createElement(ModalElementBrowser, {
          editorView: editorView,
          helpUrl: options.elementBrowserHelpUrl
        });
      }

      return null;
    }
  };
};

export default quickInsertPlugin;

var processItems = function processItems(items, intl, extendedActions) {
  var reducedItems = items.reduce(function (acc, item) {
    if (typeof item === 'function') {
      var quickInsertItems = item(intl);
      return acc.concat(quickInsertItems);
    }

    return acc.concat(item);
  }, []);
  return extendQuickInsertAction(reducedItems, extendedActions);
};

export var memoProcessItems = memoizeOne(processItems);
/**
 * Allows for extending the quickInsertItems actions with the provided extendedActions.
 * The provided extended action will then be called after the original action is executed.
 * This is useful for mobile communications where we need to talk to the mobile bridge.
 */

var extendQuickInsertAction = function extendQuickInsertAction(quickInsertItems, extendedActions) {
  if (!extendedActions) {
    return quickInsertItems;
  }

  return quickInsertItems.map(function (quickInsertItem) {
    var quickInsertId = quickInsertItem.id;

    if (quickInsertId && extendedActions[quickInsertId]) {
      var originalAction = quickInsertItem.action;

      quickInsertItem.action = function (insert, state) {
        var result = originalAction(insert, state);
        extendedActions[quickInsertId](quickInsertItem);
        return result;
      };
    }

    return quickInsertItem;
  });
};

var setProviderState = function setProviderState(providerState) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(pluginKey, providerState));
    }

    return true;
  };
};

function quickInsertPluginFactory(quickInsertItems, providerFactory, getIntl, dispatch, emptyStateHandler) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        return {
          isElementBrowserModalOpen: false,
          emptyStateHandler: emptyStateHandler,
          // lazy so it doesn't run on editor initialization
          // memo here to avoid using a singleton cache, avoids editor
          // getting confused when two editors exist within the same page.
          lazyDefaultItems: function lazyDefaultItems() {
            return memoProcessItems(quickInsertItems || [], getIntl());
          }
        };
      },
      apply: function apply(tr, pluginState) {
        var meta = tr.getMeta(pluginKey);

        if (meta) {
          var keys = Object.keys(meta);
          var changed = keys.some(function (key) {
            return pluginState[key] !== meta[key];
          });

          if (changed) {
            var newState = _objectSpread(_objectSpread({}, pluginState), meta);

            dispatch(pluginKey, newState);
            return newState;
          }
        }

        return pluginState;
      }
    },
    view: function view(editorView) {
      var providerHandler = /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_name, providerPromise) {
          var provider, providedItems;
          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!providerPromise) {
                    _context.next = 14;
                    break;
                  }

                  _context.prev = 1;
                  _context.next = 4;
                  return providerPromise;

                case 4:
                  provider = _context.sent;
                  _context.next = 7;
                  return provider.getItems();

                case 7:
                  providedItems = _context.sent;
                  setProviderState({
                    provider: provider,
                    providedItems: providedItems
                  })(editorView.state, editorView.dispatch);
                  _context.next = 14;
                  break;

                case 11:
                  _context.prev = 11;
                  _context.t0 = _context["catch"](1);
                  // eslint-disable-next-line no-console
                  console.error('Error getting items from quick insert provider', _context.t0);

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[1, 11]]);
        }));

        return function providerHandler(_x, _x2) {
          return _ref4.apply(this, arguments);
        };
      }();

      providerFactory.subscribe('quickInsertProvider', providerHandler);
      return {
        destroy: function destroy() {
          providerFactory.unsubscribe('quickInsertProvider', providerHandler);
        }
      };
    }
  });
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineQuickInsertProviders = combineQuickInsertProviders;
exports.extensionProviderToQuickInsertProvider = extensionProviderToQuickInsertProvider;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireDefault(require("react"));

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _extensions = require("@atlaskit/editor-common/extensions");

var _providerHelpers = require("@atlaskit/editor-common/provider-helpers");

var _enums = require("../plugins/analytics/types/enums");

var _analytics = require("../plugins/analytics");

/**
 * Utils to send analytics event when a extension is inserted using quickInsert
 */
function sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent) {
  if (createAnalyticsEvent) {
    (0, _analytics.fireAnalyticsEvent)(createAnalyticsEvent)({
      payload: {
        action: _enums.ACTION.INSERTED,
        actionSubject: _enums.ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: _enums.ACTION_SUBJECT_ID.EXTENSION,
        attributes: {
          extensionType: item.extensionType,
          key: item.key,
          inputMethod: _enums.INPUT_METHOD.QUICK_INSERT
        },
        eventType: _enums.EVENT_TYPE.TRACK
      }
    });
  }
}

function extensionProviderToQuickInsertProvider(_x, _x2, _x3) {
  return _extensionProviderToQuickInsertProvider.apply(this, arguments);
}

function _extensionProviderToQuickInsertProvider() {
  _extensionProviderToQuickInsertProvider = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(extensionProvider, editorActions, createAnalyticsEvent) {
    var extensions;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return extensionProvider.getExtensions();

          case 2:
            extensions = _context.sent;
            return _context.abrupt("return", {
              getItems: function getItems() {
                var quickInsertItems = (0, _extensions.getQuickInsertItemsFromModule)(extensions, function (item) {
                  var Icon = (0, _reactLoadable.default)({
                    loader: item.icon,
                    loading: function loading() {
                      return null;
                    }
                  });
                  return {
                    title: item.title,
                    description: item.description,
                    icon: function icon() {
                      return /*#__PURE__*/_react.default.createElement(Icon, {
                        label: ""
                      });
                    },
                    keywords: item.keywords,
                    featured: item.featured,
                    categories: item.categories,
                    action: function action(insert) {
                      if (typeof item.node === 'function') {
                        (0, _extensions.resolveImport)(item.node()).then(function (node) {
                          sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent);

                          if (node) {
                            editorActions.replaceSelection(node);
                          }
                        });
                        return insert('');
                      } else {
                        sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent);
                        return insert(item.node);
                      }
                    }
                  };
                });
                return Promise.all(quickInsertItems);
              }
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _extensionProviderToQuickInsertProvider.apply(this, arguments);
}

function combineQuickInsertProviders(_x4) {
  return _combineQuickInsertProviders.apply(this, arguments);
}

function _combineQuickInsertProviders() {
  _combineQuickInsertProviders = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(quickInsertProviders) {
    var _combineProviders, invokeList;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _combineProviders = (0, _providerHelpers.combineProviders)(quickInsertProviders), invokeList = _combineProviders.invokeList;
            return _context2.abrupt("return", {
              getItems: function getItems() {
                return invokeList('getItems');
              }
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _combineQuickInsertProviders.apply(this, arguments);
}
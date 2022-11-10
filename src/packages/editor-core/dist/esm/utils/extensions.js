import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import React from 'react';
import Loadable from 'react-loadable';
import { getQuickInsertItemsFromModule, resolveImport } from '@atlaskit/editor-common/extensions';
import { combineProviders } from '@atlaskit/editor-common/provider-helpers';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../plugins/analytics/types/enums';
import { fireAnalyticsEvent } from '../plugins/analytics';
/**
 * Utils to send analytics event when a extension is inserted using quickInsert
 */

function sendExtensionQuickInsertAnalytics(item, createAnalyticsEvent) {
  if (createAnalyticsEvent) {
    fireAnalyticsEvent(createAnalyticsEvent)({
      payload: {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.EXTENSION,
        attributes: {
          extensionType: item.extensionType,
          key: item.key,
          inputMethod: INPUT_METHOD.QUICK_INSERT
        },
        eventType: EVENT_TYPE.TRACK
      }
    });
  }
}

export function extensionProviderToQuickInsertProvider(_x, _x2, _x3) {
  return _extensionProviderToQuickInsertProvider.apply(this, arguments);
}

function _extensionProviderToQuickInsertProvider() {
  _extensionProviderToQuickInsertProvider = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(extensionProvider, editorActions, createAnalyticsEvent) {
    var extensions;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return extensionProvider.getExtensions();

          case 2:
            extensions = _context.sent;
            return _context.abrupt("return", {
              getItems: function getItems() {
                var quickInsertItems = getQuickInsertItemsFromModule(extensions, function (item) {
                  var Icon = Loadable({
                    loader: item.icon,
                    loading: function loading() {
                      return null;
                    }
                  });
                  return {
                    title: item.title,
                    description: item.description,
                    icon: function icon() {
                      return /*#__PURE__*/React.createElement(Icon, {
                        label: ""
                      });
                    },
                    keywords: item.keywords,
                    featured: item.featured,
                    categories: item.categories,
                    action: function action(insert) {
                      if (typeof item.node === 'function') {
                        resolveImport(item.node()).then(function (node) {
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

export function combineQuickInsertProviders(_x4) {
  return _combineQuickInsertProviders.apply(this, arguments);
}

function _combineQuickInsertProviders() {
  _combineQuickInsertProviders = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(quickInsertProviders) {
    var _combineProviders, invokeList;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _combineProviders = combineProviders(quickInsertProviders), invokeList = _combineProviders.invokeList;
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
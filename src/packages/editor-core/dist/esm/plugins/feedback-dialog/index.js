import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { PluginKey } from 'prosemirror-state';
import { IconFeedback } from '../quick-insert/assets';
import { version as coreVersion } from '../../version-wrapper';
import { addAnalytics, ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE } from '../analytics';
import loadJiraCollectorDialogScript from './loadJiraCollectorDialogScript';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
export var pluginKey = new PluginKey('feedbackDialogPlugin');
var showJiraCollectorDialog;
var feedbackInfoHash;
var defaultFeedbackInfo;

var hashFeedbackInfo = function hashFeedbackInfo(feedbackInfo) {
  var product = feedbackInfo.product,
      packageName = feedbackInfo.packageName,
      packageVersion = feedbackInfo.packageVersion,
      labels = feedbackInfo.labels;
  return [product, packageName, packageVersion].concat(_toConsumableArray(labels || [])).join('|');
};

export var openFeedbackDialog = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(feedbackInfo) {
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(resolve, reject) {
                var combinedFeedbackInfo, newFeedbackInfoHash, timeoutId;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        combinedFeedbackInfo = _objectSpread(_objectSpread(_objectSpread({}, {
                          product: 'n/a',
                          labels: [],
                          packageName: '',
                          packageVersion: '',
                          sessionId: '',
                          contentId: '',
                          tabId: ''
                        }), defaultFeedbackInfo), feedbackInfo);
                        newFeedbackInfoHash = hashFeedbackInfo(combinedFeedbackInfo);

                        if (!(!showJiraCollectorDialog || feedbackInfoHash !== newFeedbackInfoHash)) {
                          _context.next = 13;
                          break;
                        }

                        _context.prev = 3;
                        _context.next = 6;
                        return loadJiraCollectorDialogScript([combinedFeedbackInfo.product].concat(_toConsumableArray(combinedFeedbackInfo.labels)), combinedFeedbackInfo.packageName, coreVersion, combinedFeedbackInfo.packageVersion, combinedFeedbackInfo.sessionId, combinedFeedbackInfo.contentId, combinedFeedbackInfo.tabId);

                      case 6:
                        showJiraCollectorDialog = _context.sent;
                        feedbackInfoHash = newFeedbackInfoHash;
                        _context.next = 13;
                        break;

                      case 10:
                        _context.prev = 10;
                        _context.t0 = _context["catch"](3);
                        reject(_context.t0);

                      case 13:
                        timeoutId = window.setTimeout(showJiraCollectorDialog, 0); // Return the timoutId for consumers to call clearTimeout if they need to.

                        resolve(timeoutId);

                      case 15:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee, null, [[3, 10]]);
              }));

              return function (_x2, _x3) {
                return _ref2.apply(this, arguments);
              };
            }()));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function openFeedbackDialog(_x) {
    return _ref.apply(this, arguments);
  };
}();

var feedbackDialog = function feedbackDialog(feedbackInfo) {
  defaultFeedbackInfo = feedbackInfo;
  return {
    name: 'feedbackDialog',
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'feedbackdialog',
          title: formatMessage(messages.feedbackDialog),
          description: formatMessage(messages.feedbackDialogDescription),
          priority: 400,
          keywords: ['bug'],
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconFeedback, null);
          },
          action: function action(insert, state) {
            var tr = insert('');
            openFeedbackDialog(feedbackInfo);
            return addAnalytics(state, tr, {
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.FEEDBACK_DIALOG,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              },
              eventType: EVENT_TYPE.UI
            });
          }
        }];
      }
    }
  };
};

export default feedbackDialog;
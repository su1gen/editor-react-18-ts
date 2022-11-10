"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.openFeedbackDialog = exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _prosemirrorState = require("prosemirror-state");

var _assets = require("../quick-insert/assets");

var _versionWrapper = require("../../version-wrapper");

var _analytics = require("../analytics");

var _loadJiraCollectorDialogScript = _interopRequireDefault(require("./loadJiraCollectorDialogScript"));

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var pluginKey = new _prosemirrorState.PluginKey('feedbackDialogPlugin');
exports.pluginKey = pluginKey;
var showJiraCollectorDialog;
var feedbackInfoHash;
var defaultFeedbackInfo;

var hashFeedbackInfo = function hashFeedbackInfo(feedbackInfo) {
  var product = feedbackInfo.product,
      packageName = feedbackInfo.packageName,
      packageVersion = feedbackInfo.packageVersion,
      labels = feedbackInfo.labels;
  return [product, packageName, packageVersion].concat((0, _toConsumableArray2.default)(labels || [])).join('|');
};

var openFeedbackDialog = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(feedbackInfo) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise( /*#__PURE__*/function () {
              var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(resolve, reject) {
                var combinedFeedbackInfo, newFeedbackInfoHash, timeoutId;
                return _regenerator.default.wrap(function _callee$(_context) {
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
                        return (0, _loadJiraCollectorDialogScript.default)([combinedFeedbackInfo.product].concat((0, _toConsumableArray2.default)(combinedFeedbackInfo.labels)), combinedFeedbackInfo.packageName, _versionWrapper.version, combinedFeedbackInfo.packageVersion, combinedFeedbackInfo.sessionId, combinedFeedbackInfo.contentId, combinedFeedbackInfo.tabId);

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

exports.openFeedbackDialog = openFeedbackDialog;

var feedbackDialog = function feedbackDialog(feedbackInfo) {
  defaultFeedbackInfo = feedbackInfo;
  return {
    name: 'feedbackDialog',
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'feedbackdialog',
          title: formatMessage(_messages.messages.feedbackDialog),
          description: formatMessage(_messages.messages.feedbackDialogDescription),
          priority: 400,
          keywords: ['bug'],
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconFeedback, null);
          },
          action: function action(insert, state) {
            var tr = insert('');
            openFeedbackDialog(feedbackInfo);
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.OPENED,
              actionSubject: _analytics.ACTION_SUBJECT.FEEDBACK_DIALOG,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.UI
            });
          }
        }];
      }
    }
  };
};

var _default = feedbackDialog;
exports.default = _default;
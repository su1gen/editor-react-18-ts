"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _main = require("./pm-plugins/main");

var pastePlugin = function pastePlugin(_ref) {
  var cardOptions = _ref.cardOptions,
      sanitizePrivateContent = _ref.sanitizePrivateContent,
      plainTextPasteLinkification = _ref.plainTextPasteLinkification;
  return {
    name: 'paste',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'paste',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              providerFactory = _ref2.providerFactory,
              dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent,
              dispatch = _ref2.dispatch;
          return (0, _main.createPlugin)(schema, dispatchAnalyticsEvent, dispatch, plainTextPasteLinkification, cardOptions, sanitizePrivateContent, providerFactory);
        }
      }];
    }
  };
};

var _default = pastePlugin;
exports.default = _default;
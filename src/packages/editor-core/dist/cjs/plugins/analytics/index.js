"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ACTION", {
  enumerable: true,
  get: function get() {
    return _analytics.ACTION;
  }
});
Object.defineProperty(exports, "ACTION_SUBJECT", {
  enumerable: true,
  get: function get() {
    return _analytics.ACTION_SUBJECT;
  }
});
Object.defineProperty(exports, "ACTION_SUBJECT_ID", {
  enumerable: true,
  get: function get() {
    return _analytics.ACTION_SUBJECT_ID;
  }
});
Object.defineProperty(exports, "BROWSER_FREEZE_INTERACTION_TYPE", {
  enumerable: true,
  get: function get() {
    return _analytics.BROWSER_FREEZE_INTERACTION_TYPE;
  }
});
Object.defineProperty(exports, "DELETE_DIRECTION", {
  enumerable: true,
  get: function get() {
    return _analytics.DELETE_DIRECTION;
  }
});
Object.defineProperty(exports, "EVENT_TYPE", {
  enumerable: true,
  get: function get() {
    return _analytics.EVENT_TYPE;
  }
});
Object.defineProperty(exports, "FULL_WIDTH_MODE", {
  enumerable: true,
  get: function get() {
    return _analytics.FULL_WIDTH_MODE;
  }
});
Object.defineProperty(exports, "INDENT_DIRECTION", {
  enumerable: true,
  get: function get() {
    return _analytics.INDENT_DIRECTION;
  }
});
Object.defineProperty(exports, "INDENT_TYPE", {
  enumerable: true,
  get: function get() {
    return _analytics.INDENT_TYPE;
  }
});
Object.defineProperty(exports, "INPUT_METHOD", {
  enumerable: true,
  get: function get() {
    return _analytics.INPUT_METHOD;
  }
});
Object.defineProperty(exports, "LINK_REPRESENTATION", {
  enumerable: true,
  get: function get() {
    return _analytics.LINK_REPRESENTATION;
  }
});
Object.defineProperty(exports, "LINK_RESOURCE", {
  enumerable: true,
  get: function get() {
    return _analytics.LINK_RESOURCE;
  }
});
Object.defineProperty(exports, "LINK_STATUS", {
  enumerable: true,
  get: function get() {
    return _analytics.LINK_STATUS;
  }
});
Object.defineProperty(exports, "LIST_TEXT_SCENARIOS", {
  enumerable: true,
  get: function get() {
    return _analytics.LIST_TEXT_SCENARIOS;
  }
});
Object.defineProperty(exports, "MODE", {
  enumerable: true,
  get: function get() {
    return _analytics.MODE;
  }
});
Object.defineProperty(exports, "PLATFORMS", {
  enumerable: true,
  get: function get() {
    return _analytics.PLATFORMS;
  }
});
Object.defineProperty(exports, "PUNC", {
  enumerable: true,
  get: function get() {
    return _analytics.PUNC;
  }
});
Object.defineProperty(exports, "PasteContents", {
  enumerable: true,
  get: function get() {
    return _analytics.PasteContents;
  }
});
Object.defineProperty(exports, "PasteSources", {
  enumerable: true,
  get: function get() {
    return _analytics.PasteSources;
  }
});
Object.defineProperty(exports, "PasteTypes", {
  enumerable: true,
  get: function get() {
    return _analytics.PasteTypes;
  }
});
Object.defineProperty(exports, "SYMBOL", {
  enumerable: true,
  get: function get() {
    return _analytics.SYMBOL;
  }
});
Object.defineProperty(exports, "TABLE_ACTION", {
  enumerable: true,
  get: function get() {
    return _analytics.TABLE_ACTION;
  }
});
Object.defineProperty(exports, "TABLE_BREAKOUT", {
  enumerable: true,
  get: function get() {
    return _analytics.TABLE_BREAKOUT;
  }
});
Object.defineProperty(exports, "TRIGGER_METHOD", {
  enumerable: true,
  get: function get() {
    return _analytics.TRIGGER_METHOD;
  }
});
Object.defineProperty(exports, "USER_CONTEXT", {
  enumerable: true,
  get: function get() {
    return _analytics.USER_CONTEXT;
  }
});
Object.defineProperty(exports, "addAnalytics", {
  enumerable: true,
  get: function get() {
    return _utils.addAnalytics;
  }
});
exports.default = exports.analyticsPluginKey = void 0;
Object.defineProperty(exports, "findInsertLocation", {
  enumerable: true,
  get: function get() {
    return _utils.findInsertLocation;
  }
});
Object.defineProperty(exports, "fireAnalyticsEvent", {
  enumerable: true,
  get: function get() {
    return _fireAnalyticsEvent.fireAnalyticsEvent;
  }
});
Object.defineProperty(exports, "getAnalyticsEventsFromTransaction", {
  enumerable: true,
  get: function get() {
    return _utils.getAnalyticsEventsFromTransaction;
  }
});
Object.defineProperty(exports, "getSelectionType", {
  enumerable: true,
  get: function get() {
    return _utils.getSelectionType;
  }
});
Object.defineProperty(exports, "getStateContext", {
  enumerable: true,
  get: function get() {
    return _utils.getStateContext;
  }
});
Object.defineProperty(exports, "mapActionSubjectIdToAttributes", {
  enumerable: true,
  get: function get() {
    return _utils.mapActionSubjectIdToAttributes;
  }
});
Object.defineProperty(exports, "withAnalytics", {
  enumerable: true,
  get: function get() {
    return _utils.withAnalytics;
  }
});

var _plugin = _interopRequireDefault(require("./plugin"));

var _pluginKey = require("./plugin-key");

var _analytics = require("@atlaskit/editor-common/analytics");

var _utils = require("./utils");

var _fireAnalyticsEvent = require("./fire-analytics-event");

var analyticsPluginKey = _pluginKey.analyticsPluginKey;
exports.analyticsPluginKey = analyticsPluginKey;
var _default = _plugin.default;
exports.default = _default;
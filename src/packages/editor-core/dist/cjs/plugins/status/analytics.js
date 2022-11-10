"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStatusAnalyticsAndFire = exports.analyticsState = exports.FABRIC_CHANNEL = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _versionWrapper = require("../../version-wrapper");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var FABRIC_CHANNEL = 'fabric-elements';
exports.FABRIC_CHANNEL = FABRIC_CHANNEL;

var createStatusAnalyticsAndFire = function createStatusAnalyticsAndFire(createAnalyticsEvent) {
  return function (payload) {
    if (createAnalyticsEvent && payload) {
      var statusPayload = _objectSpread(_objectSpread({}, payload), {}, {
        eventType: 'ui'
      });

      if (!statusPayload.attributes) {
        statusPayload.attributes = {};
      }

      statusPayload.attributes.packageName = _versionWrapper.name;
      statusPayload.attributes.packageVersion = _versionWrapper.version;
      statusPayload.attributes.componentName = 'status';
      createAnalyticsEvent(statusPayload).fire(FABRIC_CHANNEL);
    }
  };
};

exports.createStatusAnalyticsAndFire = createStatusAnalyticsAndFire;

var analyticsState = function analyticsState(isNew) {
  return isNew ? 'new' : 'update';
};

exports.analyticsState = analyticsState;
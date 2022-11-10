import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { name as packageName, version as packageVersion } from '../../version-wrapper';
export var FABRIC_CHANNEL = 'fabric-elements';
export var createStatusAnalyticsAndFire = function createStatusAnalyticsAndFire(createAnalyticsEvent) {
  return function (payload) {
    if (createAnalyticsEvent && payload) {
      var statusPayload = _objectSpread(_objectSpread({}, payload), {}, {
        eventType: 'ui'
      });

      if (!statusPayload.attributes) {
        statusPayload.attributes = {};
      }

      statusPayload.attributes.packageName = packageName;
      statusPayload.attributes.packageVersion = packageVersion;
      statusPayload.attributes.componentName = 'status';
      createAnalyticsEvent(statusPayload).fire(FABRIC_CHANNEL);
    }
  };
};
export var analyticsState = function analyticsState(isNew) {
  return isNew ? 'new' : 'update';
};
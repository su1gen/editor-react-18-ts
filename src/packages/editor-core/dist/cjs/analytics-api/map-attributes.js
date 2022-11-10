"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapActionSubjectIdToAttributes = mapActionSubjectIdToAttributes;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _analytics = require("@atlaskit/editor-common/analytics");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function mapActionSubjectIdToAttributes(payload) {
  var documentInserted = payload.action === _analytics.ACTION.INSERTED && payload.actionSubject === _analytics.ACTION_SUBJECT.DOCUMENT;
  var textFormatted = payload.action === _analytics.ACTION.FORMATTED && payload.actionSubject === _analytics.ACTION_SUBJECT.TEXT;
  var hasActionSubjectId = !!payload.actionSubjectId;

  if (hasActionSubjectId && (documentInserted || textFormatted)) {
    payload.attributes = _objectSpread(_objectSpread({}, payload.attributes), {}, {
      // @ts-expect-error
      actionSubjectId: payload.actionSubjectId
    });
  }

  return payload;
}
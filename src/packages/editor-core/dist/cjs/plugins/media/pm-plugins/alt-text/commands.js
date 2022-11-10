"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateAltText = exports.openMediaAltTextMenu = exports.closeMediaAltTextMenu = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ = require(".");

var _mediaCommon = require("../../utils/media-common");

var _analytics = require("../../../analytics");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createCommandWithAnalytics = function createCommandWithAnalytics(actionType, action, transform) {
  return (0, _analytics.withAnalytics)({
    action: actionType,
    actionSubject: _analytics.ACTION_SUBJECT.MEDIA,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.ALT_TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK
  })((0, _.createCommand)(action, transform));
};

var closeMediaAltTextMenu = (0, _.createCommand)(function (state) {
  if ((0, _mediaCommon.isSelectionMediaSingleNode)(state)) {
    return {
      type: 'closeMediaAltTextMenu'
    };
  }

  return false;
});
exports.closeMediaAltTextMenu = closeMediaAltTextMenu;
var openMediaAltTextMenu = createCommandWithAnalytics(_analytics.ACTION.OPENED, function (state) {
  if ((0, _mediaCommon.isSelectionMediaSingleNode)(state)) {
    return {
      type: 'openMediaAltTextMenu'
    };
  }

  return false;
}, function (tr) {
  return tr.setMeta('scrollIntoView', false);
});
exports.openMediaAltTextMenu = openMediaAltTextMenu;

var updateAltText = function updateAltText(newAltText) {
  return (0, _.createCommand)(function (state) {
    return (0, _mediaCommon.isSelectionMediaSingleNode)(state) ? {
      type: 'updateAltText'
    } : false;
  }, function (tr, state) {
    var mediaNode = (0, _mediaCommon.getMediaNodeFromSelection)(state);
    var pos = tr.selection.from + 1;

    if (mediaNode) {
      tr.setMeta('scrollIntoView', false);
      tr.setNodeMarkup(pos, undefined, _objectSpread(_objectSpread({}, mediaNode.attrs), {}, {
        alt: newAltText
      }));
    }

    return tr;
  });
};

exports.updateAltText = updateAltText;
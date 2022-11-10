"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformTimeStamp = void 0;

var _formatDistance = _interopRequireDefault(require("date-fns/formatDistance"));

var _differenceInCalendarDays = _interopRequireDefault(require("date-fns/differenceInCalendarDays"));

var _format = _interopRequireDefault(require("date-fns/format"));

var _messages = _interopRequireDefault(require("../../messages"));

var renderAbsoluteOrRelativeDate = function renderAbsoluteOrRelativeDate(timeStamp, pageAction, intl) {
  var pageActionText = '';

  switch (pageAction) {
    case 'updated':
      pageActionText = intl.formatMessage(_messages.default.timeUpdated);
      break;

    case 'viewed':
      pageActionText = intl.formatMessage(_messages.default.timeViewed);
      break;
  }

  if ((0, _differenceInCalendarDays.default)(timeStamp, Date.now()) < -7) {
    return {
      pageAction: pageActionText,
      dateString: (0, _format.default)(timeStamp, 'MMMM dd, yyyy')
    };
  }

  return {
    pageAction: pageActionText,
    dateString: (0, _formatDistance.default)(timeStamp, Date.now()),
    timeSince: intl.formatMessage(_messages.default.timeAgo)
  };
};

var transformTimeStamp = function transformTimeStamp(intl, lastViewedDate, lastUpdatedDate) {
  if (lastViewedDate) {
    return renderAbsoluteOrRelativeDate(lastViewedDate, 'viewed', intl);
  }

  if (lastUpdatedDate) {
    return renderAbsoluteOrRelativeDate(lastUpdatedDate, 'updated', intl);
  }
};

exports.transformTimeStamp = transformTimeStamp;
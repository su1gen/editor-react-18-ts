import formatDistance from 'date-fns/formatDistance';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import messages from '../../messages';

var renderAbsoluteOrRelativeDate = function renderAbsoluteOrRelativeDate(timeStamp, pageAction, intl) {
  var pageActionText = '';

  switch (pageAction) {
    case 'updated':
      pageActionText = intl.formatMessage(messages.timeUpdated);
      break;

    case 'viewed':
      pageActionText = intl.formatMessage(messages.timeViewed);
      break;
  }

  if (differenceInCalendarDays(timeStamp, Date.now()) < -7) {
    return {
      pageAction: pageActionText,
      dateString: format(timeStamp, 'MMMM dd, yyyy')
    };
  }

  return {
    pageAction: pageActionText,
    dateString: formatDistance(timeStamp, Date.now()),
    timeSince: intl.formatMessage(messages.timeAgo)
  };
};

export var transformTimeStamp = function transformTimeStamp(intl, lastViewedDate, lastUpdatedDate) {
  if (lastViewedDate) {
    return renderAbsoluteOrRelativeDate(lastViewedDate, 'viewed', intl);
  }

  if (lastUpdatedDate) {
    return renderAbsoluteOrRelativeDate(lastUpdatedDate, 'updated', intl);
  }
};
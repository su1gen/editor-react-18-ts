import { createLocalizationProvider } from '@atlaskit/locale';

/**
 * Attempt to parse a string representing a date in a particular locale to a date object
 * @param dateString The string representing the date in the given locale, eg '02/12/2000'
 * @param l10n The localisation provider created by createLocalizationProvider
 * @returns Editor DateType when can parse, null when can't parse or invalid
 */
export function parseDateType(dateString, locale) {
  try {
    var l10n = createLocalizationProvider(locale);
    var date = l10n.parseDate(dateString); // If date is invalid

    if (isNaN(date.getTime())) {
      return null;
    }

    var year = date.getFullYear();

    if (year < 1000 || year > 9999) {
      return null;
    }

    var dateObj = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: year
    };
    return dateObj;
  } catch (e) {
    return null;
  }
}
/**
 * Convert an EditorDateType to a date string string formatted for a particular locale
 * @param date The date object
 * @param locale The locale code string (eg. "en-AU")
 * @returns Date string, eg "25/5/20"
 */

export function formatDateType(date, locale) {
  var day = date.day,
      month = date.month,
      year = date.year;
  var l10n = createLocalizationProvider(locale); // The JS Date api represents month as a number between 0-11 :)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

  var dateObj = new Date(year, month - 1, day);
  return l10n.formatDate(dateObj);
}
/**
 * Convert an Editor DateType to a JavaScript Date object
 * @param date Editor DateType
 * @returns JavaScript Date object
 */

export function dateTypeToDate(date) {
  var day = date.day,
      month = date.month,
      year = date.year; // The JS Date api represents month as a number between 0-11 :)
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date

  var dateObj = new Date(year, month - 1, day);
  return dateObj;
}
/**
 * Convert a JavaScript Date to an editor DateType
 * @param date JavaScript Date object
 * @returns Editor DateType
 */

export function dateToDateType(date) {
  var dateObj = {
    day: date.getDate(),
    // The JS Date api represents month as a number between 0-11 :)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
  return dateObj;
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adjustDate = adjustDate;
exports.findDateSegmentByPosition = findDateSegmentByPosition;
exports.getLocaleDatePlaceholder = getLocaleDatePlaceholder;
exports.isDatePossiblyValid = isDatePossiblyValid;
exports.isToday = isToday;
exports.padToTwo = padToTwo;

var _formatParse = require("./formatParse");

var _addDays = _interopRequireDefault(require("date-fns/addDays"));

var _addMonths = _interopRequireDefault(require("date-fns/addMonths"));

var _addYears = _interopRequireDefault(require("date-fns/addYears"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function padToTwo(number) {
  return number <= 99 ? "0".concat(number).slice(-2) : "".concat(number);
}

function isDigit(c) {
  if (c === undefined) {
    return false;
  }

  return c >= '0' && c <= '9';
}
/**
 * Check if cursor is in first segment of a date.
 * @param cursorPos Cursor pos, with 0 referring to the left of first char
 * @param date Date string in any locale
 */


function isCursorInFirstDateSegment(cursorPos, date) {
  var posCounter = cursorPos - 1;
  var isAdjacent = true; // The date without any non-digit characters on the end

  var strippedDate = date.replace(/[^0-9]+$/g, '');

  while (posCounter >= 0 && isAdjacent) {
    var c = strippedDate[posCounter];

    if (!isDigit(c)) {
      isAdjacent = false;
    }

    posCounter -= 1;
  }

  return isAdjacent;
}
/**
 * Check if cursor is in last segment of a date.
 * @param cursorPos Cursor pos, with 0 referring to the left of first char
 * @param date Date string in any locale
 */


function isCursorInLastDateSegment(cursorPos, date) {
  var posCounter = cursorPos;
  var isAdjacent = true; // The date without any non-digit characters on the end

  var strippedDate = date.replace(/[^0-9]+$/g, '');

  while (posCounter < strippedDate.length && isAdjacent) {
    var c = strippedDate[posCounter];

    if (!isDigit(c)) {
      isAdjacent = false;
    }

    posCounter += 1;
  }

  return isAdjacent;
}
/**
 * Inconclusively check if a date string is valid - a value of false means it is definitely
 * invalid, a value of true means it might be valid.
 * @param date Date string to be parsed
 */


function isDatePossiblyValid(date) {
  var _iterator = _createForOfIteratorHelper(date),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var c = _step.value;
      var isNumber = c >= '0' && c <= '9';
      var isValidPunctuation = '. ,/'.indexOf(c) !== -1;

      if (!(isNumber || isValidPunctuation)) {
        return false;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return true;
}
/**
 * Find the segment of a date a position refers to. Eg: pos 2 in 29/03/2020 is in
 * the day segment.
 * @param position Cursor position, with 0 referring to the left of the first char
 * @param date The localised date string
 * @param locale The language to interpret the date string in
 */


function findDateSegmentByPosition(position, date, locale) {
  if (position > date.length) {
    return undefined;
  }

  var placeholder = getLocaleDatePlaceholder(locale);

  if (!placeholder) {
    return undefined;
  } // The placeholder without any non-digit characters on the end


  var strippedPlaceholder = placeholder.replace(/[^ymd]+$/g, '');
  var keyToSegment = {
    d: 'day',
    m: 'month',
    y: 'year'
  };
  var firstSegment = keyToSegment[strippedPlaceholder[0]];
  var lastSegment = keyToSegment[strippedPlaceholder[strippedPlaceholder.length - 1]];
  var allPossibleSegments = ['day', 'month', 'year'];
  var middleSegment = allPossibleSegments.filter(function (s) {
    return s !== firstSegment && s !== lastSegment;
  })[0];

  if (isCursorInFirstDateSegment(position, date)) {
    return firstSegment;
  }

  if (isCursorInLastDateSegment(position, date)) {
    return lastSegment;
  }

  return middleSegment;
}
/**
 * Generate a placeholder date string for a given locale
 * eg: locale 'hu-HU' -> 'yyyy. mm. dd.'
 * @param locale A locale string supported by Intl.DateTimeFormat
 * @returns A placeholder string. d=1 or 2 digit day, dd=zero padded
 * day, same for month but letter m, yyyy=year
 */


function getLocaleDatePlaceholder(locale) {
  var uniqueDateType = {
    day: 7,
    month: 1,
    year: 1992
  };
  var localisedDateString = (0, _formatParse.formatDateType)(uniqueDateType, locale);
  var shortDateFormat = localisedDateString.replace(/\d+/g, function (str) {
    if (!str) {
      return '';
    }

    var num = parseInt(str);

    switch (num % 100) {
      case 92:
        return str.replace(/.{1}/g, 'y');

      case 1:
        return str.length === 1 ? 'm' : 'mm';

      case 7:
        return str.length === 1 ? 'd' : 'dd';
    }

    return '';
  });
  return shortDateFormat;
}
/**
 * Adjust date segment up or down. Eg. If day is the active segment and adjustment is -1,
 * reduce the day by one.
 * @param date Valid datetype
 * @param activeSegment which part of the date is selected/being adjusted
 * @param adjustment how many units the segment is being adjusted (can be pos or neg, usually 1 or -1)
 */


function adjustDate(date, activeSegment, adjustment) {
  var originalDate = (0, _formatParse.dateTypeToDate)(date);
  var newDate = activeSegment === 'day' ? (0, _addDays.default)(originalDate, adjustment) : activeSegment === 'month' ? (0, _addMonths.default)(originalDate, adjustment) : (0, _addYears.default)(originalDate, adjustment);
  return (0, _formatParse.dateToDateType)(newDate);
}

function isToday(date) {
  var today = new Date();
  return date !== undefined && today.getDate() === date.day && date.month === today.getMonth() + 1 && date.year === today.getFullYear();
}
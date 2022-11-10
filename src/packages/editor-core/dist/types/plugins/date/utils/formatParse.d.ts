import { DateType } from '../types';
/**
 * Attempt to parse a string representing a date in a particular locale to a date object
 * @param dateString The string representing the date in the given locale, eg '02/12/2000'
 * @param l10n The localisation provider created by createLocalizationProvider
 * @returns Editor DateType when can parse, null when can't parse or invalid
 */
export declare function parseDateType(dateString: string, locale: string): DateType | null;
/**
 * Convert an EditorDateType to a date string string formatted for a particular locale
 * @param date The date object
 * @param locale The locale code string (eg. "en-AU")
 * @returns Date string, eg "25/5/20"
 */
export declare function formatDateType(date: DateType, locale: string): string;
/**
 * Convert an Editor DateType to a JavaScript Date object
 * @param date Editor DateType
 * @returns JavaScript Date object
 */
export declare function dateTypeToDate(date: DateType): Date;
/**
 * Convert a JavaScript Date to an editor DateType
 * @param date JavaScript Date object
 * @returns Editor DateType
 */
export declare function dateToDateType(date: Date): DateType;

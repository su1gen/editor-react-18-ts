import { Slice, Schema } from 'prosemirror-model';
export declare const FILEPATH_REGEXP: RegExp;
export declare const DONTLINKIFY_REGEXP: RegExp;
/**
 * Instance of class LinkMatcher are used in autoformatting in place of Regex.
 * Hence it has been made similar to regex with an exec method.
 * Extending it directly from class Regex was introducing some issues, thus that has been avoided.
 */
export declare class LinkMatcher {
    static create(): RegExp;
}
/**
 * Adds protocol to url if needed.
 */
export declare function normalizeUrl(url?: string | null): string;
export declare function linkifyContent(schema: Schema): (slice: Slice) => Slice;
export declare function getLinkDomain(url: string): string;
export declare function isFromCurrentDomain(url: string): boolean;
interface filepathMatch {
    startIndex: number;
    endIndex: number;
}
export declare const findFilepaths: (text: string, offset?: number) => Array<filepathMatch>;
export declare const isLinkInMatches: (linkStart: number, matchesList: Array<filepathMatch>) => boolean;
export {};

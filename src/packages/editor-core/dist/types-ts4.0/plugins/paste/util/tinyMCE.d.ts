export declare const isPastedFromTinyMCEConfluence: (pasteEvent: ClipboardEvent, html: string) => boolean;
/**
 * Wraps html markup with a `<table>` and uses `DOMParser` to generate
 * and return both the table-wrapped and non-table-wrapped DOM document
 * instances.
 */
export declare const wrapWithTable: (html: string) => {
    tableWrappedDoc: Document;
    nonTableWrappedDoc: Document;
};
/**
 * Given a DOM document, it will try to rebuild table rows by using the
 * table headers count as an initial starting point for the assumed
 * number of columns that make up a row (`colsInRow`). It will slowly
 * decrease that `colsInRow` count until it finds exact fit for table
 * headers and cells with `colsInRow` else it returns the original
 * document's markup.
 *
 * NOTE: It will NOT try to rebuild table rows if it encounters merged cells
 * or compex table configurations (where table headers exist after normal
 * table cells). It will build a single column table if NO table
 * headers exist.
 */
export declare const tryReconstructTableRows: (doc: Document) => string;
export declare const htmlHasIncompleteTable: (html: string) => boolean;
/**
 * Strictly for ED-7331. Given incomplete table html from tinyMCE, it will try to rebuild
 * a whole valid table. If it rebuilds the table, it may first rebuild it as a single
 * row table, so this also then tries to reconstruct the table rows/columns if
 * possible (best effort).
 */
export declare const tryRebuildCompleteTableHtml: (incompleteTableHtml: string) => string | null;

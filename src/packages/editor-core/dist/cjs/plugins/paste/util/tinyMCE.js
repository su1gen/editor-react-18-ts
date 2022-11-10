"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapWithTable = exports.tryReconstructTableRows = exports.tryRebuildCompleteTableHtml = exports.isPastedFromTinyMCEConfluence = exports.htmlHasIncompleteTable = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _chunk = _interopRequireDefault(require("lodash/chunk"));

var isPastedFromTinyMCE = function isPastedFromTinyMCE(pasteEvent) {
  var _pasteEvent$clipboard, _pasteEvent$clipboard2, _pasteEvent$clipboard3;

  return (_pasteEvent$clipboard = pasteEvent === null || pasteEvent === void 0 ? void 0 : (_pasteEvent$clipboard2 = pasteEvent.clipboardData) === null || _pasteEvent$clipboard2 === void 0 ? void 0 : (_pasteEvent$clipboard3 = _pasteEvent$clipboard2.types) === null || _pasteEvent$clipboard3 === void 0 ? void 0 : _pasteEvent$clipboard3.some(function (mimeType) {
    return mimeType === 'x-tinymce/html';
  })) !== null && _pasteEvent$clipboard !== void 0 ? _pasteEvent$clipboard : false;
};

var isPastedFromTinyMCEConfluence = function isPastedFromTinyMCEConfluence(pasteEvent, html) {
  return isPastedFromTinyMCE(pasteEvent) && !!html && !!html.match(/class=\"\s?(confluenceTd|confluenceTh|confluenceTable).+"/gim);
};
/**
 * Wraps html markup with a `<table>` and uses `DOMParser` to generate
 * and return both the table-wrapped and non-table-wrapped DOM document
 * instances.
 */


exports.isPastedFromTinyMCEConfluence = isPastedFromTinyMCEConfluence;

var wrapWithTable = function wrapWithTable(html) {
  var parser = new DOMParser();
  var nonTableWrappedDoc = parser.parseFromString(html, 'text/html');
  var tableWrappedDoc = parser.parseFromString("<table>".concat(html, "</table>"), 'text/html');
  tableWrappedDoc.body.querySelectorAll('meta').forEach(function (meta) {
    tableWrappedDoc.head.prepend(meta);
  });
  return {
    tableWrappedDoc: tableWrappedDoc,
    nonTableWrappedDoc: nonTableWrappedDoc
  };
};

exports.wrapWithTable = wrapWithTable;

var exactlyDivisible = function exactlyDivisible(larger, smaller) {
  return larger % smaller === 0;
};

var getTableElementsInfo = function getTableElementsInfo(doc) {
  var cellCount = doc.querySelectorAll('td').length;
  var thCount = doc.querySelectorAll('th').length;
  var mergedCellCount = doc.querySelectorAll('td[colspan]:not([colspan="1"])').length;
  var hasThAfterTd = false;
  var thsAndCells = doc.querySelectorAll('th,td');

  for (var i = 0, cellFound = false; i < thsAndCells.length; i++) {
    if (cellFound && thsAndCells[i].nodeName === 'TH') {
      hasThAfterTd = true;
      break;
    }

    if (thsAndCells[i].nodeName === 'TD') {
      cellFound = true;
    }
  }

  var onlyTh = thCount > 0 && cellCount === 0;
  var onlyCells = cellCount > 0 && thCount === 0;
  var hasCompleteRow = // we take header-only and cell-only tables to be
  // row-complete
  onlyTh || onlyCells || // if headers and cells can "fit" against each other,
  // then we assume a complete row exists
  (exactlyDivisible(thCount, cellCount) || exactlyDivisible(cellCount, thCount)) && // all numbers are divisible by 1, so we carve out a specific
  // check for when there is only 1 table cell, and more than 1
  // table header.
  !(thCount > 1 && cellCount === 1);
  return {
    cellCount: cellCount,
    thCount: thCount,
    mergedCellCount: mergedCellCount,
    hasThAfterTd: hasThAfterTd,
    hasIncompleteRow: !hasCompleteRow
  };
};

var configureTableRows = function configureTableRows(doc, colsInRow) {
  var _Array$from;

  var tableHeadersAndCells = Array.from(doc.body.querySelectorAll('th,td'));
  var evenlySplitChunks = (0, _chunk.default)(tableHeadersAndCells, colsInRow);
  var tableBody = doc.body.querySelector('tbody');
  evenlySplitChunks.forEach(function (chunk) {
    var tr = doc.createElement('tr');
    tableBody === null || tableBody === void 0 ? void 0 : tableBody.append(tr);
    tr.append.apply(tr, (0, _toConsumableArray2.default)(chunk));
  }); // We remove any leftover empty rows which may cause fabric editor
  // to no-op when parsing the table

  var emptyRows = (_Array$from = Array.from(tableBody.querySelectorAll('tr'))) === null || _Array$from === void 0 ? void 0 : _Array$from.filter(function (row) {
    return row.innerHTML.trim().length === 0;
  });
  emptyRows.forEach(function (row) {
    return row.remove();
  });
  return doc.body.innerHTML;
};

var fillIncompleteRowWithEmptyCells = function fillIncompleteRowWithEmptyCells(doc, thCount, cellCount) {
  var _lastCell$parentEleme;

  var extraCellsCount = 0;

  while (!exactlyDivisible(cellCount + extraCellsCount, thCount)) {
    extraCellsCount++;
  }

  var extraEmptyCells = Array.from(Array(extraCellsCount)).map(function () {
    return doc.createElement('td');
  });
  var lastCell = doc.body.querySelector('td:last-of-type');
  lastCell === null || lastCell === void 0 ? void 0 : (_lastCell$parentEleme = lastCell.parentElement) === null || _lastCell$parentEleme === void 0 ? void 0 : _lastCell$parentEleme.append.apply(_lastCell$parentEleme, (0, _toConsumableArray2.default)(extraEmptyCells));
  return {
    updatedCellCount: cellCount + extraCellsCount
  };
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


var tryReconstructTableRows = function tryReconstructTableRows(doc) {
  var _getTableElementsInfo = getTableElementsInfo(doc),
      cellCount = _getTableElementsInfo.cellCount,
      thCount = _getTableElementsInfo.thCount,
      mergedCellCount = _getTableElementsInfo.mergedCellCount,
      hasThAfterTd = _getTableElementsInfo.hasThAfterTd,
      hasIncompleteRow = _getTableElementsInfo.hasIncompleteRow;

  if (mergedCellCount || hasThAfterTd) {
    // bail out to avoid handling more complex table structures
    return doc.body.innerHTML;
  }

  if (!thCount) {
    // if no table headers exist for reference, fallback to a single column table structure
    return configureTableRows(doc, 1);
  }

  if (hasIncompleteRow) {
    // if shift-click selection copies a partial table row to the clipboard,
    // and we do have table headers for reference, then we add empty table cells
    // to fill out the partial row
    var _fillIncompleteRowWit = fillIncompleteRowWithEmptyCells(doc, thCount, cellCount),
        updatedCellCount = _fillIncompleteRowWit.updatedCellCount;

    cellCount = updatedCellCount;
  }

  for (var possibleColsInRow = thCount; possibleColsInRow > 0; possibleColsInRow--) {
    if (exactlyDivisible(thCount, possibleColsInRow) && exactlyDivisible(cellCount, possibleColsInRow)) {
      return configureTableRows(doc, possibleColsInRow);
    }
  }

  return doc.body.innerHTML;
};

exports.tryReconstructTableRows = tryReconstructTableRows;

var htmlHasIncompleteTable = function htmlHasIncompleteTable(html) {
  return !html.includes('<table ') && (html.includes('<td ') || html.includes('<th '));
};
/**
 * Strictly for ED-7331. Given incomplete table html from tinyMCE, it will try to rebuild
 * a whole valid table. If it rebuilds the table, it may first rebuild it as a single
 * row table, so this also then tries to reconstruct the table rows/columns if
 * possible (best effort).
 */


exports.htmlHasIncompleteTable = htmlHasIncompleteTable;

var tryRebuildCompleteTableHtml = function tryRebuildCompleteTableHtml(incompleteTableHtml) {
  // first we try wrapping the table elements with <table> and let DOMParser try to rebuild
  // a valid DOM tree. we also keep the non-wrapped table for comparison purposes.
  var _wrapWithTable = wrapWithTable(incompleteTableHtml),
      nonTableWrappedDoc = _wrapWithTable.nonTableWrappedDoc,
      tableWrappedDoc = _wrapWithTable.tableWrappedDoc;

  var didPreserveTableElements = Boolean(!nonTableWrappedDoc.body.querySelector('th, td') && tableWrappedDoc.body.querySelector('th, td'));
  var isExpectedStructure = tableWrappedDoc.querySelectorAll('body > table:only-child') && !tableWrappedDoc.querySelector("body > table > tbody > tr > :not(th,td)"); // if DOMParser saves table elements that we would otherwise lose, and
  // if the table html is what we'd expect (a single table, with no extraneous
  // elements in table rows other than th, td), then we can now also try to
  // rebuild table rows/columns.

  if (didPreserveTableElements && isExpectedStructure) {
    var completeTableHtml = tryReconstructTableRows(tableWrappedDoc);
    return completeTableHtml;
  }

  return null;
};

exports.tryRebuildCompleteTableHtml = tryRebuildCompleteTableHtml;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addReplaceSelectedTableAnalytics = void 0;
exports.applyTextMarksToSlice = applyTextMarksToSlice;
exports.escapeLinks = escapeLinks;
exports.getPasteSource = getPasteSource;
exports.hasOnlyNodesOfType = hasOnlyNodesOfType;
exports.htmlContainsSingleFile = htmlContainsSingleFile;
exports.htmlHasInvalidLinkTags = void 0;
exports.isCode = isCode;
exports.isCursorSelectionAtTextStartOrEnd = isCursorSelectionAtTextStartOrEnd;
exports.isEmptyNode = isEmptyNode;
exports.isPanelNode = isPanelNode;
exports.isPastedFromDropboxPaper = isPastedFromDropboxPaper;
exports.isPastedFromExcel = isPastedFromExcel;
exports.isPastedFromFabricEditor = isPastedFromFabricEditor;
exports.isPastedFromGoogleDocs = isPastedFromGoogleDocs;
exports.isPastedFromGoogleSpreadSheets = isPastedFromGoogleSpreadSheets;
exports.isPastedFromPages = isPastedFromPages;
exports.isPastedFromWord = isPastedFromWord;
exports.isSelectionInsidePanel = isSelectionInsidePanel;
exports.removeDuplicateInvalidLinks = exports.isSingleLine = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _prosemirrorModel = require("prosemirror-model");

var _mediaClient = require("@atlaskit/media-client");

var _analytics = require("../../analytics");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("@atlaskit/editor-tables/utils");

function isPastedFromWord(html) {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:word') >= 0;
}

function isPastedFromExcel(html) {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:excel') >= 0;
}

function isPastedFromDropboxPaper(html) {
  return !!html && !!html.match(/class=\"\s?author-d-.+"/gim);
}

function isPastedFromGoogleDocs(html) {
  return !!html && !!html.match(/id=\"docs-internal-guid-.+"/gim);
}

function isPastedFromGoogleSpreadSheets(html) {
  return !!html && !!html.match(/data-sheets-.+=/gim);
}

function isPastedFromPages(html) {
  return !!html && html.indexOf('content="Cocoa HTML Writer"') >= 0;
}

function isPastedFromFabricEditor(html) {
  return !!html && html.indexOf('data-pm-slice="') >= 0;
}

var isSingleLine = function isSingleLine(text) {
  return !!text && text.trim().split('\n').length === 1;
};

exports.isSingleLine = isSingleLine;

function htmlContainsSingleFile(html) {
  return !!html.match(/<img .*>/) && !(0, _mediaClient.isMediaBlobUrl)(html);
}

function getPasteSource(event) {
  var html = event.clipboardData.getData('text/html');

  if (isPastedFromDropboxPaper(html)) {
    return 'dropbox-paper';
  } else if (isPastedFromWord(html)) {
    return 'microsoft-word';
  } else if (isPastedFromExcel(html)) {
    return 'microsoft-excel';
  } else if (isPastedFromGoogleDocs(html)) {
    return 'google-docs';
  } else if (isPastedFromGoogleSpreadSheets(html)) {
    return 'google-spreadsheets';
  } else if (isPastedFromPages(html)) {
    return 'apple-pages';
  } else if (isPastedFromFabricEditor(html)) {
    return 'fabric-editor';
  }

  return 'uncategorized';
} // TODO: Write JEST tests for this part


function isCode(str) {
  var lines = str.split(/\r?\n|\r/);

  if (3 > lines.length) {
    return false;
  }

  var weight = 0;
  lines.forEach(function (line) {
    // Ends with : or ;
    if (/[:;]$/.test(line)) {
      weight++;
    } // Contains second and third braces


    if (/[{}\[\]]/.test(line)) {
      weight++;
    } // Contains <tag> or </


    if (/<\w+>/.test(line) || /<\//.test(line)) {
      weight++;
    } // Contains () <- function calls


    if (/\(\)/.test(line)) {
      weight++;
    } // Contains a link


    if (/(^|[^!])\[(.*?)\]\((\S+)\)$/.test(line)) {
      weight--;
    } // New line starts with less than two chars. e.g- if, {, <, etc


    var token = /^(\s+)[a-zA-Z<{]{2,}/.exec(line);

    if (token && 2 <= token[1].length) {
      weight++;
    }

    if (/&&/.test(line)) {
      weight++;
    }
  });
  return 4 <= weight && weight >= 0.5 * lines.length;
} // @see https://product-fabric.atlassian.net/browse/ED-3159
// @see https://github.com/markdown-it/markdown-it/issues/38


function escapeLinks(text) {
  return text.replace(/(\[([^\]]+)\]\()?((https?|ftp):\/\/[^\s]+)/g, function (str) {
    return str.match(/^(https?|ftp):\/\/[^\s]+$/) ? "<".concat(str, ">") : str;
  });
}

function hasOnlyNodesOfType() {
  for (var _len = arguments.length, nodeTypes = new Array(_len), _key = 0; _key < _len; _key++) {
    nodeTypes[_key] = arguments[_key];
  }

  return function (slice) {
    var hasOnlyNodesOfType = true;
    slice.content.descendants(function (node) {
      hasOnlyNodesOfType = hasOnlyNodesOfType && nodeTypes.indexOf(node.type) > -1;
      return hasOnlyNodesOfType;
    });
    return hasOnlyNodesOfType;
  };
}

function applyTextMarksToSlice(schema, marks) {
  return function (slice) {
    var _schema$marks = schema.marks,
        codeMark = _schema$marks.code,
        linkMark = _schema$marks.link,
        annotationMark = _schema$marks.annotation;

    if (!Array.isArray(marks) || marks.length === 0) {
      return slice;
    }

    var sliceCopy = _prosemirrorModel.Slice.fromJSON(schema, slice.toJSON() || {}); // allow links and annotations to be pasted


    var allowedMarksToPaste = [linkMark, annotationMark];
    sliceCopy.content.descendants(function (node, _pos, parent) {
      if (node.isText && parent && parent.isBlock) {
        node.marks = [].concat((0, _toConsumableArray2.default)(node.marks && !codeMark.isInSet(marks) && node.marks.filter(function (mark) {
          return allowedMarksToPaste.includes(mark.type);
        }) || []), (0, _toConsumableArray2.default)(parent.type.allowedMarks(marks).filter(function (mark) {
          return mark.type !== linkMark;
        })));
        return false;
      }

      return true;
    });
    return sliceCopy;
  };
}

function isEmptyNode(node) {
  if (!node) {
    return false;
  }

  var nodeType = node.type;
  var emptyNode = nodeType.createAndFill();
  return emptyNode && emptyNode.nodeSize === node.nodeSize && emptyNode.content.eq(node.content) && _prosemirrorModel.Mark.sameSet(emptyNode.marks, node.marks);
}

function isCursorSelectionAtTextStartOrEnd(selection) {
  return selection instanceof _prosemirrorState.TextSelection && selection.empty && selection.$cursor && (!selection.$cursor.nodeBefore || !selection.$cursor.nodeAfter);
}

function isPanelNode(node) {
  return Boolean(node && node.type.name === 'panel');
}

function isSelectionInsidePanel(selection) {
  if (selection instanceof _prosemirrorState.NodeSelection && isPanelNode(selection.node)) {
    return selection.node;
  }

  var panel = selection.$from.doc.type.schema.nodes.panel;
  var panelPosition = (0, _prosemirrorUtils.findParentNodeOfType)(panel)(selection);

  if (panelPosition) {
    return panelPosition.node;
  }

  return null;
} // https://product-fabric.atlassian.net/browse/ED-11714
// Checks for broken html that comes from links in a list item copied from Notion


var htmlHasInvalidLinkTags = function htmlHasInvalidLinkTags(html) {
  return !!html && (html.includes('</a></a>') || html.includes('"></a><a'));
}; // https://product-fabric.atlassian.net/browse/ED-11714
// Example of broken html edge case we're solving
// <li><a href="http://www.atlassian.com\"<a> href="http://www.atlassian.com\"http://www.atlassian.com</a></a></li>">


exports.htmlHasInvalidLinkTags = htmlHasInvalidLinkTags;

var removeDuplicateInvalidLinks = function removeDuplicateInvalidLinks(html) {
  if (htmlHasInvalidLinkTags(html)) {
    var htmlArray = html.split(/(?=<a)/);
    var htmlArrayWithoutInvalidLinks = htmlArray.filter(function (item) {
      return !(item.includes('<a') && item.includes('"></a>')) && !(item.includes('<a') && !item.includes('</a>'));
    });
    var fixedHtml = htmlArrayWithoutInvalidLinks.join('').replace(/<\/a><\/a>/gi, '</a>').replace(/<a>/gi, '<a');
    return fixedHtml;
  }

  return html;
};

exports.removeDuplicateInvalidLinks = removeDuplicateInvalidLinks;

var addReplaceSelectedTableAnalytics = function addReplaceSelectedTableAnalytics(state, tr) {
  if ((0, _utils.isTableSelected)(state.selection)) {
    var _getSelectedTableInfo = (0, _utils.getSelectedTableInfo)(state.selection),
        totalRowCount = _getSelectedTableInfo.totalRowCount,
        totalColumnCount = _getSelectedTableInfo.totalColumnCount;

    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.TABLE_ACTION.REPLACED,
      actionSubject: _analytics.ACTION_SUBJECT.TABLE,
      attributes: {
        totalColumnCount: totalColumnCount,
        totalRowCount: totalRowCount,
        inputMethod: _analytics.INPUT_METHOD.CLIPBOARD
      },
      eventType: _analytics.EVENT_TYPE.TRACK
    });
    return tr;
  }

  return state.tr;
};

exports.addReplaceSelectedTableAnalytics = addReplaceSelectedTableAnalytics;
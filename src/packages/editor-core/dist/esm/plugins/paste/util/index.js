import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { Slice, Mark } from 'prosemirror-model';
import { isMediaBlobUrl } from '@atlaskit/media-client';
import { ACTION_SUBJECT, addAnalytics, EVENT_TYPE, INPUT_METHOD, TABLE_ACTION } from '../../analytics';
import { TextSelection, NodeSelection } from 'prosemirror-state';
import { findParentNodeOfType } from 'prosemirror-utils';
import { getSelectedTableInfo, isTableSelected } from '@atlaskit/editor-tables/utils';
export function isPastedFromWord(html) {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:word') >= 0;
}
export function isPastedFromExcel(html) {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:excel') >= 0;
}
export function isPastedFromDropboxPaper(html) {
  return !!html && !!html.match(/class=\"\s?author-d-.+"/gim);
}
export function isPastedFromGoogleDocs(html) {
  return !!html && !!html.match(/id=\"docs-internal-guid-.+"/gim);
}
export function isPastedFromGoogleSpreadSheets(html) {
  return !!html && !!html.match(/data-sheets-.+=/gim);
}
export function isPastedFromPages(html) {
  return !!html && html.indexOf('content="Cocoa HTML Writer"') >= 0;
}
export function isPastedFromFabricEditor(html) {
  return !!html && html.indexOf('data-pm-slice="') >= 0;
}
export var isSingleLine = function isSingleLine(text) {
  return !!text && text.trim().split('\n').length === 1;
};
export function htmlContainsSingleFile(html) {
  return !!html.match(/<img .*>/) && !isMediaBlobUrl(html);
}
export function getPasteSource(event) {
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

export function isCode(str) {
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

export function escapeLinks(text) {
  return text.replace(/(\[([^\]]+)\]\()?((https?|ftp):\/\/[^\s]+)/g, function (str) {
    return str.match(/^(https?|ftp):\/\/[^\s]+$/) ? "<".concat(str, ">") : str;
  });
}
export function hasOnlyNodesOfType() {
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
export function applyTextMarksToSlice(schema, marks) {
  return function (slice) {
    var _schema$marks = schema.marks,
        codeMark = _schema$marks.code,
        linkMark = _schema$marks.link,
        annotationMark = _schema$marks.annotation;

    if (!Array.isArray(marks) || marks.length === 0) {
      return slice;
    }

    var sliceCopy = Slice.fromJSON(schema, slice.toJSON() || {}); // allow links and annotations to be pasted

    var allowedMarksToPaste = [linkMark, annotationMark];
    sliceCopy.content.descendants(function (node, _pos, parent) {
      if (node.isText && parent && parent.isBlock) {
        node.marks = [].concat(_toConsumableArray(node.marks && !codeMark.isInSet(marks) && node.marks.filter(function (mark) {
          return allowedMarksToPaste.includes(mark.type);
        }) || []), _toConsumableArray(parent.type.allowedMarks(marks).filter(function (mark) {
          return mark.type !== linkMark;
        })));
        return false;
      }

      return true;
    });
    return sliceCopy;
  };
}
export function isEmptyNode(node) {
  if (!node) {
    return false;
  }

  var nodeType = node.type;
  var emptyNode = nodeType.createAndFill();
  return emptyNode && emptyNode.nodeSize === node.nodeSize && emptyNode.content.eq(node.content) && Mark.sameSet(emptyNode.marks, node.marks);
}
export function isCursorSelectionAtTextStartOrEnd(selection) {
  return selection instanceof TextSelection && selection.empty && selection.$cursor && (!selection.$cursor.nodeBefore || !selection.$cursor.nodeAfter);
}
export function isPanelNode(node) {
  return Boolean(node && node.type.name === 'panel');
}
export function isSelectionInsidePanel(selection) {
  if (selection instanceof NodeSelection && isPanelNode(selection.node)) {
    return selection.node;
  }

  var panel = selection.$from.doc.type.schema.nodes.panel;
  var panelPosition = findParentNodeOfType(panel)(selection);

  if (panelPosition) {
    return panelPosition.node;
  }

  return null;
} // https://product-fabric.atlassian.net/browse/ED-11714
// Checks for broken html that comes from links in a list item copied from Notion

export var htmlHasInvalidLinkTags = function htmlHasInvalidLinkTags(html) {
  return !!html && (html.includes('</a></a>') || html.includes('"></a><a'));
}; // https://product-fabric.atlassian.net/browse/ED-11714
// Example of broken html edge case we're solving
// <li><a href="http://www.atlassian.com\"<a> href="http://www.atlassian.com\"http://www.atlassian.com</a></a></li>">

export var removeDuplicateInvalidLinks = function removeDuplicateInvalidLinks(html) {
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
export var addReplaceSelectedTableAnalytics = function addReplaceSelectedTableAnalytics(state, tr) {
  if (isTableSelected(state.selection)) {
    var _getSelectedTableInfo = getSelectedTableInfo(state.selection),
        totalRowCount = _getSelectedTableInfo.totalRowCount,
        totalColumnCount = _getSelectedTableInfo.totalColumnCount;

    addAnalytics(state, tr, {
      action: TABLE_ACTION.REPLACED,
      actionSubject: ACTION_SUBJECT.TABLE,
      attributes: {
        totalColumnCount: totalColumnCount,
        totalRowCount: totalRowCount,
        inputMethod: INPUT_METHOD.CLIPBOARD
      },
      eventType: EVENT_TYPE.TRACK
    });
    return tr;
  }

  return state.tr;
};
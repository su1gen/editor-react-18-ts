"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.liftFollowingList = liftFollowingList;
exports.liftNodeSelectionList = liftNodeSelectionList;
exports.liftTextSelectionList = liftTextSelectionList;
exports.upgradeTextToLists = exports.splitParagraphs = exports.splitIntoParagraphs = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorCommands = require("prosemirror-commands");

var _node = require("./utils/node");

var _slice = require("../../utils/slice");

var _indentation = require("./utils/indentation");

function liftListItem(selection, tr) {
  var $from = selection.$from,
      $to = selection.$to;
  var nodeType = tr.doc.type.schema.nodes.listItem;
  var range = $from.blockRange($to, function (node) {
    return !!node.childCount && !!node.firstChild && node.firstChild.type === nodeType;
  });

  if (!range || range.depth < 2 || $from.node(range.depth - 1).type !== nodeType) {
    return tr;
  }

  var end = range.end;
  var endOfList = $to.end(range.depth);

  if (end < endOfList) {
    tr.step(new _prosemirrorTransform.ReplaceAroundStep(end - 1, endOfList, end, endOfList, new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.from(nodeType.create(undefined, range.parent.copy())), 1, 0), 1, true));
    range = new _prosemirrorModel.NodeRange(tr.doc.resolve($from.pos), tr.doc.resolve(endOfList), range.depth);
  }

  return tr.lift(range, (0, _prosemirrorTransform.liftTarget)(range)).scrollIntoView();
} // Function will lift list item following selection to level-1.


function liftFollowingList(from, to, rootListDepth, tr) {
  var listItem = tr.doc.type.schema.nodes.listItem;
  var lifted = false;
  tr.doc.nodesBetween(from, to, function (node, pos) {
    if (!lifted && node.type === listItem && pos > from) {
      lifted = true;
      var listDepth = rootListDepth + 3;

      while (listDepth > rootListDepth + 2) {
        var start = tr.doc.resolve(tr.mapping.map(pos));
        listDepth = start.depth;
        var end = tr.doc.resolve(tr.mapping.map(pos + node.textContent.length));
        var sel = new _prosemirrorState.TextSelection(start, end);
        tr = liftListItem(sel, tr);
      }
    }
  });
  return tr;
}

function liftNodeSelectionList(selection, tr) {
  var from = selection.from;
  var listItem = tr.doc.type.schema.nodes.listItem;
  var mappedPosition = tr.mapping.map(from);
  var nodeAtPos = tr.doc.nodeAt(mappedPosition);
  var start = tr.doc.resolve(mappedPosition);

  if ((start === null || start === void 0 ? void 0 : start.parent.type) !== listItem) {
    return tr;
  }

  var end = tr.doc.resolve(mappedPosition + ((nodeAtPos === null || nodeAtPos === void 0 ? void 0 : nodeAtPos.nodeSize) || 1));
  var range = start.blockRange(end);

  if (range) {
    var _liftTarget = (0, _indentation.getListLiftTarget)(start);

    tr.lift(range, _liftTarget);
  }

  return tr;
} // The function will list paragraphs in selection out to level 1 below root list.


function liftTextSelectionList(selection, tr) {
  var from = selection.from,
      to = selection.to;
  var paragraph = tr.doc.type.schema.nodes.paragraph;
  var listCol = [];
  tr.doc.nodesBetween(from, to, function (node, pos) {
    if (node.type === paragraph) {
      listCol.push({
        node: node,
        pos: pos
      });
    }
  });

  for (var i = listCol.length - 1; i >= 0; i--) {
    var _paragraph = listCol[i];
    var start = tr.doc.resolve(tr.mapping.map(_paragraph.pos));

    if (start.depth > 0) {
      var end = void 0;

      if (_paragraph.node.textContent && _paragraph.node.textContent.length > 0) {
        end = tr.doc.resolve(tr.mapping.map(_paragraph.pos + _paragraph.node.textContent.length));
      } else {
        end = tr.doc.resolve(tr.mapping.map(_paragraph.pos + 1));
      }

      var range = start.blockRange(end);

      if (range) {
        tr.lift(range, (0, _indentation.getListLiftTarget)(start));
      }
    }
  }

  return tr;
} // matchers for text lists


var bullets = /^\s*[\*\-\u2022](\s+|\s+$)/;
var numbers = /^\s*\d[\.\)](\s+|$)/;

var getListType = function getListType(node, schema) {
  if (!node.text) {
    return null;
  }

  var _schema$nodes = schema.nodes,
      bulletList = _schema$nodes.bulletList,
      orderedList = _schema$nodes.orderedList;
  return [{
    node: bulletList,
    matcher: bullets
  }, {
    node: orderedList,
    matcher: numbers
  }].reduce(function (lastMatch, listType) {
    if (lastMatch) {
      return lastMatch;
    }

    var match = node.text.match(listType.matcher);
    return match ? [listType.node, match[0].length] : lastMatch;
  }, null);
};

var extractListFromParagraph = function extractListFromParagraph(node, parent, schema) {
  var _schema$nodes2 = schema.nodes,
      hardBreak = _schema$nodes2.hardBreak,
      bulletList = _schema$nodes2.bulletList,
      orderedList = _schema$nodes2.orderedList;
  var content = (0, _slice.mapChildren)(node.content, function (node) {
    return node;
  });
  var listTypes = [bulletList, orderedList]; // wrap each line into a listItem and a containing list

  var listified = content.map(function (child, index) {
    var listMatch = getListType(child, schema);
    var prevChild = index > 0 && content[index - 1]; // only extract list when preceded by a hardbreak

    if (prevChild && prevChild.type !== hardBreak) {
      return child;
    }

    if (!listMatch || !child.text) {
      return child;
    }

    var _listMatch = (0, _slicedToArray2.default)(listMatch, 2),
        nodeType = _listMatch[0],
        length = _listMatch[1]; // convert to list item


    var newText = child.text.substr(length);
    var listItemNode = schema.nodes.listItem.createAndFill(undefined, schema.nodes.paragraph.createChecked(undefined, newText.length ? schema.text(newText) : undefined));

    if (!listItemNode) {
      return child;
    }

    var newList = nodeType.createChecked(undefined, [listItemNode]); // Check whether our new list is valid content in our current structure,
    // otherwise dont convert.

    if (parent && !parent.type.validContent(_prosemirrorModel.Fragment.from(newList))) {
      return child;
    }

    return newList;
  }).filter(function (child, idx, arr) {
    // remove hardBreaks that have a list node on either side
    // wasn't hardBreak, leave as-is
    if (child.type !== hardBreak) {
      return child;
    }

    if (idx > 0 && listTypes.indexOf(arr[idx - 1].type) > -1) {
      // list node on the left
      return null;
    }

    if (idx < arr.length - 1 && listTypes.indexOf(arr[idx + 1].type) > -1) {
      // list node on the right
      return null;
    }

    return child;
  }); // try to join

  var mockState = _prosemirrorState.EditorState.create({
    schema: schema
  });

  var joinedListsTr;

  var mockDispatch = function mockDispatch(tr) {
    joinedListsTr = tr;
  };

  (0, _prosemirrorCommands.autoJoin)(function (state, dispatch) {
    if (!dispatch) {
      return false;
    } // Return false to prevent replaceWith from wrapping the text node in a paragraph
    // paragraph since that will be done later. If it's done here, it will fail
    // the paragraph.validContent check.
    // Dont return false if there are lists, as they arent validContent for paragraphs
    // and will result in hanging textNodes


    var containsList = listified.some(function (node) {
      return node.type === bulletList || node.type === orderedList;
    });

    if (listified.some(function (node) {
      return node.isText;
    }) && !containsList) {
      return false;
    }

    dispatch(state.tr.replaceWith(0, 2, listified));
    return true;
  }, function (before, after) {
    return (0, _node.isListNode)(before) && (0, _node.isListNode)(after);
  })(mockState, mockDispatch);
  var fragment = joinedListsTr ? joinedListsTr.doc.content : _prosemirrorModel.Fragment.from(listified); // try to re-wrap fragment in paragraph (which is the original node we unwrapped)

  var paragraph = schema.nodes.paragraph;

  if (paragraph.validContent(fragment)) {
    return _prosemirrorModel.Fragment.from(paragraph.create(node.attrs, fragment, node.marks));
  } // fragment now contains other nodes, get Prosemirror to wrap with ContentMatch later


  return fragment;
};
/**
 * Walks the slice, creating paragraphs that were previously separated by hardbreaks.
 * Returns the original paragraph node (as a fragment), or a fragment containing multiple nodes.
 */


var splitIntoParagraphs = function splitIntoParagraphs(_ref) {
  var fragment = _ref.fragment,
      _ref$blockMarks = _ref.blockMarks,
      blockMarks = _ref$blockMarks === void 0 ? [] : _ref$blockMarks,
      schema = _ref.schema;
  var paragraphs = [];
  var curChildren = [];
  var lastNode = null;
  var _schema$nodes3 = schema.nodes,
      hardBreak = _schema$nodes3.hardBreak,
      paragraph = _schema$nodes3.paragraph;
  fragment.forEach(function (node, i) {
    var isNodeValidContentForParagraph = schema.nodes.paragraph.validContent(_prosemirrorModel.Fragment.from(node));

    if (!isNodeValidContentForParagraph) {
      paragraphs.push(node);
      return;
    } // ED-14725 Fixed the issue that it make duplicated line
    // when pasting <br /> from google docs.


    if (i === 0 && node.type === hardBreak) {
      paragraphs.push(paragraph.createChecked(undefined, curChildren, (0, _toConsumableArray2.default)(blockMarks)));
      lastNode = node;
      return;
    } else if (lastNode && lastNode.type === hardBreak && node.type === hardBreak) {
      // double hardbreak
      // backtrack a little; remove the trailing hardbreak we added last loop
      curChildren.pop(); // create a new paragraph

      paragraphs.push(paragraph.createChecked(undefined, curChildren, (0, _toConsumableArray2.default)(blockMarks)));
      curChildren = [];
      return;
    } // add to this paragraph


    curChildren.push(node);
    lastNode = node;
  });

  if (curChildren.length) {
    paragraphs.push(paragraph.createChecked(undefined, curChildren, (0, _toConsumableArray2.default)(blockMarks)));
  }

  return _prosemirrorModel.Fragment.from(paragraphs.length ? paragraphs : [paragraph.createAndFill(undefined, undefined, (0, _toConsumableArray2.default)(blockMarks))]);
};

exports.splitIntoParagraphs = splitIntoParagraphs;

var splitParagraphs = function splitParagraphs(slice, schema) {
  // exclude Text nodes with a code mark, since we transform those later
  // into a codeblock
  var hasCodeMark = false;
  slice.content.forEach(function (child) {
    hasCodeMark = hasCodeMark || child.marks.some(function (mark) {
      return mark.type === schema.marks.code;
    });
  }); // slice might just be a raw text string

  if (schema.nodes.paragraph.validContent(slice.content) && !hasCodeMark) {
    var replSlice = splitIntoParagraphs({
      fragment: slice.content,
      schema: schema
    });
    return new _prosemirrorModel.Slice(replSlice, slice.openStart + 1, slice.openEnd + 1);
  }

  return (0, _slice.mapSlice)(slice, function (node) {
    if (node.type === schema.nodes.paragraph) {
      return splitIntoParagraphs({
        fragment: node.content,
        blockMarks: node.marks,
        schema: schema
      });
    }

    return node;
  });
}; // above will wrap everything in paragraphs for us


exports.splitParagraphs = splitParagraphs;

var upgradeTextToLists = function upgradeTextToLists(slice, schema) {
  return (0, _slice.mapSlice)(slice, function (node, parent) {
    if (node.type === schema.nodes.paragraph) {
      return extractListFromParagraph(node, parent, schema);
    }

    return node;
  });
};

exports.upgradeTextToLists = upgradeTextToLists;
import { toggleMark } from 'prosemirror-commands';
import { Fragment, Slice } from 'prosemirror-model';
import { NodeSelection, TextSelection } from 'prosemirror-state';
import { findWrapping, liftTarget } from 'prosemirror-transform';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { FakeTextCursorSelection } from '../plugins/fake-text-cursor/cursor';
import { hasParentNodeOfType } from 'prosemirror-utils';
import { isNodeEmpty } from './document';
import { atTheBeginningOfDoc, atTheEndOfDoc } from './prosemirror/position';
export { insideTable } from '@atlaskit/editor-common/core-utils';
export { isEmptyParagraph, hasVisibleContent, isNodeEmpty, isEmptyDocument, processRawValue, getStepRange, findFarthestParentNode, isSelectionEndOfParagraph, nodesBetweenChanged, getNodesCount } from './document';
export { cascadeCommands, getEditorValueWithMedia } from './action';
export { isMarkAllowedInRange, isMarkExcluded, removeBlockMarks, sanitiseSelectionMarksForWrapping, sanitiseMarksInSelection } from './mark';
export { isParagraph, isText, isLinkMark, validateNodes } from './nodes';
export { normaliseNestedLayout, setNodeSelection, setAllSelection, setGapCursorSelection, setCellSelection, setTextSelection, isValidPosition } from './selection';
export { containsClassName } from './dom';
export { default as measurements } from './performance/measure-enum';

function validateNode(_node) {
  return false;
}

function isMarkTypeCompatibleWithMark(markType, mark) {
  return !mark.type.excludes(markType) && !markType.excludes(mark.type);
}

function isMarkTypeAllowedInNode(markType, state) {
  return toggleMark(markType)(state);
}

export function canMoveUp(state) {
  var selection = state.selection,
      doc = state.doc;
  /**
   * If there's a media element on the selection,
   * add text blocks with arrow navigation.
   * Also, the selection could be media | mediaGroup.
   */

  if (selection instanceof NodeSelection) {
    if (selection.node.type.name === 'media') {
      /** Weird way of checking if the previous element is a paragraph */
      var mediaAncestorNode = doc.nodeAt(selection.anchor - 3);
      return !!(mediaAncestorNode && mediaAncestorNode.type.name === 'paragraph');
    } else if (selection.node.type.name === 'mediaGroup') {
      var mediaGroupAncestorNode = selection.$anchor.nodeBefore;
      return !!(mediaGroupAncestorNode && mediaGroupAncestorNode.type.name === 'paragraph');
    }
  }

  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheBeginningOfDoc(state);
}
export function canMoveDown(state) {
  var selection = state.selection,
      doc = state.doc;
  /**
   * If there's a media element on the selection,
   * add text blocks with arrow navigation.
   * Also, the selection could be media | mediaGroup.
   */

  if (selection instanceof NodeSelection) {
    if (selection.node.type.name === 'media') {
      var nodeAfter = doc.nodeAt(selection.$head.after());
      return !!(nodeAfter && nodeAfter.type.name === 'paragraph');
    } else if (selection.node.type.name === 'mediaGroup') {
      return !(selection.$head.parentOffset === selection.$anchor.parent.content.size);
    }
  }

  if (selection instanceof TextSelection) {
    if (!selection.empty) {
      return true;
    }
  }

  return !atTheEndOfDoc(state);
}
export function isSelectionInsideLastNodeInDocument(selection) {
  var docNode = selection.$anchor.node(0);
  var rootNode = selection.$anchor.node(1);
  return docNode.lastChild === rootNode;
}
export function getCursor(selection) {
  return selection.$cursor || undefined;
}
/**
 * Check if a mark is allowed at the current selection / cursor based on a given state.
 * This method looks at both the currently active marks on the transaction, as well as
 * the node and marks at the current selection to determine if the given mark type is
 * allowed.
 */

export function isMarkTypeAllowedInCurrentSelection(markType, state) {
  if (state.selection instanceof FakeTextCursorSelection) {
    return true;
  }

  if (!isMarkTypeAllowedInNode(markType, state)) {
    return false;
  }

  var _ref = state.selection,
      empty = _ref.empty,
      $cursor = _ref.$cursor,
      ranges = _ref.ranges;

  if (empty && !$cursor) {
    return false;
  }

  var isCompatibleMarkType = function isCompatibleMarkType(mark) {
    return isMarkTypeCompatibleWithMark(markType, mark);
  }; // Handle any new marks in the current transaction


  if (state.tr.storedMarks && !state.tr.storedMarks.every(isCompatibleMarkType)) {
    return false;
  }

  if ($cursor) {
    return $cursor.marks().every(isCompatibleMarkType);
  } // Check every node in a selection - ensuring that it is compatible with the current mark type


  return ranges.every(function (_ref2) {
    var $from = _ref2.$from,
        $to = _ref2.$to;
    var allowedInActiveMarks = $from.depth === 0 ? state.doc.marks.every(isCompatibleMarkType) : true;
    state.doc.nodesBetween($from.pos, $to.pos, function (node) {
      allowedInActiveMarks = allowedInActiveMarks && node.marks.every(isCompatibleMarkType);
    });
    return allowedInActiveMarks;
  });
}
export function createSliceWithContent(content, state) {
  return new Slice(Fragment.from(state.schema.text(content)), 0, 0);
}
/**
 * Determines if content inside a selection can be joined with the next block.
 * We need this check since the built-in method for "joinDown" will join a orderedList with bulletList.
 */

export function canJoinDown(selection, doc, nodeType) {
  return checkNodeDown(selection, doc, function (node) {
    return node.type === nodeType;
  });
}
export function checkNodeDown(selection, doc, filter) {
  var ancestorDepth = findAncestorPosition(doc, selection.$to).depth; // Top level node

  if (ancestorDepth === 0) {
    return false;
  }

  var res = doc.resolve(selection.$to.after(ancestorDepth));
  return res.nodeAfter ? filter(res.nodeAfter) : false;
}
/**
 * Determines if content inside a selection can be joined with the previous block.
 * We need this check since the built-in method for "joinUp" will join a orderedList with bulletList.
 */

export function canJoinUp(selection, doc, nodeType) {
  var res = doc.resolve(selection.$from.before(findAncestorPosition(doc, selection.$from).depth));
  return res.nodeBefore && res.nodeBefore.type === nodeType;
}
/**
 * Finds all "selection-groups" within a range. A selection group is based on ancestors.
 *
 * Example:
 * Given the following document and selection ({<} = start of selection and {>} = end)
 *  doc
 *    blockquote
 *      ul
 *        li
 *        li{<}
 *        li
 *     p
 *     p{>}
 *
 * The output will be two selection-groups. One within the ul and one with the two paragraphs.
 */

export function getGroupsInRange(doc, $from, $to) {
  var isNodeValid = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : validateNode;
  var groups = Array();
  var commonAncestor = hasCommonAncestor(doc, $from, $to);
  var fromAncestor = findAncestorPosition(doc, $from);

  if (commonAncestor || fromAncestor.depth === 1 && isNodeValid($from.node(1))) {
    groups.push({
      $from: $from,
      $to: $to
    });
  } else {
    var current = $from;

    while (current.pos < $to.pos) {
      var ancestorPos = findAncestorPosition(doc, current);

      while (ancestorPos.depth > 1) {
        ancestorPos = findAncestorPosition(doc, ancestorPos);
      }

      var endPos = doc.resolve(Math.min( // should not be smaller then start position in case of an empty paragraph for example.
      Math.max(ancestorPos.start(ancestorPos.depth), ancestorPos.end(ancestorPos.depth) - 3), $to.pos));
      groups.push({
        $from: current,
        $to: endPos
      });
      current = doc.resolve(Math.min(endPos.after(1) + 1, doc.nodeSize - 2));
    }
  }

  return groups;
}
/**
 * Traverse the document until an "ancestor" is found. Any nestable block can be an ancestor.
 */

export function findAncestorPosition(doc, pos) {
  var nestableBlocks = ['blockquote', 'bulletList', 'orderedList'];

  if (pos.depth === 1) {
    return pos;
  }

  var node = pos.node(pos.depth);
  var newPos = pos;

  while (pos.depth >= 1) {
    pos = doc.resolve(pos.before(pos.depth));
    node = pos.node(pos.depth);

    if (node && nestableBlocks.indexOf(node.type.name) !== -1) {
      newPos = pos;
    }
  }

  return newPos;
}
/**
 * Determine if two positions have a common ancestor.
 */

export function hasCommonAncestor(doc, $from, $to) {
  var current;
  var target;

  if ($from.depth > $to.depth) {
    current = findAncestorPosition(doc, $from);
    target = findAncestorPosition(doc, $to);
  } else {
    current = findAncestorPosition(doc, $to);
    target = findAncestorPosition(doc, $from);
  }

  while (current.depth > target.depth && current.depth > 1) {
    current = findAncestorPosition(doc, current);
  }

  return current.node(current.depth) === target.node(target.depth);
}
/**
 * Takes a selection $from and $to and lift all text nodes from their parents to document-level
 */

export function liftSelection(tr, doc, $from, $to) {
  var startPos = $from.start($from.depth);
  var endPos = $to.end($to.depth);
  var target = Math.max(0, findAncestorPosition(doc, $from).depth - 1);
  tr.doc.nodesBetween(startPos, endPos, function (node, pos) {
    if (node.isText || // Text node
    node.isTextblock && !node.textContent // Empty paragraph
    ) {
      var res = tr.doc.resolve(tr.mapping.map(pos));
      var sel = new NodeSelection(res);
      var range = sel.$from.blockRange(sel.$to);

      if (liftTarget(range) !== undefined) {
        tr.lift(range, target);
      }
    }
  });
  startPos = tr.mapping.map(startPos);
  endPos = tr.mapping.map(endPos);
  endPos = tr.doc.resolve(endPos).end(tr.doc.resolve(endPos).depth); // We want to select the entire node

  tr.setSelection(new TextSelection(tr.doc.resolve(startPos), tr.doc.resolve(endPos)));
  return {
    tr: tr,
    $from: tr.doc.resolve(startPos),
    $to: tr.doc.resolve(endPos)
  };
}
/**
 * Lift nodes in block to one level above.
 */

export function liftSiblingNodes(view) {
  var tr = view.state.tr;
  var _view$state$selection = view.state.selection,
      $from = _view$state$selection.$from,
      $to = _view$state$selection.$to;
  var blockStart = tr.doc.resolve($from.start($from.depth - 1));
  var blockEnd = tr.doc.resolve($to.end($to.depth - 1));
  var range = blockStart.blockRange(blockEnd);
  view.dispatch(tr.lift(range, blockStart.depth - 1));
}
/**
 * Lift sibling nodes to document-level and select them.
 */

export function liftAndSelectSiblingNodes(view) {
  var tr = view.state.tr;
  var _view$state$selection2 = view.state.selection,
      $from = _view$state$selection2.$from,
      $to = _view$state$selection2.$to;
  var blockStart = tr.doc.resolve($from.start($from.depth - 1));
  var blockEnd = tr.doc.resolve($to.end($to.depth - 1)); // TODO: [ts30] handle void and null properly

  var range = blockStart.blockRange(blockEnd);
  tr.setSelection(new TextSelection(blockStart, blockEnd));
  tr.lift(range, blockStart.depth - 1);
  return tr;
}
export function wrapIn(nodeType, tr, $from, $to) {
  var range = $from.blockRange($to);
  var wrapping = range && findWrapping(range, nodeType);

  if (wrapping) {
    tr = tr.wrap(range, wrapping).scrollIntoView();
  }

  return tr;
}
var transformer = new JSONTransformer();
export function toJSON(node) {
  return transformer.encode(node);
}
export function nodeToJSON(node) {
  return transformer.encodeNode(node);
}
/**
 * Repeating string for multiple times
 */

export function stringRepeat(text, length) {
  var result = '';

  for (var x = 0; x < length; x++) {
    result += text;
  }

  return result;
}
/**
 * A replacement for `Array.from` until it becomes widely implemented.
 */

export function arrayFrom(obj) {
  return Array.prototype.slice.call(obj);
}
/*
 * From Modernizr
 * Returns the kind of transitionevent available for the element
 */

export function whichTransitionEvent() {
  var el = document.createElement('fakeelement');
  var transitions = {
    transition: 'transitionend',
    MozTransition: 'transitionend',
    OTransition: 'oTransitionEnd',
    WebkitTransition: 'webkitTransitionEnd'
  };

  for (var t in transitions) {
    if (el.style[t] !== undefined) {
      // Use a generic as the return type because TypeScript doesnt know
      // about cross browser features, so we cast here to align to the
      // standard Event spec and propagate the type properly to the callbacks
      // of `addEventListener` and `removeEventListener`.
      return transitions[t];
    }
  }

  return;
}
/**
 * Function will create a list of wrapper blocks present in a selection.
 */

function getSelectedWrapperNodes(state) {
  var nodes = [];

  if (state.selection) {
    var _state$selection = state.selection,
        $from = _state$selection.$from,
        $to = _state$selection.$to;
    var _state$schema$nodes = state.schema.nodes,
        blockquote = _state$schema$nodes.blockquote,
        panel = _state$schema$nodes.panel,
        orderedList = _state$schema$nodes.orderedList,
        bulletList = _state$schema$nodes.bulletList,
        listItem = _state$schema$nodes.listItem,
        codeBlock = _state$schema$nodes.codeBlock,
        decisionItem = _state$schema$nodes.decisionItem,
        decisionList = _state$schema$nodes.decisionList,
        taskItem = _state$schema$nodes.taskItem,
        taskList = _state$schema$nodes.taskList;
    state.doc.nodesBetween($from.pos, $to.pos, function (node) {
      if (node.isBlock && [blockquote, panel, orderedList, bulletList, listItem, codeBlock, decisionItem, decisionList, taskItem, taskList].indexOf(node.type) >= 0) {
        nodes.push(node.type);
      }
    });
  }

  return nodes;
}
/**
 * Function will check if changing block types: Paragraph, Heading is enabled.
 */


export function areBlockTypesDisabled(state) {
  var nodesTypes = getSelectedWrapperNodes(state);
  var panel = state.schema.nodes.panel;
  return nodesTypes.filter(function (type) {
    return type !== panel;
  }).length > 0;
}
export var isTemporary = function isTemporary(id) {
  return id.indexOf('temporary:') === 0;
};
export var isEmptyNode = function isEmptyNode(schema) {
  var _schema$nodes = schema.nodes,
      doc = _schema$nodes.doc,
      paragraph = _schema$nodes.paragraph,
      codeBlock = _schema$nodes.codeBlock,
      blockquote = _schema$nodes.blockquote,
      panel = _schema$nodes.panel,
      heading = _schema$nodes.heading,
      listItem = _schema$nodes.listItem,
      bulletList = _schema$nodes.bulletList,
      orderedList = _schema$nodes.orderedList,
      taskList = _schema$nodes.taskList,
      taskItem = _schema$nodes.taskItem,
      decisionList = _schema$nodes.decisionList,
      decisionItem = _schema$nodes.decisionItem,
      media = _schema$nodes.media,
      mediaGroup = _schema$nodes.mediaGroup,
      mediaSingle = _schema$nodes.mediaSingle;

  var innerIsEmptyNode = function innerIsEmptyNode(node) {
    switch (node.type) {
      case media:
      case mediaGroup:
      case mediaSingle:
        return false;

      case paragraph:
      case codeBlock:
      case heading:
      case taskItem:
      case decisionItem:
        return node.content.size === 0;

      case blockquote:
      case panel:
      case listItem:
        return node.content.size === 2 && innerIsEmptyNode(node.content.firstChild);

      case bulletList:
      case orderedList:
        return node.content.size === 4 && innerIsEmptyNode(node.content.firstChild);

      case taskList:
      case decisionList:
        return node.content.size === 2 && innerIsEmptyNode(node.content.firstChild);

      case doc:
        var isEmpty = true;
        node.content.forEach(function (child) {
          isEmpty = isEmpty && innerIsEmptyNode(child);
        });
        return isEmpty;

      default:
        return isNodeEmpty(node);
    }
  };

  return innerIsEmptyNode;
};
export var insideTableCell = function insideTableCell(state) {
  var _state$schema$nodes2 = state.schema.nodes,
      tableCell = _state$schema$nodes2.tableCell,
      tableHeader = _state$schema$nodes2.tableHeader;
  return hasParentNodeOfType([tableCell, tableHeader])(state.selection);
};
export var isInLayoutColumn = function isInLayoutColumn(state) {
  return hasParentNodeOfType(state.schema.nodes.layoutSection)(state.selection);
};
export var isInListItem = function isInListItem(state) {
  return hasParentNodeOfType(state.schema.nodes.listItem)(state.selection);
};
export var hasOpenEnd = function hasOpenEnd(slice) {
  return slice.openStart > 0 || slice.openEnd > 0;
};
export var isInsideBlockQuote = function isInsideBlockQuote(state) {
  var blockquote = state.schema.nodes.blockquote;
  return hasParentNodeOfType(blockquote)(state.selection);
};
export function filterChildrenBetween(doc, from, to, predicate) {
  var results = [];
  doc.nodesBetween(from, to, function (node, pos, parent) {
    if (predicate(node, pos, parent)) {
      results.push({
        node: node,
        pos: pos
      });
    }
  });
  return results;
}
export function dedupe() {
  var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var iteratee = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (p) {
    return p;
  };

  /**
              .,
    .      _,'f----.._
    |\ ,-'"/  |     ,'
    |,_  ,--.      /
    /,-. ,'`.     (_
    f  o|  o|__     "`-.
    ,-._.,--'_ `.   _.,-`
    `"' ___.,'` j,-'
      `-.__.,--'
    Gotta go fast!
  */
  var seen = new Set();
  list.forEach(function (l) {
    return seen.add(iteratee(l));
  });
  return list.filter(function (l) {
    var it = iteratee(l);

    if (seen.has(it)) {
      seen.delete(it);
      return true;
    }

    return false;
  });
}
export { isTextSelection, isElementInTableCell, isLastItemMediaGroup, nonNullable } from '@atlaskit/editor-common/utils';
/** Helper type for single arg function */

/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
export function compose(func) {
  for (var _len = arguments.length, funcs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    funcs[_key - 1] = arguments[_key];
  }

  var allFuncs = [func].concat(funcs);
  return function composed(raw) {
    return allFuncs.reduceRight(function (memo, func) {
      return func(memo);
    }, raw);
  };
}
// rest
export function pipe() {
  for (var _len2 = arguments.length, fns = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    fns[_key2] = arguments[_key2];
  }

  if (fns.length === 0) {
    return function (a) {
      return a;
    };
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce(function (prevFn, nextFn) {
    return function () {
      return nextFn(prevFn.apply(void 0, arguments));
    };
  });
}
export function shallowEqual() {
  var obj1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var obj2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var keys1 = Object.keys(obj1);
  var keys2 = Object.keys(obj2);
  return keys1.length === keys2.length && keys1.reduce(function (acc, key) {
    return acc && obj1[key] === obj2[key];
  }, true);
}
export function sum(arr, f) {
  return arr.reduce(function (val, x) {
    return val + f(x);
  }, 0);
}
export { SetAttrsStep } from '@atlaskit/adf-schema/steps';
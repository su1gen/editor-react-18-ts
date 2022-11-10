import _typeof from "@babel/runtime/helpers/typeof";
export var isMarkAllowedInRange = function isMarkAllowedInRange(doc, ranges, type) {
  var _loop = function _loop(i) {
    var _ranges$i = ranges[i],
        $from = _ranges$i.$from,
        $to = _ranges$i.$to;
    var can = $from.depth === 0 ? doc.type.allowsMarkType(type) : false;
    doc.nodesBetween($from.pos, $to.pos, function (node) {
      if (can) {
        return false;
      }

      can = node.inlineContent && node.type.allowsMarkType(type);
      return;
    });

    if (can) {
      return {
        v: can
      };
    }
  };

  for (var i = 0; i < ranges.length; i++) {
    var _ret = _loop(i);

    if (_typeof(_ret) === "object") return _ret.v;
  }

  return false;
};
export var isMarkExcluded = function isMarkExcluded(type, marks) {
  if (marks) {
    return marks.some(function (mark) {
      return mark.type !== type && mark.type.excludes(type);
    });
  }

  return false;
};

var not = function not(fn) {
  return function (arg) {
    return !fn(arg);
  };
};

export var removeBlockMarks = function removeBlockMarks(state, marks) {
  var selection = state.selection,
      schema = state.schema;
  var tr = state.tr; // Marks might not exist in Schema

  var marksToRemove = marks.filter(Boolean);

  if (marksToRemove.length === 0) {
    return undefined;
  }
  /** Saves an extra dispatch */


  var blockMarksExists = false;

  var hasMark = function hasMark(mark) {
    return marksToRemove.indexOf(mark.type) > -1;
  };
  /**
   * When you need to toggle the selection
   * when another type which does not allow alignment is applied
   */


  state.doc.nodesBetween(selection.from, selection.to, function (node, pos) {
    if (node.type === schema.nodes.paragraph && node.marks.some(hasMark)) {
      blockMarksExists = true;
      var resolvedPos = state.doc.resolve(pos);
      var withoutBlockMarks = node.marks.filter(not(hasMark));
      tr = tr.setNodeMarkup(resolvedPos.pos, undefined, node.attrs, withoutBlockMarks);
    }
  });
  return blockMarksExists ? tr : undefined;
};
/**
 * Removes marks from nodes in the current selection that are not supported
 */

export var sanitiseSelectionMarksForWrapping = function sanitiseSelectionMarksForWrapping(state, newParentType) {
  var tr = state.tr;
  sanitiseMarksInSelection(tr, newParentType);
  return tr;
};
export var sanitiseMarksInSelection = function sanitiseMarksInSelection(tr, newParentType) {
  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;
  var nodesSanitized = [];
  tr.doc.nodesBetween(from, to, function (node, pos, parent) {
    if (node.isText) {
      return false;
    } // Skip expands and layouts if they are outside selection
    // but continue to iterate over their children.


    if (['expand', 'layoutSection'].includes(node.type.name) && (pos < from || pos > to)) {
      return true;
    }

    node.marks.forEach(function (mark) {
      if (!parent.type.allowsMarkType(mark.type) || newParentType && !newParentType.allowsMarkType(mark.type)) {
        var filteredMarks = node.marks.filter(function (m) {
          return m.type !== mark.type;
        });
        var position = pos > 0 ? pos : 0;
        var marksRemoved = node.marks.filter(function (m) {
          return m.type === mark.type;
        });
        nodesSanitized.push({
          node: node,
          marksRemoved: marksRemoved
        });
        tr.setNodeMarkup(position, undefined, node.attrs, filteredMarks);
      }
    });
  });
  return nodesSanitized;
};
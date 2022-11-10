"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDraftDecoration = void 0;
exports.annotationExists = annotationExists;
exports.containsAnyAnnotations = containsAnyAnnotations;
exports.getPluginState = exports.getDraftCommandAnalyticsPayload = exports.getAnnotationViewKey = exports.getAllAnnotations = exports.findAnnotationsInSelection = exports.filterAnnotationIds = void 0;
exports.getSelectionPositions = getSelectionPositions;
exports.getSelectionStartRect = void 0;
exports.hasAnnotationMark = hasAnnotationMark;
exports.hasInvalidNodes = void 0;
exports.hasInvalidWhitespaceNode = hasInvalidWhitespaceNode;
exports.reorderAnnotations = exports.isSelectionValid = exports.inlineCommentPluginKey = void 0;
exports.stripNonExistingAnnotations = stripNonExistingAnnotations;
exports.surroundingMarks = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _styles = require("@atlaskit/editor-common/styles");

var _utils = require("@atlaskit/editor-common/utils");

var _adfSchema = require("@atlaskit/adf-schema");

var _types = require("./types");

var _utils2 = require("../../utils");

var _analytics = require("../analytics");

/**
 * Finds the marks in the nodes to the left and right.
 * @param $pos Position to center search around
 */
var surroundingMarks = function surroundingMarks($pos) {
  var nodeBefore = $pos.nodeBefore,
      nodeAfter = $pos.nodeAfter;
  var markNodeBefore = nodeBefore && $pos.doc.nodeAt(Math.max(0, $pos.pos - nodeBefore.nodeSize - 1));
  var markNodeAfter = nodeAfter && $pos.doc.nodeAt($pos.pos + nodeAfter.nodeSize);
  return [markNodeBefore && markNodeBefore.marks || [], markNodeAfter && markNodeAfter.marks || []];
};
/**
 * Finds annotation marks, and returns their IDs.
 * @param marks Array of marks to search in
 */


exports.surroundingMarks = surroundingMarks;

var filterAnnotationIds = function filterAnnotationIds(marks) {
  if (!marks.length) {
    return [];
  }

  var annotation = marks[0].type.schema.marks.annotation;
  return marks.filter(function (mark) {
    return mark.type === annotation;
  }).map(function (mark) {
    return mark.attrs.id;
  });
};
/**
 * Re-orders the annotation array based on the order in the document.
 *
 * This places the marks that do not appear in the surrounding nodes
 * higher in the list. That is, the inner-most one appears first.
 *
 * Undo, for example, can re-order annotation marks in the document.
 * @param annotations annotation metadata
 * @param $from location to look around (usually the selection)
 */


exports.filterAnnotationIds = filterAnnotationIds;

var reorderAnnotations = function reorderAnnotations(annotations, $from) {
  var idSet = surroundingMarks($from).map(filterAnnotationIds);
  annotations.sort(function (a, b) {
    return (0, _utils2.sum)(idSet, function (ids) {
      return ids.indexOf(a.id);
    }) - (0, _utils2.sum)(idSet, function (ids) {
      return ids.indexOf(b.id);
    });
  });
};

exports.reorderAnnotations = reorderAnnotations;

var getAllAnnotations = function getAllAnnotations(doc) {
  var allAnnotationIds = new Set();
  doc.descendants(function (node) {
    node.marks.filter(function (mark) {
      return mark.type.name === 'annotation';
    }) // filter out annotations with invalid attribues as they cause errors when interacting with them
    .filter(validateAnnotationMark).forEach(function (m) {
      return allAnnotationIds.add(m.attrs.id);
    });
    return true;
  });
  return Array.from(allAnnotationIds);
};
/*
 * verifies if annotation mark contains valid attributes
 */


exports.getAllAnnotations = getAllAnnotations;

var validateAnnotationMark = function validateAnnotationMark(annotationMark) {
  var _ref = annotationMark.attrs,
      id = _ref.id,
      annotationType = _ref.annotationType;
  return validateAnnotationId(id) && validateAnnotationType(annotationType);

  function validateAnnotationId(id) {
    if (!id || typeof id !== 'string') {
      return false;
    }

    var invalidIds = ['null', 'undefined'];
    return !invalidIds.includes(id.toLowerCase());
  }

  function validateAnnotationType(type) {
    if (!type || typeof type !== 'string') {
      return false;
    }

    var allowedTypes = Object.values(_adfSchema.AnnotationTypes);
    return allowedTypes.includes(type);
  }
}; // helper function: return the first selection range for the window


var getSelectionRange = function getSelectionRange() {
  var selection = window.getSelection(); // no selection made in browser

  if (!selection || selection.isCollapsed) {
    return null;
  }

  var selectionRange = selection.getRangeAt(0);
  return selectionRange;
}; // helper function: find the bounds of first part within selected content


var getSelectionStartRect = function getSelectionStartRect() {
  var range = getSelectionRange();

  if (!range) {
    return null;
  }

  var rects = range.getClientRects();

  if (!rects.length) {
    return null;
  } // Find first selection area that width is not 0
  // Sometimes there is a chance that user is selecting an empty DOM node.


  var firstRect = Array.from(rects).find(function (rect) {
    return rect.width !== 0 && rect.height !== 0;
  });
  return firstRect || null;
};
/*
 * add decoration for the comment selection in draft state
 * (when creating new comment)
 */


exports.getSelectionStartRect = getSelectionStartRect;

var addDraftDecoration = function addDraftDecoration(start, end) {
  return _prosemirrorView.Decoration.inline(start, end, {
    class: "".concat(_styles.AnnotationSharedClassNames.draft)
  });
};

exports.addDraftDecoration = addDraftDecoration;

var getAnnotationViewKey = function getAnnotationViewKey(annotations) {
  var keys = annotations.map(function (mark) {
    return mark.id;
  }).join('_');
  return "view-annotation-wrapper_".concat(keys);
};

exports.getAnnotationViewKey = getAnnotationViewKey;

var findAnnotationsInSelection = function findAnnotationsInSelection(selection, doc) {
  var empty = selection.empty,
      $anchor = selection.$anchor,
      anchor = selection.anchor; // Only detect annotations on caret selection

  if (!empty || !doc) {
    return [];
  }

  var node = doc.nodeAt(anchor);

  if (!node && !$anchor.nodeBefore) {
    return [];
  }

  var annotationMark = doc.type.schema.marks.annotation;
  var nodeBefore = $anchor.nodeBefore;
  var anchorAnnotationMarks = node && node.marks || [];
  var marks = [];

  if (annotationMark.isInSet(anchorAnnotationMarks)) {
    marks = anchorAnnotationMarks;
  } else if (nodeBefore && annotationMark.isInSet(nodeBefore.marks)) {
    marks = nodeBefore.marks;
  }

  var annotations = marks.filter(function (mark) {
    return mark.type.name === 'annotation';
  }).map(function (mark) {
    return {
      id: mark.attrs.id,
      type: mark.attrs.annotationType
    };
  });
  reorderAnnotations(annotations, $anchor);
  return annotations;
};
/**
 * get selection from position to apply new comment for
 * @return bookmarked positions if they exists, otherwise current selection positions
 */


exports.findAnnotationsInSelection = findAnnotationsInSelection;

function getSelectionPositions(editorState, inlineCommentState) {
  var bookmark = inlineCommentState.bookmark; // get positions via saved bookmark if it is available
  // this is to make comments box positioned relative to temporary highlight rather then current selection

  if (bookmark) {
    return bookmark.resolve(editorState.doc);
  }

  return editorState.selection;
}

var inlineCommentPluginKey = new _prosemirrorState.PluginKey('inlineCommentPluginKey');
exports.inlineCommentPluginKey = inlineCommentPluginKey;

var getPluginState = function getPluginState(state) {
  return inlineCommentPluginKey.getState(state);
};
/**
 * get number of unique annotations within current selection
 */


exports.getPluginState = getPluginState;

var getAnnotationsInSelectionCount = function getAnnotationsInSelectionCount(state) {
  var _state$selection = state.selection,
      from = _state$selection.from,
      to = _state$selection.to;
  var annotations = (0, _utils.getAnnotationIdsFromRange)({
    from: from,
    to: to
  }, state.doc, state.schema);
  return annotations.length;
};
/**
 * get payload for the open/close analytics event
 */


var getDraftCommandAnalyticsPayload = function getDraftCommandAnalyticsPayload(drafting, inputMethod) {
  var payload = function payload(state) {
    var attributes = {};

    if (drafting) {
      attributes = {
        inputMethod: inputMethod,
        overlap: getAnnotationsInSelectionCount(state)
      };
    }

    return {
      action: drafting ? _analytics.ACTION.OPENED : _analytics.ACTION.CLOSED,
      actionSubject: _analytics.ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: attributes
    };
  };

  return payload;
};

exports.getDraftCommandAnalyticsPayload = getDraftCommandAnalyticsPayload;

var isSelectionValid = function isSelectionValid(state) {
  var selection = state.selection;

  var _getPluginState = getPluginState(state),
      disallowOnWhitespace = _getPluginState.disallowOnWhitespace;

  if (selection.empty || !(selection instanceof _prosemirrorState.TextSelection || selection instanceof _prosemirrorState.AllSelection)) {
    return _types.AnnotationSelectionType.INVALID;
  }

  var containsInvalidNodes = hasInvalidNodes(state); // A selection that only covers 1 pos, and is an invalid node
  // e.g. a text selection over a mention

  if (containsInvalidNodes && selection.to - selection.from === 1) {
    return _types.AnnotationSelectionType.INVALID;
  }

  if (containsInvalidNodes) {
    return _types.AnnotationSelectionType.DISABLED;
  }

  if (disallowOnWhitespace && hasInvalidWhitespaceNode(selection)) {
    return _types.AnnotationSelectionType.INVALID;
  }

  if (isEmptyTextSelection(selection, state.schema)) {
    return _types.AnnotationSelectionType.INVALID;
  }

  return _types.AnnotationSelectionType.VALID;
};

exports.isSelectionValid = isSelectionValid;

var hasInvalidNodes = function hasInvalidNodes(state) {
  var selection = state.selection,
      doc = state.doc,
      schema = state.schema;
  return !(0, _utils.canApplyAnnotationOnRange)({
    from: selection.from,
    to: selection.to
  }, doc, schema);
};
/**
 * Checks if selection contains only empty text
 * e.g. when you select across multiple empty paragraphs
 */


exports.hasInvalidNodes = hasInvalidNodes;

function isEmptyTextSelection(selection, schema) {
  var _schema$nodes = schema.nodes,
      text = _schema$nodes.text,
      paragraph = _schema$nodes.paragraph;
  var hasContent = false;
  selection.content().content.descendants(function (node) {
    // for empty paragraph - consider empty (nothing to comment on)
    if (node.type === paragraph && !node.content.size) {
      return false;
    } // for not a text or nonempty text - consider nonempty (can comment if the node is supported for annotations)


    if (node.type !== text || !node.textContent) {
      hasContent = true;
    }

    return !hasContent;
  });
  return !hasContent;
}
/**
 * Checks if any of the nodes in a given selection are completely whitespace
 * This is to conform to Confluence annotation specifications
 */


function hasInvalidWhitespaceNode(selection) {
  var foundInvalidWhitespace = false;
  var content = selection.content().content;
  content.descendants(function (node) {
    if (node.textContent.trim() === '') {
      // Trailing new lines do not result in the annotation spanning into
      // the trailing new line so can be ignored when looking for invalid
      // whitespace nodes.
      var nodeIsTrailingNewLine = // it is the final node
      node.eq(content.lastChild) && // and there are multiple nodes
      !node.eq(content.firstChild) && // and it is a paragraph node
      node.type.name === 'paragraph';

      if (!nodeIsTrailingNewLine) {
        foundInvalidWhitespace = true;
      }
    }

    return !foundInvalidWhitespace;
  });
  return foundInvalidWhitespace;
}
/*
 * verifies if node contains annotation mark
 */


function hasAnnotationMark(node, state) {
  var annotationMark = state.schema.marks.annotation;
  return !!(annotationMark && node && node.marks.length && annotationMark.isInSet(node.marks));
}
/*
 * verifies that the annotation exists by the given id
 */


function annotationExists(annotationId, state) {
  var commentsPluginState = getPluginState(state);
  return commentsPluginState.annotations && Object.keys(commentsPluginState.annotations).includes(annotationId);
}
/*
 * verifies that slice contains any annotations
 */


function containsAnyAnnotations(slice, state) {
  if (!slice.content.size) {
    return false;
  }

  var hasAnnotation = false;
  slice.content.forEach(function (node) {
    hasAnnotation = hasAnnotation || hasAnnotationMark(node, state); // return early if annotation found already

    if (hasAnnotation) {
      return true;
    } // check annotations in descendants


    node.descendants(function (node) {
      if (hasAnnotationMark(node, state)) {
        hasAnnotation = true;
        return false;
      }

      return true;
    });
  });
  return hasAnnotation;
}
/*
 * remove annotations that dont exsist in plugin state from slice
 */


function stripNonExistingAnnotations(slice, state) {
  if (!slice.content.size) {
    return false;
  }

  slice.content.forEach(function (node) {
    stripNonExistingAnnotationsFromNode(node, state);
    node.content.descendants(function (node) {
      stripNonExistingAnnotationsFromNode(node, state);
      return true;
    });
  });
}
/*
 * remove annotations that dont exsist in plugin state
 * from node
 */


function stripNonExistingAnnotationsFromNode(node, state) {
  if (hasAnnotationMark(node, state)) {
    node.marks = node.marks.filter(function (mark) {
      if (mark.type.name === 'annotation') {
        return annotationExists(mark.attrs.id, state);
      }

      return true;
    });
  }

  return node;
}
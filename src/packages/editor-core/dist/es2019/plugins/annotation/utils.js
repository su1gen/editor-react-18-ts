import { PluginKey, TextSelection, AllSelection } from 'prosemirror-state';
import { Decoration } from 'prosemirror-view';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common/styles';
import { canApplyAnnotationOnRange, getAnnotationIdsFromRange } from '@atlaskit/editor-common/utils';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationSelectionType } from './types';
import { sum } from '../../utils';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, ACTION } from '../analytics';

/**
 * Finds the marks in the nodes to the left and right.
 * @param $pos Position to center search around
 */
export const surroundingMarks = $pos => {
  const {
    nodeBefore,
    nodeAfter
  } = $pos;
  const markNodeBefore = nodeBefore && $pos.doc.nodeAt(Math.max(0, $pos.pos - nodeBefore.nodeSize - 1));
  const markNodeAfter = nodeAfter && $pos.doc.nodeAt($pos.pos + nodeAfter.nodeSize);
  return [markNodeBefore && markNodeBefore.marks || [], markNodeAfter && markNodeAfter.marks || []];
};
/**
 * Finds annotation marks, and returns their IDs.
 * @param marks Array of marks to search in
 */

export const filterAnnotationIds = marks => {
  if (!marks.length) {
    return [];
  }

  const {
    annotation
  } = marks[0].type.schema.marks;
  return marks.filter(mark => mark.type === annotation).map(mark => mark.attrs.id);
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

export const reorderAnnotations = (annotations, $from) => {
  const idSet = surroundingMarks($from).map(filterAnnotationIds);
  annotations.sort((a, b) => sum(idSet, ids => ids.indexOf(a.id)) - sum(idSet, ids => ids.indexOf(b.id)));
};
export const getAllAnnotations = doc => {
  const allAnnotationIds = new Set();
  doc.descendants(node => {
    node.marks.filter(mark => mark.type.name === 'annotation') // filter out annotations with invalid attribues as they cause errors when interacting with them
    .filter(validateAnnotationMark).forEach(m => allAnnotationIds.add(m.attrs.id));
    return true;
  });
  return Array.from(allAnnotationIds);
};
/*
 * verifies if annotation mark contains valid attributes
 */

const validateAnnotationMark = annotationMark => {
  const {
    id,
    annotationType
  } = annotationMark.attrs;
  return validateAnnotationId(id) && validateAnnotationType(annotationType);

  function validateAnnotationId(id) {
    if (!id || typeof id !== 'string') {
      return false;
    }

    const invalidIds = ['null', 'undefined'];
    return !invalidIds.includes(id.toLowerCase());
  }

  function validateAnnotationType(type) {
    if (!type || typeof type !== 'string') {
      return false;
    }

    const allowedTypes = Object.values(AnnotationTypes);
    return allowedTypes.includes(type);
  }
}; // helper function: return the first selection range for the window


const getSelectionRange = function () {
  const selection = window.getSelection(); // no selection made in browser

  if (!selection || selection.isCollapsed) {
    return null;
  }

  const selectionRange = selection.getRangeAt(0);
  return selectionRange;
}; // helper function: find the bounds of first part within selected content


export const getSelectionStartRect = () => {
  const range = getSelectionRange();

  if (!range) {
    return null;
  }

  const rects = range.getClientRects();

  if (!rects.length) {
    return null;
  } // Find first selection area that width is not 0
  // Sometimes there is a chance that user is selecting an empty DOM node.


  const firstRect = Array.from(rects).find(rect => rect.width !== 0 && rect.height !== 0);
  return firstRect || null;
};
/*
 * add decoration for the comment selection in draft state
 * (when creating new comment)
 */

export const addDraftDecoration = (start, end) => {
  return Decoration.inline(start, end, {
    class: `${AnnotationSharedClassNames.draft}`
  });
};
export const getAnnotationViewKey = annotations => {
  const keys = annotations.map(mark => mark.id).join('_');
  return `view-annotation-wrapper_${keys}`;
};
export const findAnnotationsInSelection = (selection, doc) => {
  const {
    empty,
    $anchor,
    anchor
  } = selection; // Only detect annotations on caret selection

  if (!empty || !doc) {
    return [];
  }

  const node = doc.nodeAt(anchor);

  if (!node && !$anchor.nodeBefore) {
    return [];
  }

  const annotationMark = doc.type.schema.marks.annotation;
  const nodeBefore = $anchor.nodeBefore;
  const anchorAnnotationMarks = node && node.marks || [];
  let marks = [];

  if (annotationMark.isInSet(anchorAnnotationMarks)) {
    marks = anchorAnnotationMarks;
  } else if (nodeBefore && annotationMark.isInSet(nodeBefore.marks)) {
    marks = nodeBefore.marks;
  }

  const annotations = marks.filter(mark => mark.type.name === 'annotation').map(mark => ({
    id: mark.attrs.id,
    type: mark.attrs.annotationType
  }));
  reorderAnnotations(annotations, $anchor);
  return annotations;
};
/**
 * get selection from position to apply new comment for
 * @return bookmarked positions if they exists, otherwise current selection positions
 */

export function getSelectionPositions(editorState, inlineCommentState) {
  const {
    bookmark
  } = inlineCommentState; // get positions via saved bookmark if it is available
  // this is to make comments box positioned relative to temporary highlight rather then current selection

  if (bookmark) {
    return bookmark.resolve(editorState.doc);
  }

  return editorState.selection;
}
export const inlineCommentPluginKey = new PluginKey('inlineCommentPluginKey');
export const getPluginState = state => {
  return inlineCommentPluginKey.getState(state);
};
/**
 * get number of unique annotations within current selection
 */

const getAnnotationsInSelectionCount = state => {
  const {
    from,
    to
  } = state.selection;
  const annotations = getAnnotationIdsFromRange({
    from,
    to
  }, state.doc, state.schema);
  return annotations.length;
};
/**
 * get payload for the open/close analytics event
 */


export const getDraftCommandAnalyticsPayload = (drafting, inputMethod) => {
  const payload = state => {
    let attributes = {};

    if (drafting) {
      attributes = {
        inputMethod,
        overlap: getAnnotationsInSelectionCount(state)
      };
    }

    return {
      action: drafting ? ACTION.OPENED : ACTION.CLOSED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes
    };
  };

  return payload;
};
export const isSelectionValid = state => {
  const {
    selection
  } = state;
  const {
    disallowOnWhitespace
  } = getPluginState(state);

  if (selection.empty || !(selection instanceof TextSelection || selection instanceof AllSelection)) {
    return AnnotationSelectionType.INVALID;
  }

  const containsInvalidNodes = hasInvalidNodes(state); // A selection that only covers 1 pos, and is an invalid node
  // e.g. a text selection over a mention

  if (containsInvalidNodes && selection.to - selection.from === 1) {
    return AnnotationSelectionType.INVALID;
  }

  if (containsInvalidNodes) {
    return AnnotationSelectionType.DISABLED;
  }

  if (disallowOnWhitespace && hasInvalidWhitespaceNode(selection)) {
    return AnnotationSelectionType.INVALID;
  }

  if (isEmptyTextSelection(selection, state.schema)) {
    return AnnotationSelectionType.INVALID;
  }

  return AnnotationSelectionType.VALID;
};
export const hasInvalidNodes = state => {
  const {
    selection,
    doc,
    schema
  } = state;
  return !canApplyAnnotationOnRange({
    from: selection.from,
    to: selection.to
  }, doc, schema);
};
/**
 * Checks if selection contains only empty text
 * e.g. when you select across multiple empty paragraphs
 */

function isEmptyTextSelection(selection, schema) {
  const {
    text,
    paragraph
  } = schema.nodes;
  let hasContent = false;
  selection.content().content.descendants(node => {
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


export function hasInvalidWhitespaceNode(selection) {
  let foundInvalidWhitespace = false;
  const content = selection.content().content;
  content.descendants(node => {
    if (node.textContent.trim() === '') {
      // Trailing new lines do not result in the annotation spanning into
      // the trailing new line so can be ignored when looking for invalid
      // whitespace nodes.
      const nodeIsTrailingNewLine = // it is the final node
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

export function hasAnnotationMark(node, state) {
  const {
    schema: {
      marks: {
        annotation: annotationMark
      }
    }
  } = state;
  return !!(annotationMark && node && node.marks.length && annotationMark.isInSet(node.marks));
}
/*
 * verifies that the annotation exists by the given id
 */

export function annotationExists(annotationId, state) {
  const commentsPluginState = getPluginState(state);
  return commentsPluginState.annotations && Object.keys(commentsPluginState.annotations).includes(annotationId);
}
/*
 * verifies that slice contains any annotations
 */

export function containsAnyAnnotations(slice, state) {
  if (!slice.content.size) {
    return false;
  }

  let hasAnnotation = false;
  slice.content.forEach(node => {
    hasAnnotation = hasAnnotation || hasAnnotationMark(node, state); // return early if annotation found already

    if (hasAnnotation) {
      return true;
    } // check annotations in descendants


    node.descendants(node => {
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

export function stripNonExistingAnnotations(slice, state) {
  if (!slice.content.size) {
    return false;
  }

  slice.content.forEach(node => {
    stripNonExistingAnnotationsFromNode(node, state);
    node.content.descendants(node => {
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
    node.marks = node.marks.filter(mark => {
      if (mark.type.name === 'annotation') {
        return annotationExists(mark.attrs.id, state);
      }

      return true;
    });
  }

  return node;
}
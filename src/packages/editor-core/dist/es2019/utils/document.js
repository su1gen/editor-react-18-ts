import { Node } from 'prosemirror-model';
import { transformMediaLinkMarks, transformTextLinkCodeMarks, transformDedupeMarks, transformNodesMissingContent, transformIndentationMarks } from '@atlaskit/adf-utils/transforms';
import { sanitizeNodeForPrivacy } from '../utils/filter/privacy-filter';
import { validateADFEntity, findAndTrackUnsupportedContentNodes } from '@atlaskit/editor-common/utils';
import { getBreakoutMode } from './node-width';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../plugins/analytics/types/enums';
/**
 * Checks if node is an empty paragraph.
 */

export function isEmptyParagraph(node) {
  return !!node && node.type.name === 'paragraph' && !node.childCount;
}
/**
 * Returns false if node contains only empty inline nodes and hardBreaks.
 */

export function hasVisibleContent(node) {
  const isInlineNodeHasVisibleContent = inlineNode => {
    return inlineNode.isText ? !!inlineNode.textContent.trim() : inlineNode.type.name !== 'hardBreak';
  };

  if (node.isInline) {
    return isInlineNodeHasVisibleContent(node);
  } else if (node.isBlock && (node.isLeaf || node.isAtom)) {
    return true;
  } else if (!node.childCount) {
    return false;
  }

  for (let index = 0; index < node.childCount; index++) {
    const child = node.child(index);

    if (hasVisibleContent(child)) {
      return true;
    }
  }

  return false;
}
/**
 * Checks if a node has any content. Ignores node that only contain empty block nodes.
 */

export function isNodeEmpty(node) {
  if (node && node.textContent) {
    return false;
  }

  if (!node || !node.childCount || node.childCount === 1 && isEmptyParagraph(node.firstChild)) {
    return true;
  }

  const block = [];
  const nonBlock = [];
  node.forEach(child => {
    child.isInline ? nonBlock.push(child) : block.push(child);
  });
  return !nonBlock.length && !block.filter(childNode => !!childNode.childCount && !(childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild)) || childNode.isAtom).length;
}
/**
 * Checks if a node looks like an empty document
 */

export function isEmptyDocument(node) {
  const nodeChild = node.content.firstChild;

  if (node.childCount !== 1 || !nodeChild) {
    return false;
  }

  return isEmptyParagraph(nodeChild);
} // Checks to see if the parent node is the document, ie not contained within another entity

export function hasDocAsParent($anchor) {
  return $anchor.depth === 1;
}
export function isProseMirrorSchemaCheckError(error) {
  return error instanceof RangeError && (!!error.message.match(/^Invalid collection of marks for node/) || !!error.message.match(/^Invalid content for node/));
}
export function isInEmptyLine(state) {
  const {
    selection
  } = state;
  const {
    $cursor,
    $anchor
  } = selection;

  if (!$cursor) {
    return false;
  }

  const node = $cursor.node();

  if (!node) {
    return false;
  }

  return isEmptyParagraph(node) && hasDocAsParent($anchor);
}
export function bracketTyped(state) {
  const {
    selection
  } = state;
  const {
    $cursor,
    $anchor
  } = selection;

  if (!$cursor) {
    return false;
  }

  const node = $cursor.nodeBefore;

  if (!node) {
    return false;
  }

  if (node.type.name === 'text' && node.text === '{') {
    const paragraphNode = $anchor.node();
    return paragraphNode.marks.length === 0 && hasDocAsParent($anchor);
  }

  return false;
}
export function processRawValue(schema, value, providerFactory, sanitizePrivateContent, contentTransformer, dispatchAnalyticsEvent) {
  if (!value) {
    return;
  }

  let node;

  if (typeof value === 'string') {
    try {
      if (contentTransformer) {
        const doc = contentTransformer.parse(value);
        node = doc.toJSON();
      } else {
        node = JSON.parse(value);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Error processing value: ${value} isn't a valid JSON`);
      return;
    }
  } else {
    node = value;
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-console
    console.error(`Error processing value: ${node} is an array, but it must be an object.`);
    return;
  }

  try {
    // ProseMirror always require a child under doc
    if (node.type === 'doc') {
      if (Array.isArray(node.content) && node.content.length === 0) {
        node.content.push({
          type: 'paragraph',
          content: []
        });
      } // Just making sure doc is always valid


      if (!node.version) {
        node.version = 1;
      }
    }

    if (contentTransformer) {
      return Node.fromJSON(schema, node);
    } // link mark on mediaSingle is deprecated, need to move link mark to child media node
    // https://product-fabric.atlassian.net/browse/ED-14043


    let {
      transformedAdf,
      isTransformed
    } = transformMediaLinkMarks(node);

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.MEDIA_LINK_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    } // See: HOT-97965 https://product-fabric.atlassian.net/browse/ED-14400
    // We declared in code mark spec that links and marks should not co-exist on
    // text nodes. This util strips code marks from bad text nodes and preserves links.
    // Otherwise, prosemirror will try to repair the invalid document by stripping links
    // and preserving code marks during content changes.


    ({
      transformedAdf,
      isTransformed
    } = transformTextLinkCodeMarks(transformedAdf));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.TEXT_LINK_MARK_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    }

    let discardedMarks = [];
    ({
      transformedAdf,
      isTransformed,
      discardedMarks
    } = transformDedupeMarks(transformedAdf));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.DEDUPE_MARKS_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          discardedMarks
        }
      });
    }

    ({
      transformedAdf,
      isTransformed
    } = transformNodesMissingContent(transformedAdf));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.NODES_MISSING_CONTENT_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    }

    ({
      transformedAdf,
      isTransformed
    } = transformIndentationMarks(transformedAdf));

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.INDENTATION_MARKS_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    }

    const entity = validateADFEntity(schema, transformedAdf || node, dispatchAnalyticsEvent);
    let newEntity = maySanitizePrivateContent(entity, providerFactory, sanitizePrivateContent);
    const parsedDoc = Node.fromJSON(schema, newEntity); // throws an error if the document is invalid

    try {
      parsedDoc.check();
    } catch (err) {
      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          action: ACTION.INVALID_PROSEMIRROR_DOCUMENT,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            errorStack: err instanceof Error ? err.stack : String(err)
          }
        });
      }

      throw err;
    }

    if (dispatchAnalyticsEvent) {
      findAndTrackUnsupportedContentNodes(parsedDoc, schema, dispatchAnalyticsEvent);
    }

    return parsedDoc;
  } catch (e) {
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.DOCUMENT_PROCESSING_ERROR,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          errorStack: e instanceof Error ? e.stack : String(e)
        }
      });
    } // eslint-disable-next-line no-console


    console.error(`Error processing document:\n${e instanceof Error ? e.message : String(e)}\n\n`, JSON.stringify(node));

    if (isProseMirrorSchemaCheckError(e)) {
      throw e;
    }

    return;
  }
}

const maySanitizePrivateContent = (entity, providerFactory, sanitizePrivateContent) => {
  if (sanitizePrivateContent && providerFactory) {
    return sanitizeNodeForPrivacy(entity, providerFactory);
  }

  return entity;
};

export const getStepRange = transaction => {
  let from = -1;
  let to = -1;
  transaction.steps.forEach(step => {
    step.getMap().forEach((_oldStart, _oldEnd, newStart, newEnd) => {
      from = newStart < from || from === -1 ? newStart : from;
      to = newEnd < to || to === -1 ? newEnd : to;
    });
  });

  if (from !== -1) {
    return {
      from,
      to
    };
  }

  return null;
};
/**
 * Find the farthest node given a condition
 * @param predicate Function to check the node
 */

export const findFarthestParentNode = predicate => $pos => {
  let candidate = null;

  for (let i = $pos.depth; i > 0; i--) {
    const node = $pos.node(i);

    if (predicate(node)) {
      candidate = {
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
        depth: i,
        node
      };
    }
  }

  return candidate;
};
export const isSelectionEndOfParagraph = state => state.selection.$to.parent.type === state.schema.nodes.paragraph && state.selection.$to.pos === state.doc.resolve(state.selection.$to.pos).end();
export function getChangedNodesIn({
  tr,
  doc
}) {
  const nodes = [];
  const stepRange = getStepRange(tr);

  if (!stepRange) {
    return nodes;
  }

  const from = Math.min(doc.nodeSize - 2, stepRange.from);
  const to = Math.min(doc.nodeSize - 2, stepRange.to);
  doc.nodesBetween(from, to, (node, pos) => {
    nodes.push({
      node,
      pos
    });
  });
  return nodes;
}
export function getChangedNodes(tr) {
  return getChangedNodesIn({
    tr: tr,
    doc: tr.doc
  });
}
export function nodesBetweenChanged(tr, f, startPos) {
  const stepRange = getStepRange(tr);

  if (!stepRange) {
    return;
  }

  tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}
export function getNodesCount(node) {
  let count = {};
  node.nodesBetween(0, node.nodeSize - 2, node => {
    count[node.type.name] = (count[node.type.name] || 0) + 1;
  });
  return count;
}
/**
 * Returns a set of active child breakout modes
 */

export function getChildBreakoutModes(doc, schema, filter = ['wide', 'full-width']) {
  const breakoutModes = new Set();

  if (doc.type.name === 'doc' && doc.childCount) {
    for (let i = 0; i < doc.childCount; ++i) {
      if (breakoutModes.size === filter.length) {
        break;
      }

      const breakoutMode = getBreakoutMode(doc.child(i), schema.marks.breakout);

      if (breakoutMode && filter.includes(breakoutMode)) {
        breakoutModes.add(breakoutMode);
      }
    }
  }

  return [...breakoutModes];
}
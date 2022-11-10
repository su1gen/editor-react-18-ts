import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
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
  var isInlineNodeHasVisibleContent = function isInlineNodeHasVisibleContent(inlineNode) {
    return inlineNode.isText ? !!inlineNode.textContent.trim() : inlineNode.type.name !== 'hardBreak';
  };

  if (node.isInline) {
    return isInlineNodeHasVisibleContent(node);
  } else if (node.isBlock && (node.isLeaf || node.isAtom)) {
    return true;
  } else if (!node.childCount) {
    return false;
  }

  for (var _index = 0; _index < node.childCount; _index++) {
    var child = node.child(_index);

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

  var block = [];
  var nonBlock = [];
  node.forEach(function (child) {
    child.isInline ? nonBlock.push(child) : block.push(child);
  });
  return !nonBlock.length && !block.filter(function (childNode) {
    return !!childNode.childCount && !(childNode.childCount === 1 && isEmptyParagraph(childNode.firstChild)) || childNode.isAtom;
  }).length;
}
/**
 * Checks if a node looks like an empty document
 */

export function isEmptyDocument(node) {
  var nodeChild = node.content.firstChild;

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
  var selection = state.selection;
  var _ref = selection,
      $cursor = _ref.$cursor,
      $anchor = _ref.$anchor;

  if (!$cursor) {
    return false;
  }

  var node = $cursor.node();

  if (!node) {
    return false;
  }

  return isEmptyParagraph(node) && hasDocAsParent($anchor);
}
export function bracketTyped(state) {
  var selection = state.selection;
  var _ref2 = selection,
      $cursor = _ref2.$cursor,
      $anchor = _ref2.$anchor;

  if (!$cursor) {
    return false;
  }

  var node = $cursor.nodeBefore;

  if (!node) {
    return false;
  }

  if (node.type.name === 'text' && node.text === '{') {
    var paragraphNode = $anchor.node();
    return paragraphNode.marks.length === 0 && hasDocAsParent($anchor);
  }

  return false;
}
export function processRawValue(schema, value, providerFactory, sanitizePrivateContent, contentTransformer, dispatchAnalyticsEvent) {
  if (!value) {
    return;
  }

  var node;

  if (typeof value === 'string') {
    try {
      if (contentTransformer) {
        var doc = contentTransformer.parse(value);
        node = doc.toJSON();
      } else {
        node = JSON.parse(value);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error processing value: ".concat(value, " isn't a valid JSON"));
      return;
    }
  } else {
    node = value;
  }

  if (Array.isArray(node)) {
    // eslint-disable-next-line no-console
    console.error("Error processing value: ".concat(node, " is an array, but it must be an object."));
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


    var _transformMediaLinkMa = transformMediaLinkMarks(node),
        transformedAdf = _transformMediaLinkMa.transformedAdf,
        isTransformed = _transformMediaLinkMa.isTransformed;

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


    var _transformTextLinkCod = transformTextLinkCodeMarks(transformedAdf);

    transformedAdf = _transformTextLinkCod.transformedAdf;
    isTransformed = _transformTextLinkCod.isTransformed;

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.TEXT_LINK_MARK_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    }

    var discardedMarks = [];

    var _transformDedupeMarks = transformDedupeMarks(transformedAdf);

    transformedAdf = _transformDedupeMarks.transformedAdf;
    isTransformed = _transformDedupeMarks.isTransformed;
    discardedMarks = _transformDedupeMarks.discardedMarks;

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.DEDUPE_MARKS_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          discardedMarks: discardedMarks
        }
      });
    }

    var _transformNodesMissin = transformNodesMissingContent(transformedAdf);

    transformedAdf = _transformNodesMissin.transformedAdf;
    isTransformed = _transformNodesMissin.isTransformed;

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.NODES_MISSING_CONTENT_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    }

    var _transformIndentation = transformIndentationMarks(transformedAdf);

    transformedAdf = _transformIndentation.transformedAdf;
    isTransformed = _transformIndentation.isTransformed;

    if (isTransformed && dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.INDENTATION_MARKS_TRANSFORMED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL
      });
    }

    var entity = validateADFEntity(schema, transformedAdf || node, dispatchAnalyticsEvent);
    var newEntity = maySanitizePrivateContent(entity, providerFactory, sanitizePrivateContent);
    var parsedDoc = Node.fromJSON(schema, newEntity); // throws an error if the document is invalid

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


    console.error("Error processing document:\n".concat(e instanceof Error ? e.message : String(e), "\n\n"), JSON.stringify(node));

    if (isProseMirrorSchemaCheckError(e)) {
      throw e;
    }

    return;
  }
}

var maySanitizePrivateContent = function maySanitizePrivateContent(entity, providerFactory, sanitizePrivateContent) {
  if (sanitizePrivateContent && providerFactory) {
    return sanitizeNodeForPrivacy(entity, providerFactory);
  }

  return entity;
};

export var getStepRange = function getStepRange(transaction) {
  var from = -1;
  var to = -1;
  transaction.steps.forEach(function (step) {
    step.getMap().forEach(function (_oldStart, _oldEnd, newStart, newEnd) {
      from = newStart < from || from === -1 ? newStart : from;
      to = newEnd < to || to === -1 ? newEnd : to;
    });
  });

  if (from !== -1) {
    return {
      from: from,
      to: to
    };
  }

  return null;
};
/**
 * Find the farthest node given a condition
 * @param predicate Function to check the node
 */

export var findFarthestParentNode = function findFarthestParentNode(predicate) {
  return function ($pos) {
    var candidate = null;

    for (var i = $pos.depth; i > 0; i--) {
      var _node = $pos.node(i);

      if (predicate(_node)) {
        candidate = {
          pos: i > 0 ? $pos.before(i) : 0,
          start: $pos.start(i),
          depth: i,
          node: _node
        };
      }
    }

    return candidate;
  };
};
export var isSelectionEndOfParagraph = function isSelectionEndOfParagraph(state) {
  return state.selection.$to.parent.type === state.schema.nodes.paragraph && state.selection.$to.pos === state.doc.resolve(state.selection.$to.pos).end();
};
export function getChangedNodesIn(_ref3) {
  var tr = _ref3.tr,
      doc = _ref3.doc;
  var nodes = [];
  var stepRange = getStepRange(tr);

  if (!stepRange) {
    return nodes;
  }

  var from = Math.min(doc.nodeSize - 2, stepRange.from);
  var to = Math.min(doc.nodeSize - 2, stepRange.to);
  doc.nodesBetween(from, to, function (node, pos) {
    nodes.push({
      node: node,
      pos: pos
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
  var stepRange = getStepRange(tr);

  if (!stepRange) {
    return;
  }

  tr.doc.nodesBetween(stepRange.from, stepRange.to, f, startPos);
}
export function getNodesCount(node) {
  var count = {};
  node.nodesBetween(0, node.nodeSize - 2, function (node) {
    count[node.type.name] = (count[node.type.name] || 0) + 1;
  });
  return count;
}
/**
 * Returns a set of active child breakout modes
 */

export function getChildBreakoutModes(doc, schema) {
  var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ['wide', 'full-width'];
  var breakoutModes = new Set();

  if (doc.type.name === 'doc' && doc.childCount) {
    for (var i = 0; i < doc.childCount; ++i) {
      if (breakoutModes.size === filter.length) {
        break;
      }

      var breakoutMode = getBreakoutMode(doc.child(i), schema.marks.breakout);

      if (breakoutMode && filter.includes(breakoutMode)) {
        breakoutModes.add(breakoutMode);
      }
    }
  }

  return _toConsumableArray(breakoutModes);
}
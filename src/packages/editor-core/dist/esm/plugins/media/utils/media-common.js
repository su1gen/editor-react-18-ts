import { deleteSelection, splitBlock } from 'prosemirror-commands';
import { Fragment } from 'prosemirror-model';
import { NodeSelection } from 'prosemirror-state';
import { findPositionOfNodeBefore } from 'prosemirror-utils';
import { createParagraphNear, createNewParagraphBelow } from '../../../commands';
import { isTemporary } from '../../../utils';
import { mapSlice } from '../../../utils/slice';
import { walkUpTreeUntil, removeNestedEmptyEls, unwrap } from '../../../utils/dom';
import { isImage } from './is-image';
import { atTheBeginningOfBlock, atTheBeginningOfDoc, atTheEndOfBlock, endPositionOfParent, startPositionOfParent } from '../../../utils/prosemirror/position';
import { GapCursorSelection } from '../../selection/gap-cursor/selection';
import { isMediaBlobUrl } from '@atlaskit/media-client';
export var isMediaBlobUrlFromAttrs = function isMediaBlobUrlFromAttrs(attrs) {
  return !!(attrs && attrs.type === 'external' && isMediaBlobUrl(attrs.url));
};
export var posOfMediaGroupNearby = function posOfMediaGroupNearby(state) {
  return posOfParentMediaGroup(state) || posOfFollowingMediaGroup(state) || posOfPrecedingMediaGroup(state) || posOfMediaGroupNextToGapCursor(state);
};
export var isSelectionNonMediaBlockNode = function isSelectionNonMediaBlockNode(state) {
  var _ref = state.selection,
      node = _ref.node;
  return node && node.type !== state.schema.nodes.media && node.isBlock;
};
export var isSelectionMediaSingleNode = function isSelectionMediaSingleNode(state) {
  var _ref2 = state.selection,
      node = _ref2.node;
  return node && node.type === state.schema.nodes.mediaSingle;
};
export var posOfPrecedingMediaGroup = function posOfPrecedingMediaGroup(state) {
  if (!atTheBeginningOfBlock(state)) {
    return;
  }

  return posOfMediaGroupAbove(state, state.selection.$from);
};

var posOfMediaGroupNextToGapCursor = function posOfMediaGroupNextToGapCursor(state) {
  var selection = state.selection;

  if (selection instanceof GapCursorSelection) {
    var $pos = state.selection.$from;
    var mediaGroupType = state.schema.nodes.mediaGroup;
    return posOfImmediatePrecedingMediaGroup($pos, mediaGroupType) || posOfImmediateFollowingMediaGroup($pos, mediaGroupType);
  }
};

var posOfImmediatePrecedingMediaGroup = function posOfImmediatePrecedingMediaGroup($pos, mediaGroupType) {
  if ($pos.nodeBefore && $pos.nodeBefore.type === mediaGroupType) {
    return $pos.pos - $pos.nodeBefore.nodeSize + 1;
  }
};

var posOfImmediateFollowingMediaGroup = function posOfImmediateFollowingMediaGroup($pos, mediaGroupType) {
  if ($pos.nodeAfter && $pos.nodeAfter.type === mediaGroupType) {
    return $pos.pos + 1;
  }
};

var posOfFollowingMediaGroup = function posOfFollowingMediaGroup(state) {
  if (!atTheEndOfBlock(state)) {
    return;
  }

  return posOfMediaGroupBelow(state, state.selection.$to);
};

var posOfMediaGroupAbove = function posOfMediaGroupAbove(state, $pos) {
  var adjacentPos;
  var adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeBefore;
  } else {
    adjacentPos = startPositionOfParent($pos) - 1;
    adjacentNode = state.doc.resolve(adjacentPos).nodeBefore;
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return adjacentPos - adjacentNode.nodeSize + 1;
  }

  return;
};
/**
 * Determine whether the cursor is inside empty paragraph
 * or the selection is the entire paragraph
 */


export var isInsidePotentialEmptyParagraph = function isInsidePotentialEmptyParagraph(state) {
  var $from = state.selection.$from;
  return $from.parent.type === state.schema.nodes.paragraph && atTheBeginningOfBlock(state) && atTheEndOfBlock(state);
};
export var posOfMediaGroupBelow = function posOfMediaGroupBelow(state, $pos) {
  var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var adjacentPos;
  var adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeAfter;
  } else {
    adjacentPos = endPositionOfParent($pos);
    adjacentNode = state.doc.nodeAt(adjacentPos);
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return prepend ? adjacentPos + 1 : adjacentPos + adjacentNode.nodeSize - 1;
  }

  return;
};
export var posOfParentMediaGroup = function posOfParentMediaGroup(state, $pos) {
  var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var $from = state.selection.$from;
  $pos = $pos || $from;

  if ($pos.parent.type === state.schema.nodes.mediaGroup) {
    return prepend ? startPositionOfParent($pos) : endPositionOfParent($pos) - 1;
  }

  return;
};
/**
 * The function will return the position after current selection where mediaGroup can be inserted.
 */

export function endPositionForMedia(state, resolvedPos) {
  var mediaGroup = state.schema.nodes.mediaGroup;
  var i = resolvedPos.depth;

  for (; i > 1; i--) {
    var nodeType = resolvedPos.node(i).type;

    if (nodeType.validContent(Fragment.from(mediaGroup.create()))) {
      break;
    }
  }

  return resolvedPos.end(i) + 1;
}
export var removeMediaNode = function removeMediaNode(view, node, getPos) {
  var id = node.attrs.id;
  var state = view.state;
  var tr = state.tr,
      selection = state.selection,
      doc = state.doc;
  var currentMediaNodePos = getPos();
  tr.deleteRange(currentMediaNodePos, currentMediaNodePos + node.nodeSize);

  if (isTemporary(id)) {
    tr.setMeta('addToHistory', false);
  }

  var $currentMediaNodePos = doc.resolve(currentMediaNodePos);
  var nodeBefore = $currentMediaNodePos.nodeBefore,
      parent = $currentMediaNodePos.parent;
  var isLastMediaNode = $currentMediaNodePos.index() === parent.childCount - 1; // If deleting a selected media node, we need to tell where the cursor to go next.
  // Prosemirror didn't gave us the behaviour of moving left if the media node is not the last one.
  // So we handle it ourselves.

  if (selection.from === currentMediaNodePos && !isLastMediaNode && !atTheBeginningOfDoc(state) && nodeBefore && nodeBefore.type.name === 'media') {
    var _nodeBefore = findPositionOfNodeBefore(tr.selection);

    if (_nodeBefore) {
      tr.setSelection(NodeSelection.create(tr.doc, _nodeBefore));
    }
  }

  view.dispatch(tr);
};
export var splitMediaGroup = function splitMediaGroup(view) {
  var selection = view.state.selection; // if selection is not a media node, do nothing.

  if (!(selection instanceof NodeSelection) || selection.node.type !== view.state.schema.nodes.media) {
    return false;
  }

  deleteSelection(view.state, view.dispatch);

  if (selection.$to.nodeAfter) {
    splitBlock(view.state, view.dispatch);
    createParagraphNear(false)(view.state, view.dispatch);
  } else {
    createNewParagraphBelow(view.state, view.dispatch);
  }

  return true;
};

var isOptionalAttr = function isOptionalAttr(attr) {
  return attr.length > 1 && attr[0] === '_' && attr[1] === '_';
};

export var copyOptionalAttrsFromMediaState = function copyOptionalAttrsFromMediaState(mediaState, node) {
  Object.keys(node.attrs).filter(isOptionalAttr).forEach(function (key) {
    var mediaStateKey = key.substring(2);
    var attrValue = mediaState[mediaStateKey];

    if (attrValue !== undefined) {
      node.attrs[key] = attrValue;
    }
  });
};
export var transformSliceToCorrectMediaWrapper = function transformSliceToCorrectMediaWrapper(slice, schema) {
  var _schema$nodes = schema.nodes,
      mediaGroup = _schema$nodes.mediaGroup,
      mediaSingle = _schema$nodes.mediaSingle,
      media = _schema$nodes.media;
  return mapSlice(slice, function (node, parent) {
    if (!parent && node.type === media) {
      if (mediaSingle && (isImage(node.attrs.__fileMimeType) || node.attrs.type === 'external')) {
        return mediaSingle.createChecked({}, node);
      } else {
        return mediaGroup.createChecked({}, [node]);
      }
    }

    return node;
  });
};
/**
 * Check base styles to see if an element will be invisible when rendered in a document.
 * @param element
 */

var isElementInvisible = function isElementInvisible(element) {
  return element.style.opacity === '0' || element.style.display === 'none' || element.style.visibility === 'hidden';
};

var VALID_TAGS_CONTAINER = ['DIV', 'TD'];

function canContainImage(element) {
  if (!element) {
    return false;
  }

  return VALID_TAGS_CONTAINER.indexOf(element.tagName) !== -1;
}
/**
 * Given a html string, we attempt to hoist any nested `<img>` tags,
 * not directly wrapped by a `<div>` as ProseMirror no-op's
 * on those scenarios.
 * @param html
 */


export var unwrapNestedMediaElements = function unwrapNestedMediaElements(html) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');
  var wrapper = doc.body; // Remove Google Doc's wrapper <b> el

  var docsWrapper = wrapper.querySelector('b[id^="docs-internal-guid-"]');

  if (docsWrapper) {
    unwrap(wrapper, docsWrapper);
  }

  var imageTags = wrapper.querySelectorAll('img');

  if (!imageTags.length) {
    return html;
  }

  imageTags.forEach(function (imageTag) {
    // Capture the immediate parent, we may remove the media from here later.
    var mediaParent = imageTag.parentElement;

    if (!mediaParent) {
      return;
    } // If either the parent or the image itself contains styles that would make
    // them invisible on copy, dont paste them.


    if (isElementInvisible(mediaParent) || isElementInvisible(imageTag)) {
      mediaParent.removeChild(imageTag);
      return;
    } // If its wrapped by a valid container we assume its safe to bypass.
    // ProseMirror should handle these cases properly.


    if (canContainImage(mediaParent) || mediaParent instanceof HTMLSpanElement && mediaParent.closest('[class*="emoji-common"]')) {
      return;
    } // Find the top most element that the parent has a valid container for the image.
    // Stop just before found the wrapper


    var insertBeforeElement = walkUpTreeUntil(mediaParent, function (element) {
      // If is at the top just use this element as reference
      if (element.parentElement === wrapper) {
        return true;
      }

      return canContainImage(element.parentElement);
    }); // Here we try to insert the media right after its top most valid parent element
    // Unless its the last element in our structure then we will insert above it.

    if (insertBeforeElement && insertBeforeElement.parentElement) {
      // Insert as close as possible to the most closest valid element index in the tree.
      insertBeforeElement.parentElement.insertBefore(imageTag, insertBeforeElement.nextElementSibling || insertBeforeElement); // Attempt to clean up lines left behind by the image

      mediaParent.innerText = mediaParent.innerText.trim(); // Walk up and delete empty elements left over after removing the image tag

      removeNestedEmptyEls(mediaParent);
    }
  }); // If last child is a hardbreak we don't want it

  if (wrapper.lastElementChild && wrapper.lastElementChild.tagName === 'BR') {
    wrapper.removeChild(wrapper.lastElementChild);
  }

  return wrapper.innerHTML;
};
export var getMediaNodeFromSelection = function getMediaNodeFromSelection(state) {
  if (!isSelectionMediaSingleNode(state)) {
    return null;
  }

  var tr = state.tr;
  var pos = tr.selection.from + 1;
  var mediaNode = tr.doc.nodeAt(pos);

  if (mediaNode && mediaNode.type === state.schema.nodes.media) {
    return mediaNode;
  }

  return null;
};
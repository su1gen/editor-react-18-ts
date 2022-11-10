"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyOptionalAttrsFromMediaState = void 0;
exports.endPositionForMedia = endPositionForMedia;
exports.unwrapNestedMediaElements = exports.transformSliceToCorrectMediaWrapper = exports.splitMediaGroup = exports.removeMediaNode = exports.posOfPrecedingMediaGroup = exports.posOfParentMediaGroup = exports.posOfMediaGroupNearby = exports.posOfMediaGroupBelow = exports.isSelectionNonMediaBlockNode = exports.isSelectionMediaSingleNode = exports.isMediaBlobUrlFromAttrs = exports.isInsidePotentialEmptyParagraph = exports.getMediaNodeFromSelection = void 0;

var _prosemirrorCommands = require("prosemirror-commands");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _commands = require("../../../commands");

var _utils = require("../../../utils");

var _slice = require("../../../utils/slice");

var _dom = require("../../../utils/dom");

var _isImage = require("./is-image");

var _position = require("../../../utils/prosemirror/position");

var _selection = require("../../selection/gap-cursor/selection");

var _mediaClient = require("@atlaskit/media-client");

var isMediaBlobUrlFromAttrs = function isMediaBlobUrlFromAttrs(attrs) {
  return !!(attrs && attrs.type === 'external' && (0, _mediaClient.isMediaBlobUrl)(attrs.url));
};

exports.isMediaBlobUrlFromAttrs = isMediaBlobUrlFromAttrs;

var posOfMediaGroupNearby = function posOfMediaGroupNearby(state) {
  return posOfParentMediaGroup(state) || posOfFollowingMediaGroup(state) || posOfPrecedingMediaGroup(state) || posOfMediaGroupNextToGapCursor(state);
};

exports.posOfMediaGroupNearby = posOfMediaGroupNearby;

var isSelectionNonMediaBlockNode = function isSelectionNonMediaBlockNode(state) {
  var _ref = state.selection,
      node = _ref.node;
  return node && node.type !== state.schema.nodes.media && node.isBlock;
};

exports.isSelectionNonMediaBlockNode = isSelectionNonMediaBlockNode;

var isSelectionMediaSingleNode = function isSelectionMediaSingleNode(state) {
  var _ref2 = state.selection,
      node = _ref2.node;
  return node && node.type === state.schema.nodes.mediaSingle;
};

exports.isSelectionMediaSingleNode = isSelectionMediaSingleNode;

var posOfPrecedingMediaGroup = function posOfPrecedingMediaGroup(state) {
  if (!(0, _position.atTheBeginningOfBlock)(state)) {
    return;
  }

  return posOfMediaGroupAbove(state, state.selection.$from);
};

exports.posOfPrecedingMediaGroup = posOfPrecedingMediaGroup;

var posOfMediaGroupNextToGapCursor = function posOfMediaGroupNextToGapCursor(state) {
  var selection = state.selection;

  if (selection instanceof _selection.GapCursorSelection) {
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
  if (!(0, _position.atTheEndOfBlock)(state)) {
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
    adjacentPos = (0, _position.startPositionOfParent)($pos) - 1;
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


var isInsidePotentialEmptyParagraph = function isInsidePotentialEmptyParagraph(state) {
  var $from = state.selection.$from;
  return $from.parent.type === state.schema.nodes.paragraph && (0, _position.atTheBeginningOfBlock)(state) && (0, _position.atTheEndOfBlock)(state);
};

exports.isInsidePotentialEmptyParagraph = isInsidePotentialEmptyParagraph;

var posOfMediaGroupBelow = function posOfMediaGroupBelow(state, $pos) {
  var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var adjacentPos;
  var adjacentNode;

  if (isSelectionNonMediaBlockNode(state)) {
    adjacentPos = $pos.pos;
    adjacentNode = $pos.nodeAfter;
  } else {
    adjacentPos = (0, _position.endPositionOfParent)($pos);
    adjacentNode = state.doc.nodeAt(adjacentPos);
  }

  if (adjacentNode && adjacentNode.type === state.schema.nodes.mediaGroup) {
    return prepend ? adjacentPos + 1 : adjacentPos + adjacentNode.nodeSize - 1;
  }

  return;
};

exports.posOfMediaGroupBelow = posOfMediaGroupBelow;

var posOfParentMediaGroup = function posOfParentMediaGroup(state, $pos) {
  var prepend = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var $from = state.selection.$from;
  $pos = $pos || $from;

  if ($pos.parent.type === state.schema.nodes.mediaGroup) {
    return prepend ? (0, _position.startPositionOfParent)($pos) : (0, _position.endPositionOfParent)($pos) - 1;
  }

  return;
};
/**
 * The function will return the position after current selection where mediaGroup can be inserted.
 */


exports.posOfParentMediaGroup = posOfParentMediaGroup;

function endPositionForMedia(state, resolvedPos) {
  var mediaGroup = state.schema.nodes.mediaGroup;
  var i = resolvedPos.depth;

  for (; i > 1; i--) {
    var nodeType = resolvedPos.node(i).type;

    if (nodeType.validContent(_prosemirrorModel.Fragment.from(mediaGroup.create()))) {
      break;
    }
  }

  return resolvedPos.end(i) + 1;
}

var removeMediaNode = function removeMediaNode(view, node, getPos) {
  var id = node.attrs.id;
  var state = view.state;
  var tr = state.tr,
      selection = state.selection,
      doc = state.doc;
  var currentMediaNodePos = getPos();
  tr.deleteRange(currentMediaNodePos, currentMediaNodePos + node.nodeSize);

  if ((0, _utils.isTemporary)(id)) {
    tr.setMeta('addToHistory', false);
  }

  var $currentMediaNodePos = doc.resolve(currentMediaNodePos);
  var nodeBefore = $currentMediaNodePos.nodeBefore,
      parent = $currentMediaNodePos.parent;
  var isLastMediaNode = $currentMediaNodePos.index() === parent.childCount - 1; // If deleting a selected media node, we need to tell where the cursor to go next.
  // Prosemirror didn't gave us the behaviour of moving left if the media node is not the last one.
  // So we handle it ourselves.

  if (selection.from === currentMediaNodePos && !isLastMediaNode && !(0, _position.atTheBeginningOfDoc)(state) && nodeBefore && nodeBefore.type.name === 'media') {
    var _nodeBefore = (0, _prosemirrorUtils.findPositionOfNodeBefore)(tr.selection);

    if (_nodeBefore) {
      tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, _nodeBefore));
    }
  }

  view.dispatch(tr);
};

exports.removeMediaNode = removeMediaNode;

var splitMediaGroup = function splitMediaGroup(view) {
  var selection = view.state.selection; // if selection is not a media node, do nothing.

  if (!(selection instanceof _prosemirrorState.NodeSelection) || selection.node.type !== view.state.schema.nodes.media) {
    return false;
  }

  (0, _prosemirrorCommands.deleteSelection)(view.state, view.dispatch);

  if (selection.$to.nodeAfter) {
    (0, _prosemirrorCommands.splitBlock)(view.state, view.dispatch);
    (0, _commands.createParagraphNear)(false)(view.state, view.dispatch);
  } else {
    (0, _commands.createNewParagraphBelow)(view.state, view.dispatch);
  }

  return true;
};

exports.splitMediaGroup = splitMediaGroup;

var isOptionalAttr = function isOptionalAttr(attr) {
  return attr.length > 1 && attr[0] === '_' && attr[1] === '_';
};

var copyOptionalAttrsFromMediaState = function copyOptionalAttrsFromMediaState(mediaState, node) {
  Object.keys(node.attrs).filter(isOptionalAttr).forEach(function (key) {
    var mediaStateKey = key.substring(2);
    var attrValue = mediaState[mediaStateKey];

    if (attrValue !== undefined) {
      node.attrs[key] = attrValue;
    }
  });
};

exports.copyOptionalAttrsFromMediaState = copyOptionalAttrsFromMediaState;

var transformSliceToCorrectMediaWrapper = function transformSliceToCorrectMediaWrapper(slice, schema) {
  var _schema$nodes = schema.nodes,
      mediaGroup = _schema$nodes.mediaGroup,
      mediaSingle = _schema$nodes.mediaSingle,
      media = _schema$nodes.media;
  return (0, _slice.mapSlice)(slice, function (node, parent) {
    if (!parent && node.type === media) {
      if (mediaSingle && ((0, _isImage.isImage)(node.attrs.__fileMimeType) || node.attrs.type === 'external')) {
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


exports.transformSliceToCorrectMediaWrapper = transformSliceToCorrectMediaWrapper;

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


var unwrapNestedMediaElements = function unwrapNestedMediaElements(html) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(html, 'text/html');
  var wrapper = doc.body; // Remove Google Doc's wrapper <b> el

  var docsWrapper = wrapper.querySelector('b[id^="docs-internal-guid-"]');

  if (docsWrapper) {
    (0, _dom.unwrap)(wrapper, docsWrapper);
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


    var insertBeforeElement = (0, _dom.walkUpTreeUntil)(mediaParent, function (element) {
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

      (0, _dom.removeNestedEmptyEls)(mediaParent);
    }
  }); // If last child is a hardbreak we don't want it

  if (wrapper.lastElementChild && wrapper.lastElementChild.tagName === 'BR') {
    wrapper.removeChild(wrapper.lastElementChild);
  }

  return wrapper.innerHTML;
};

exports.unwrapNestedMediaElements = unwrapNestedMediaElements;

var getMediaNodeFromSelection = function getMediaNodeFromSelection(state) {
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

exports.getMediaNodeFromSelection = getMediaNodeFromSelection;
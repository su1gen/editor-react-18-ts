"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertMediaInlineNode = exports.insertMediaGroupNode = exports.getPosInList = exports.canInsertMediaInline = void 0;

var _prosemirrorModel = require("prosemirror-model");

var _utils = require("../../../utils");

var _mediaCommon = require("./media-common");

var _prosemirrorUtils = require("prosemirror-utils");

var _position = require("../../../utils/prosemirror/position");

var _nodes = require("../../../utils/nodes");

var _analytics = require("../../analytics");

var canInsertMediaInline = function canInsertMediaInline(state) {
  var node = state.schema.nodes.mediaInline.create({});
  return (0, _prosemirrorUtils.canInsert)(state.selection.$to, _prosemirrorModel.Fragment.from(node));
};

exports.canInsertMediaInline = canInsertMediaInline;

var getInsertMediaGroupAnalytics = function getInsertMediaGroupAnalytics(mediaState, inputMethod) {
  var media = '';

  if (mediaState.length === 1) {
    media = mediaState[0].fileMimeType || 'unknown';
  } else if (mediaState.length > 1) {
    media = 'multiple';
  }

  return {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.MEDIA,
    attributes: {
      type: _analytics.ACTION_SUBJECT_ID.MEDIA_GROUP,
      inputMethod: inputMethod,
      fileExtension: media
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };
};

var getInsertMediaInlineAnalytics = function getInsertMediaInlineAnalytics(mediaState, inputMethod) {
  var media = mediaState.fileMimeType || 'unknown';
  return {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.MEDIA,
    attributes: {
      type: _analytics.ACTION_SUBJECT_ID.MEDIA_INLINE,
      inputMethod: inputMethod,
      fileExtension: media
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };
};
/**
 * Check if current editor selections is a media group or not.
 * @param state Editor state
 */


function isSelectionMediaGroup(state) {
  var schema = state.schema;
  var selectionParent = state.selection.$anchor.node();
  return selectionParent && selectionParent.type === schema.nodes.mediaGroup;
}
/**
 * Insert a paragraph after if reach the end of doc
 * and there is no media group in the front or selection is a non media block node
 * @param node Node at insertion point
 * @param state Editor state
 */


function shouldAppendParagraph(state, node) {
  var media = state.schema.nodes.media;
  var wasMediaNode = node && node.type === media;
  return ((0, _utils.insideTableCell)(state) || (0, _utils.isInListItem)(state) || (0, _utils.isInLayoutColumn)(state) || (0, _position.atTheEndOfDoc)(state) && (!(0, _mediaCommon.posOfPrecedingMediaGroup)(state) || (0, _mediaCommon.isSelectionNonMediaBlockNode)(state))) && !wasMediaNode;
}
/**
 * Create a new media inline to insert the new media.
 * @param view Editor view
 * @param mediaState Media file to be added to the editor
 * @param collection Collection for the media to be added
 */


var insertMediaInlineNode = function insertMediaInlineNode(view, mediaState, collection, inputMethod) {
  var state = view.state,
      dispatch = view.dispatch;
  var schema = state.schema,
      tr = state.tr;
  var mediaInline = schema.nodes.mediaInline; // Do nothing if no media found

  if (!mediaInline || !mediaState || collection === undefined) {
    return false;
  }

  var id = mediaState.id;
  var mediaInlineNode = mediaInline.create({
    id: id,
    collection: collection
  });
  var space = state.schema.text(' ');
  var pos = state.selection.$to.pos; // If the selection is inside an empty list item set pos inside paragraph

  if ((0, _utils.isInListItem)(state) && (0, _mediaCommon.isInsidePotentialEmptyParagraph)(state)) {
    pos = pos + 1;
  }

  var content = _prosemirrorModel.Fragment.from([mediaInlineNode, space]); // Delete the selection if a selection is made


  var deleteRange = findDeleteRange(state);

  if (!deleteRange) {
    tr.insert(pos, content);
  } else {
    tr.insert(pos, content).deleteRange(deleteRange.start, deleteRange.end);
  }

  (0, _analytics.addAnalytics)(state, tr, getInsertMediaInlineAnalytics(mediaState, inputMethod));
  dispatch(tr);
  return true;
};
/**
 * Insert a media into an existing media group
 * or create a new media group to insert the new media.
 * @param view Editor view
 * @param mediaStates Media files to be added to the editor
 * @param collection Collection for the media to be added
 */


exports.insertMediaInlineNode = insertMediaInlineNode;

var insertMediaGroupNode = function insertMediaGroupNode(view, mediaStates, collection, inputMethod) {
  var state = view.state,
      dispatch = view.dispatch;
  var tr = state.tr,
      schema = state.schema;
  var _schema$nodes = schema.nodes,
      media = _schema$nodes.media,
      paragraph = _schema$nodes.paragraph; // Do nothing if no media found

  if (!media || !mediaStates.length) {
    return;
  }

  var mediaNodes = createMediaFileNodes(mediaStates, collection, media);
  var mediaInsertPos = findMediaInsertPos(state);
  var resolvedInsertPos = tr.doc.resolve(mediaInsertPos);
  var parent = resolvedInsertPos.parent;
  var nodeAtInsertionPoint = tr.doc.nodeAt(mediaInsertPos);
  var shouldSplit = !isSelectionMediaGroup(state) && (0, _nodes.isSupportedInParent)(state, _prosemirrorModel.Fragment.from(state.schema.nodes.mediaGroup.createChecked({}, mediaNodes)));
  var withParagraph = shouldAppendParagraph(state, nodeAtInsertionPoint);
  var content = parent.type === schema.nodes.mediaGroup ? mediaNodes // If parent is a mediaGroup do not wrap items again.
  : [schema.nodes.mediaGroup.createChecked({}, mediaNodes)];

  if (shouldSplit) {
    content = withParagraph ? content.concat(paragraph.create()) : content; // delete the selection or empty paragraph

    var deleteRange = findDeleteRange(state);

    if (!deleteRange) {
      tr.insert(mediaInsertPos, content);
    } else if (mediaInsertPos <= deleteRange.start) {
      tr.deleteRange(deleteRange.start, deleteRange.end).insert(mediaInsertPos, content);
    } else {
      tr.insert(mediaInsertPos, content).deleteRange(deleteRange.start, deleteRange.end);
    }

    (0, _analytics.addAnalytics)(state, tr, getInsertMediaGroupAnalytics(mediaStates, inputMethod));
    dispatch(tr);
    setSelectionAfterMediaInsertion(view);
    return;
  } // Don't append new paragraph when adding media to a existing mediaGroup


  if (withParagraph && parent.type !== schema.nodes.mediaGroup) {
    content.push(paragraph.create());
  }

  (0, _analytics.addAnalytics)(state, tr, getInsertMediaGroupAnalytics(mediaStates, inputMethod));
  dispatch((0, _prosemirrorUtils.safeInsert)(_prosemirrorModel.Fragment.fromArray(content), mediaInsertPos)(tr));
};

exports.insertMediaGroupNode = insertMediaGroupNode;

var createMediaFileNodes = function createMediaFileNodes(mediaStates, collection, media) {
  var nodes = mediaStates.map(function (mediaState) {
    var id = mediaState.id;
    var node = media.create({
      id: id,
      type: 'file',
      collection: collection
    });
    (0, _mediaCommon.copyOptionalAttrsFromMediaState)(mediaState, node);
    return node;
  });
  return nodes;
};
/**
 * Find root list node if exist from current selection
 * @param state Editor state
 */


var findRootListNode = function findRootListNode(state) {
  var _state$schema$nodes = state.schema.nodes,
      bulletList = _state$schema$nodes.bulletList,
      orderedList = _state$schema$nodes.orderedList;
  return (0, _utils.findFarthestParentNode)(function (node) {
    return node.type === bulletList || node.type === orderedList;
  })(state.selection.$from);
};
/**
 * Return position of media to be inserted, if it is inside a list
 * @param content Content to be inserted
 * @param state Editor State
 */


var getPosInList = function getPosInList(state) {
  var _state$schema$nodes2 = state.schema.nodes,
      mediaGroup = _state$schema$nodes2.mediaGroup,
      listItem = _state$schema$nodes2.listItem; // 1. Check if I am inside a list.

  if ((0, _prosemirrorUtils.hasParentNode)(function (node) {
    return node.type === listItem;
  })(state.selection)) {
    // 2. Get end position of root list
    var rootListNode = findRootListNode(state);

    if (rootListNode) {
      var pos = rootListNode.pos + rootListNode.node.nodeSize; // 3. Fint the first location inside the media group

      var nextNode = state.doc.nodeAt(pos);

      if (nextNode && nextNode.type === mediaGroup) {
        return pos + 1;
      }

      return pos;
    }
  }

  return;
};
/**
 * Find insertion point,
 * If it is in a List it will return position to the next block,
 * If there are any media group close it will return this position
 * Otherwise, It will return the respective block given selection.
 * @param content Content to be inserted
 * @param state Editor state
 */


exports.getPosInList = getPosInList;

var findMediaInsertPos = function findMediaInsertPos(state) {
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to; // Check if selection is inside a list.

  var posInList = getPosInList(state);

  if (posInList) {
    // If I have a position in lists, I should return, otherwise I am not inside a list
    return posInList;
  }

  var nearbyMediaGroupPos = (0, _mediaCommon.posOfMediaGroupNearby)(state);

  if (nearbyMediaGroupPos && (!(0, _mediaCommon.isSelectionNonMediaBlockNode)(state) || $from.pos < nearbyMediaGroupPos && $to.pos < nearbyMediaGroupPos)) {
    return nearbyMediaGroupPos;
  }

  if ((0, _mediaCommon.isSelectionNonMediaBlockNode)(state)) {
    return $to.pos;
  }

  if ((0, _position.atTheEndOfBlock)(state)) {
    return $to.pos + 1;
  }

  if ((0, _position.atTheBeginningOfBlock)(state)) {
    return $from.pos - 1;
  }

  return $to.pos;
};

var findDeleteRange = function findDeleteRange(state) {
  var _state$selection2 = state.selection,
      $from = _state$selection2.$from,
      $to = _state$selection2.$to;

  if ((0, _mediaCommon.posOfParentMediaGroup)(state)) {
    return;
  }

  if (!(0, _mediaCommon.isInsidePotentialEmptyParagraph)(state) || (0, _mediaCommon.posOfMediaGroupNearby)(state)) {
    return range($from.pos, $to.pos);
  }

  return range((0, _position.startPositionOfParent)($from) - 1, (0, _position.endPositionOfParent)($to));
};

var range = function range(start) {
  var end = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : start;
  return {
    start: start,
    end: end
  };
};

var setSelectionAfterMediaInsertion = function setSelectionAfterMediaInsertion(view) {
  var state = view.state;
  var doc = state.doc;
  var mediaPos = (0, _mediaCommon.posOfMediaGroupNearby)(state);

  if (!mediaPos) {
    return;
  }

  var $mediaPos = doc.resolve(mediaPos);
  var endOfMediaGroup = (0, _position.endPositionOfParent)($mediaPos);

  if (endOfMediaGroup + 1 >= doc.nodeSize - 1) {
    // if nothing after the media group, fallback to select the newest uploaded media item
    (0, _utils.setNodeSelection)(view, mediaPos);
  } else {
    (0, _utils.setTextSelection)(view, endOfMediaGroup + 1);
  }
};
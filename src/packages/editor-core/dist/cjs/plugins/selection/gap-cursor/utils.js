"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBreakoutModeFromTargetNode = getBreakoutModeFromTargetNode;
exports.getMediaNearPos = getMediaNearPos;
exports.isTextBlockNearPos = exports.isLeftCursor = exports.isIgnoredClick = void 0;

var _styles = require("@atlaskit/editor-common/styles");

var _selection = require("./selection");

var _styles2 = require("../../unsupported-content/styles");

var _CaptionPlaceholder = require("../../media/ui/CaptionPlaceholder");

var isLeftCursor = function isLeftCursor(side) {
  return side === _selection.Side.LEFT;
};

exports.isLeftCursor = isLeftCursor;

function getMediaNearPos(doc, $pos, schema) {
  var dir = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
  var $currentPos = $pos;
  var currentNode = null;
  var _schema$nodes = schema.nodes,
      mediaSingle = _schema$nodes.mediaSingle,
      media = _schema$nodes.media,
      mediaGroup = _schema$nodes.mediaGroup;

  do {
    $currentPos = doc.resolve(dir === -1 ? $currentPos.before() : $currentPos.after());

    if (!$currentPos) {
      return null;
    }

    currentNode = (dir === -1 ? $currentPos.nodeBefore : $currentPos.nodeAfter) || $currentPos.parent;

    if (!currentNode || currentNode.type === schema.nodes.doc) {
      return null;
    }

    if (currentNode.type === mediaSingle || currentNode.type === media || currentNode.type === mediaGroup) {
      return currentNode;
    }
  } while ($currentPos.depth > 0);

  return null;
}

var isTextBlockNearPos = function isTextBlockNearPos(doc, schema, $pos, dir) {
  var $currentPos = $pos;
  var currentNode = dir === -1 ? $currentPos.nodeBefore : $currentPos.nodeAfter; // If next node is a text or a text block bail out early.

  if (currentNode && (currentNode.isTextblock || currentNode.isText)) {
    return true;
  }

  while ($currentPos.depth > 0) {
    $currentPos = doc.resolve(dir === -1 ? $currentPos.before() : $currentPos.after());

    if (!$currentPos) {
      return false;
    }

    currentNode = (dir === -1 ? $currentPos.nodeBefore : $currentPos.nodeAfter) || $currentPos.parent;

    if (!currentNode || currentNode.type === schema.nodes.doc) {
      return false;
    }

    if (currentNode.isTextblock) {
      return true;
    }
  }

  var childNode = currentNode;

  while (childNode && childNode.firstChild) {
    childNode = childNode.firstChild;

    if (childNode && (childNode.isTextblock || childNode.isText)) {
      return true;
    }
  }

  return false;
};

exports.isTextBlockNearPos = isTextBlockNearPos;

function getBreakoutModeFromTargetNode(node) {
  var layout;

  if (node.attrs.layout) {
    layout = node.attrs.layout;
  }

  if (node.marks && node.marks.length) {
    layout = (node.marks.find(function (mark) {
      return mark.type.name === 'breakout';
    }) || {
      attrs: {
        mode: ''
      }
    }).attrs.mode;
  }

  if (['wide', 'full-width'].indexOf(layout) === -1) {
    return '';
  }

  return layout;
}

var isIgnoredClick = function isIgnoredClick(elem) {
  if (elem.nodeName === 'BUTTON' || elem.closest('button')) {
    return true;
  } // check if we're clicking an image caption placeholder


  if (elem.closest("[data-id=\"".concat(_CaptionPlaceholder.CAPTION_PLACEHOLDER_ID, "\"]"))) {
    return true;
  } // check if target node has a parent table node


  var tableWrap;
  var node = elem;

  while (node) {
    if (node.className && (node.getAttribute('class') || '').indexOf(_styles.TableSharedCssClassName.TABLE_CONTAINER) > -1) {
      tableWrap = node;
      break;
    }

    node = node.parentNode;
  }

  if (tableWrap) {
    var rowControls = tableWrap.querySelector(".".concat(_styles.TableSharedCssClassName.TABLE_ROW_CONTROLS_WRAPPER));
    var isColumnControlsDecoration = elem && elem.classList && elem.classList.contains(_styles.TableSharedCssClassName.TABLE_COLUMN_CONTROLS_DECORATIONS);
    return rowControls && rowControls.contains(elem) || isColumnControlsDecoration;
  } // Check if unsupported node selection
  // (without this, selection requires double clicking in FF due to posAtCoords differences)


  if (elem.closest(".".concat(_styles2.UnsupportedSharedCssClassName.BLOCK_CONTAINER))) {
    return true;
  }

  return false;
};

exports.isIgnoredClick = isIgnoredClick;
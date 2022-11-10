import { TableSharedCssClassName } from '@atlaskit/editor-common/styles';
import { Side } from './selection';
import { UnsupportedSharedCssClassName } from '../../unsupported-content/styles';
import { CAPTION_PLACEHOLDER_ID } from '../../media/ui/CaptionPlaceholder';
export var isLeftCursor = function isLeftCursor(side) {
  return side === Side.LEFT;
};
export function getMediaNearPos(doc, $pos, schema) {
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
export var isTextBlockNearPos = function isTextBlockNearPos(doc, schema, $pos, dir) {
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
export function getBreakoutModeFromTargetNode(node) {
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
export var isIgnoredClick = function isIgnoredClick(elem) {
  if (elem.nodeName === 'BUTTON' || elem.closest('button')) {
    return true;
  } // check if we're clicking an image caption placeholder


  if (elem.closest("[data-id=\"".concat(CAPTION_PLACEHOLDER_ID, "\"]"))) {
    return true;
  } // check if target node has a parent table node


  var tableWrap;
  var node = elem;

  while (node) {
    if (node.className && (node.getAttribute('class') || '').indexOf(TableSharedCssClassName.TABLE_CONTAINER) > -1) {
      tableWrap = node;
      break;
    }

    node = node.parentNode;
  }

  if (tableWrap) {
    var rowControls = tableWrap.querySelector(".".concat(TableSharedCssClassName.TABLE_ROW_CONTROLS_WRAPPER));
    var isColumnControlsDecoration = elem && elem.classList && elem.classList.contains(TableSharedCssClassName.TABLE_COLUMN_CONTROLS_DECORATIONS);
    return rowControls && rowControls.contains(elem) || isColumnControlsDecoration;
  } // Check if unsupported node selection
  // (without this, selection requires double clicking in FF due to posAtCoords differences)


  if (elem.closest(".".concat(UnsupportedSharedCssClassName.BLOCK_CONTAINER))) {
    return true;
  }

  return false;
};
import _toArray from "@babel/runtime/helpers/toArray";
import { getBreakoutModeFromTargetNode, isLeftCursor } from '../utils';
import { Side } from '../selection';
/**
 * We have a couple of nodes that require us to compute style
 * on different elements, ideally all nodes should be able to
 * compute the appropriate styles based on their wrapper.
 */

var nestedCases = {
  'tableView-content-wrap': 'table',
  'mediaSingleView-content-wrap': '.rich-media-item'
};

var computeNestedStyle = function computeNestedStyle(dom) {
  var foundKey = Object.keys(nestedCases).find(function (className) {
    return dom.classList.contains(className);
  });
  var nestedSelector = foundKey && nestedCases[foundKey];

  if (nestedSelector) {
    var nestedElement = dom.querySelector(nestedSelector);

    if (nestedElement) {
      return window.getComputedStyle(nestedElement);
    }
  }
};

var measureHeight = function measureHeight(style) {
  return measureValue(style, ['height', 'padding-top', 'padding-bottom', 'border-top-width', 'border-bottom-width']);
};

var measureWidth = function measureWidth(style) {
  return measureValue(style, ['width', 'padding-left', 'padding-right', 'border-left-width', 'border-right-width']);
};

var measureValue = function measureValue(style, measureValues) {
  var _measureValues = _toArray(measureValues),
      base = _measureValues[0],
      contentBoxValues = _measureValues.slice(1);

  var measures = [style.getPropertyValue(base)];
  var boxSizing = style.getPropertyValue('box-sizing');

  if (boxSizing === 'content-box') {
    contentBoxValues.forEach(function (value) {
      measures.push(style.getPropertyValue(value));
    });
  }

  var result = 0;

  for (var i = 0; i < measures.length; i++) {
    result += parseFloat(measures[i]);
  }

  return result;
};

var mutateElementStyle = function mutateElementStyle(element, style, side) {
  if (isLeftCursor(side)) {
    element.style.marginLeft = style.getPropertyValue('margin-left');
  } else {
    var marginRight = parseFloat(style.getPropertyValue('margin-right'));

    if (marginRight > 0) {
      element.style.marginLeft = "-".concat(Math.abs(marginRight), "px");
    } else {
      element.style.paddingRight = "".concat(Math.abs(marginRight), "px");
    }
  }
};

export var toDOM = function toDOM(view, getPos) {
  var selection = view.state.selection;
  var $from = selection.$from,
      side = selection.side;
  var isRightCursor = side === Side.RIGHT;
  var node = isRightCursor ? $from.nodeBefore : $from.nodeAfter;
  var nodeStart = getPos();
  var dom = view.nodeDOM(nodeStart);
  var element = document.createElement('span');
  element.className = "ProseMirror-gapcursor ".concat(isRightCursor ? '-right' : '-left');
  element.appendChild(document.createElement('span'));

  if (dom instanceof HTMLElement && element.firstChild) {
    var style = computeNestedStyle(dom) || window.getComputedStyle(dom);
    var gapCursor = element.firstChild;
    gapCursor.style.height = "".concat(measureHeight(style), "px"); // TODO remove this table specific piece. need to figure out margin collapsing logic

    if (nodeStart !== 0 || node && node.type.name === 'table') {
      gapCursor.style.marginTop = style.getPropertyValue('margin-top');
    }

    var breakoutMode = node && getBreakoutModeFromTargetNode(node);

    if (breakoutMode) {
      gapCursor.setAttribute('layout', breakoutMode);
      gapCursor.style.width = "".concat(measureWidth(style), "px");
    } else {
      mutateElementStyle(gapCursor, style, selection.side);
    }
  }

  return element;
};
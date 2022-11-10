export var shallowEqual = function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (objA == null || objB == null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (var idx = 0; idx < keysA.length; idx++) {
    var key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};
export var compareArrays = function compareArrays(left, right) {
  var compareFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : shallowEqual;

  if (left.length !== right.length) {
    return false;
  }

  for (var idx = 0; idx < left.length; idx++) {
    if (!compareFn(left[idx], right[idx])) {
      return false;
    }
  }

  return true;
}; // find node in descendants by condition

export function findNode(parent, predicate) {
  var matchedNode;
  parent.descendants(function (node) {
    // dont run predicate if node already found
    if (matchedNode) {
      return false;
    }

    if (predicate(node)) {
      matchedNode = node;
      return false;
    }

    return true;
  });
  return matchedNode;
}
export function getFirstFocusableElement(rootNode) {
  if (!rootNode) {
    return;
  }

  var focusableModalElements = rootNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select') || [];
  return focusableModalElements[0];
}
export function getFocusableElements(rootNode) {
  if (!rootNode) {
    return;
  }

  var focusableModalElements = rootNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select') || [];
  return focusableModalElements;
}
export function getLastFocusableElement(rootNode) {
  if (!rootNode) {
    return;
  }

  var focusableModalElements = rootNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select') || [];
  return focusableModalElements[focusableModalElements.length - 1];
}
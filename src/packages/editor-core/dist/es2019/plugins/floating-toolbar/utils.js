export const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (objA == null || objB == null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

  for (let idx = 0; idx < keysA.length; idx++) {
    const key = keysA[idx];

    if (!bHasOwnProperty(key)) {
      return false;
    }

    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};
export const compareArrays = (left, right, compareFn = shallowEqual) => {
  if (left.length !== right.length) {
    return false;
  }

  for (let idx = 0; idx < left.length; idx++) {
    if (!compareFn(left[idx], right[idx])) {
      return false;
    }
  }

  return true;
}; // find node in descendants by condition

export function findNode(parent, predicate) {
  let matchedNode;
  parent.descendants(node => {
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

  const focusableModalElements = rootNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select') || [];
  return focusableModalElements[0];
}
export function getFocusableElements(rootNode) {
  if (!rootNode) {
    return;
  }

  const focusableModalElements = rootNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select') || [];
  return focusableModalElements;
}
export function getLastFocusableElement(rootNode) {
  if (!rootNode) {
    return;
  }

  const focusableModalElements = rootNode.querySelectorAll('a[href], button:not([disabled]), textarea, input, select') || [];
  return focusableModalElements[focusableModalElements.length - 1];
}
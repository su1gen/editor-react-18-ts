export function findUniqueItemsIn(findIn, checkWith, comparator) {
  return findIn.filter(function (firstItem) {
    return checkWith.findIndex(function (secondItem) {
      return comparator ? comparator(firstItem, secondItem) : firstItem === secondItem;
    }) === -1;
  });
}
export function filterUniqueItems(arr, comparator) {
  return arr.filter(function (firstItem, index, self) {
    return self.findIndex(function (secondItem) {
      return comparator ? comparator(firstItem, secondItem) : firstItem === secondItem;
    }) === index;
  });
}
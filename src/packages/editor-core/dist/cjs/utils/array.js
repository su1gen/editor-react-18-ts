"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterUniqueItems = filterUniqueItems;
exports.findUniqueItemsIn = findUniqueItemsIn;

function findUniqueItemsIn(findIn, checkWith, comparator) {
  return findIn.filter(function (firstItem) {
    return checkWith.findIndex(function (secondItem) {
      return comparator ? comparator(firstItem, secondItem) : firstItem === secondItem;
    }) === -1;
  });
}

function filterUniqueItems(arr, comparator) {
  return arr.filter(function (firstItem, index, self) {
    return self.findIndex(function (secondItem) {
      return comparator ? comparator(firstItem, secondItem) : firstItem === secondItem;
    }) === index;
  });
}
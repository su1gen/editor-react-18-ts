import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import Fuse from 'fuse.js';
import { dedupe } from '../../utils';
var options = {
  threshold: 0.3,
  keys: [{
    name: 'title',
    weight: 0.57
  }, {
    name: 'priority',
    weight: 0.3
  }, {
    name: 'keywords',
    weight: 0.08
  }, {
    name: 'description',
    weight: 0.04
  }, {
    name: 'keyshortcut',
    weight: 0.01
  }]
};
export function find(query, items) {
  var fuse = new Fuse(items, options);

  if (query === '') {
    // Copy and sort list by priority
    return items.slice(0).sort(function (a, b) {
      return (a.priority || Number.POSITIVE_INFINITY) - (b.priority || Number.POSITIVE_INFINITY);
    });
  }

  return fuse.search(query).map(function (result) {
    return result.item;
  });
}
export var searchQuickInsertItems = function searchQuickInsertItems(quickInsertState, options) {
  return function (query, category) {
    var defaultItems = options && options.disableDefaultItems ? [] : quickInsertState.lazyDefaultItems();
    var providedItems = quickInsertState.providedItems;
    var items = providedItems ? dedupe([].concat(_toConsumableArray(defaultItems), _toConsumableArray(providedItems)), function (item) {
      return item.title;
    }) : defaultItems;
    return find(query || '', category === 'all' || !category ? items : items.filter(function (item) {
      return item.categories && item.categories.includes(category);
    }));
  };
};
export var getFeaturedQuickInsertItems = function getFeaturedQuickInsertItems(_ref, options) {
  var providedItems = _ref.providedItems,
      lazyDefaultItems = _ref.lazyDefaultItems;
  return function () {
    var defaultItems = options && options.disableDefaultItems ? [] : lazyDefaultItems();
    var items = providedItems ? dedupe([].concat(_toConsumableArray(defaultItems), _toConsumableArray(providedItems)), function (item) {
      return item.title;
    }) : defaultItems;
    return items.filter(function (item) {
      return item.featured;
    });
  };
};
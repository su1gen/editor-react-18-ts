"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = find;
exports.searchQuickInsertItems = exports.getFeaturedQuickInsertItems = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _fuse = _interopRequireDefault(require("fuse.js"));

var _utils = require("../../utils");

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

function find(query, items) {
  var fuse = new _fuse.default(items, options);

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

var searchQuickInsertItems = function searchQuickInsertItems(quickInsertState, options) {
  return function (query, category) {
    var defaultItems = options && options.disableDefaultItems ? [] : quickInsertState.lazyDefaultItems();
    var providedItems = quickInsertState.providedItems;
    var items = providedItems ? (0, _utils.dedupe)([].concat((0, _toConsumableArray2.default)(defaultItems), (0, _toConsumableArray2.default)(providedItems)), function (item) {
      return item.title;
    }) : defaultItems;
    return find(query || '', category === 'all' || !category ? items : items.filter(function (item) {
      return item.categories && item.categories.includes(category);
    }));
  };
};

exports.searchQuickInsertItems = searchQuickInsertItems;

var getFeaturedQuickInsertItems = function getFeaturedQuickInsertItems(_ref, options) {
  var providedItems = _ref.providedItems,
      lazyDefaultItems = _ref.lazyDefaultItems;
  return function () {
    var defaultItems = options && options.disableDefaultItems ? [] : lazyDefaultItems();
    var items = providedItems ? (0, _utils.dedupe)([].concat((0, _toConsumableArray2.default)(defaultItems), (0, _toConsumableArray2.default)(providedItems)), function (item) {
      return item.title;
    }) : defaultItems;
    return items.filter(function (item) {
      return item.featured;
    });
  };
};

exports.getFeaturedQuickInsertItems = getFeaturedQuickInsertItems;
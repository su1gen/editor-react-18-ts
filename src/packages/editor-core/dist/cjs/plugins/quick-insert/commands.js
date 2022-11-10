"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openElementBrowserModal = exports.insertItem = exports.closeElementBrowserModal = void 0;

var _insert = require("../../utils/insert");

var _pluginKey = require("./plugin-key");

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
var openElementBrowserModal = function openElementBrowserModal() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(_pluginKey.pluginKey, {
        isElementBrowserModalOpen: true
      }));
    }

    return true;
  };
};

exports.openElementBrowserModal = openElementBrowserModal;

var closeElementBrowserModal = function closeElementBrowserModal() {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(_pluginKey.pluginKey, {
        isElementBrowserModalOpen: false
      }));
    }

    return true;
  };
}; // this method was adapted from the typeahed plugin so we respect the API for quick insert items


exports.closeElementBrowserModal = closeElementBrowserModal;

var insertItem = function insertItem(item) {
  return function (state, dispatch) {
    var insert = function insert(maybeNode) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return (0, _insert.insertSelectedItem)(maybeNode, opts)(state, state.tr, state.selection.head);
    };

    var tr = item.action(insert, state);

    if (tr && dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.insertItem = insertItem;
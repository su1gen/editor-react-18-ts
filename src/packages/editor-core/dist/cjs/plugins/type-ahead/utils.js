"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveSelectedIndex = exports.isTypeAheadOpen = exports.isTypeAheadHandler = exports.isTypeAheadAllowed = exports.getTypeAheadQuery = exports.getTypeAheadHandler = exports.getPluginState = exports.findTypeAheadDecorations = exports.findHandlerByTrigger = exports.findHandler = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _key = require("./pm-plugins/key");

var _updateSelectedIndex = require("./commands/update-selected-index");

var _statsModifier = require("./stats-modifier");

var findTypeAheadDecorations = function findTypeAheadDecorations(state) {
  var selection = state.selection;

  var _typeAheadPluginKey$g = _key.pluginKey.getState(state),
      decorationSet = _typeAheadPluginKey$g.decorationSet;

  if (!decorationSet || decorationSet === _prosemirrorView.DecorationSet.empty || !(selection instanceof _prosemirrorState.TextSelection) || !selection.$cursor) {
    return null;
  }

  var pos = selection.$cursor.pos;
  var decoration = decorationSet.find(pos, pos, function (spec) {
    return spec === null || spec === void 0 ? void 0 : spec.isTypeAheadDecoration;
  });

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return decoration[0];
};

exports.findTypeAheadDecorations = findTypeAheadDecorations;

var isTypeAheadHandler = function isTypeAheadHandler(handler) {
  return handler && Object.values(_typeAhead.TypeAheadAvailableNodes).includes(handler.id) && typeof handler.trigger === 'string' && typeof handler.selectItem === 'function' && typeof handler.getItems === 'function';
};

exports.isTypeAheadHandler = isTypeAheadHandler;

var isTypeAheadOpen = function isTypeAheadOpen(editorState) {
  var _typeAheadPluginKey$g2, _typeAheadPluginKey$g3;

  return (_key.pluginKey === null || _key.pluginKey === void 0 ? void 0 : (_typeAheadPluginKey$g2 = _key.pluginKey.getState(editorState)) === null || _typeAheadPluginKey$g2 === void 0 ? void 0 : (_typeAheadPluginKey$g3 = _typeAheadPluginKey$g2.decorationSet) === null || _typeAheadPluginKey$g3 === void 0 ? void 0 : _typeAheadPluginKey$g3.find().length) > 0;
};

exports.isTypeAheadOpen = isTypeAheadOpen;

var getPluginState = function getPluginState(editorState) {
  return _key.pluginKey.getState(editorState);
};

exports.getPluginState = getPluginState;

var getTypeAheadHandler = function getTypeAheadHandler(editorState) {
  return _key.pluginKey.getState(editorState).triggerHandler;
};

exports.getTypeAheadHandler = getTypeAheadHandler;

var getTypeAheadQuery = function getTypeAheadQuery(editorState) {
  return _key.pluginKey.getState(editorState).query;
};

exports.getTypeAheadQuery = getTypeAheadQuery;

var isTypeAheadAllowed = function isTypeAheadAllowed(state) {
  var isOpen = isTypeAheadOpen(state); // if the TypeAhead is open
  // we should not allow it

  return !isOpen;
};

exports.isTypeAheadAllowed = isTypeAheadAllowed;

var findHandler = function findHandler(id, state) {
  var pluginState = _key.pluginKey.getState(state);

  if (!pluginState || !pluginState.typeAheadHandlers || pluginState.typeAheadHandlers.length === 0) {
    return null;
  }

  var typeAheadHandlers = pluginState.typeAheadHandlers;
  return typeAheadHandlers.find(function (h) {
    return h.id === id;
  }) || null;
};

exports.findHandler = findHandler;

var findHandlerByTrigger = function findHandlerByTrigger(_ref) {
  var trigger = _ref.trigger,
      editorState = _ref.editorState;

  var pluginState = _key.pluginKey.getState(editorState);

  if (!pluginState || !pluginState.typeAheadHandlers || pluginState.typeAheadHandlers.length === 0) {
    return null;
  }

  var typeAheadHandlers = pluginState.typeAheadHandlers;
  return typeAheadHandlers.find(function (h) {
    return h.trigger === trigger;
  }) || null;
};

exports.findHandlerByTrigger = findHandlerByTrigger;

var moveSelectedIndex = function moveSelectedIndex(_ref2) {
  var editorView = _ref2.editorView,
      direction = _ref2.direction;
  return function () {
    var typeAheadState = getPluginState(editorView.state);

    if (!typeAheadState) {
      return;
    }

    var selectedIndex = typeAheadState.selectedIndex,
        items = typeAheadState.items;
    var stats = typeAheadState.stats instanceof _statsModifier.StatsModifier ? typeAheadState.stats : new _statsModifier.StatsModifier();
    var nextIndex;

    if (direction === 'next') {
      stats.increaseArrowDown();
      nextIndex = selectedIndex >= items.length - 1 ? 0 : selectedIndex + 1;
    } else {
      stats.increaseArrowUp();
      nextIndex = selectedIndex === 0 ? items.length - 1 : selectedIndex - 1;
    }

    (0, _updateSelectedIndex.updateSelectedIndex)(nextIndex)(editorView.state, editorView.dispatch);
  };
};

exports.moveSelectedIndex = moveSelectedIndex;
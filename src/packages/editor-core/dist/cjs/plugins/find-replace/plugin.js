"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initialState = exports.getPluginState = exports.createPluginState = exports.createPlugin = exports.createCommand = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorView = require("prosemirror-view");

var _pluginStateFactory = require("../../utils/plugin-state-factory");

var _reducer = _interopRequireDefault(require("./reducer"));

var _types = require("./types");

var _utils = require("./utils");

var _array = require("../../utils/array");

var _step = require("../../utils/step");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var initialState = {
  isActive: false,
  shouldFocus: false,
  findText: '',
  replaceText: '',
  index: 0,
  matches: [],
  decorationSet: _prosemirrorView.DecorationSet.empty,
  shouldMatchCase: false
};
exports.initialState = initialState;

var handleDocChanged = function handleDocChanged(tr, pluginState) {
  var isActive = pluginState.isActive,
      findText = pluginState.findText;

  if (!isActive || !findText) {
    return pluginState;
  }

  if (!tr.steps.find(_step.stepHasSlice)) {
    return pluginState;
  }

  var index = pluginState.index,
      decorationSet = pluginState.decorationSet,
      matches = pluginState.matches,
      shouldMatchCase = pluginState.shouldMatchCase;
  var newMatches = (0, _utils.findMatches)(tr.doc, findText, shouldMatchCase);
  decorationSet = decorationSet.map(tr.mapping, tr.doc);
  var numDecorations = decorationSet.find().length;
  var mappedMatches = matches.map(function (match) {
    return {
      start: tr.mapping.map(match.start),
      end: tr.mapping.map(match.end)
    };
  });
  var matchesToAdd = [];
  var matchesToDelete = [];

  if (newMatches.length > 0 && numDecorations === 0) {
    matchesToAdd = newMatches;
  } else if (newMatches.length === 0 && numDecorations > 0) {
    decorationSet = _prosemirrorView.DecorationSet.empty;
  } else if (newMatches.length > 0 || numDecorations > 0) {
    // go through tr steps and find any new matches from user adding content or
    // any dead matches from user deleting content
    tr.steps.forEach(function (step) {
      if ((0, _step.stepHasSlice)(step)) {
        // add all matches that are between the affected positions and don't already have
        // corresponding decorations
        matchesToAdd = [].concat((0, _toConsumableArray2.default)(matchesToAdd), (0, _toConsumableArray2.default)(newMatches.filter(function (match) {
          return (0, _utils.isMatchAffectedByStep)(match, step, tr) && !(0, _utils.findDecorationFromMatch)(decorationSet, match);
        }))); // delete any matches that are missing from the newMatches array and have a
        // corresponding decoration

        matchesToDelete = [].concat((0, _toConsumableArray2.default)(matchesToDelete), (0, _toConsumableArray2.default)((0, _array.findUniqueItemsIn)(mappedMatches.filter(function (match) {
          return (0, _utils.isMatchAffectedByStep)(match, step, tr) && !!(0, _utils.findDecorationFromMatch)(decorationSet, match);
        }), newMatches, function (firstMatch, secondMatch) {
          return firstMatch.start === secondMatch.start && firstMatch.end === secondMatch.end;
        })));
      }
    });
  } // update decorations if matches changed following document update


  if (matchesToDelete.length > 0) {
    var decorationsToDelete = matchesToDelete.reduce(function (decorations, match) {
      return [].concat((0, _toConsumableArray2.default)(decorations), (0, _toConsumableArray2.default)(decorationSet.find(match.start, match.end)));
    }, []);
    decorationSet = (0, _utils.removeDecorationsFromSet)(decorationSet, decorationsToDelete, tr.doc);
  }

  if (matchesToAdd.length > 0) {
    decorationSet = decorationSet.add(tr.doc, (0, _utils.createDecorations)(tr.selection.from, matchesToAdd));
  } // update selected match if it has changed


  var newIndex = index;
  var selectedMatch = mappedMatches[index];

  if (selectedMatch) {
    newIndex = newMatches.findIndex(function (match) {
      return match.start === selectedMatch.start;
    });
  }

  if (newIndex === undefined || newIndex === -1) {
    newIndex = (0, _utils.findSearchIndex)(tr.selection.from, newMatches);
  }

  var newSelectedMatch = newMatches[newIndex];
  decorationSet = (0, _utils.removeMatchesFromSet)(decorationSet, [selectedMatch, newSelectedMatch], tr.doc);

  if (newSelectedMatch) {
    decorationSet = decorationSet.add(tr.doc, (0, _utils.createDecorations)(0, [newSelectedMatch]));
  }

  return _objectSpread(_objectSpread({}, pluginState), {}, {
    matches: newMatches,
    index: newIndex,
    decorationSet: decorationSet
  });
};

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(_types.findReplacePluginKey, (0, _reducer.default)(function () {
  return initialState;
}), {
  onDocChanged: handleDocChanged
}),
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState,
    createPluginState = _pluginFactory.createPluginState;

exports.createPluginState = createPluginState;
exports.getPluginState = getPluginState;
exports.createCommand = createCommand;

var createPlugin = function createPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    key: _types.findReplacePluginKey,
    state: createPluginState(dispatch, function () {
      return initialState;
    }),
    props: {
      decorations: function decorations(state) {
        var _getPluginState = getPluginState(state),
            isActive = _getPluginState.isActive,
            findText = _getPluginState.findText,
            decorationSet = _getPluginState.decorationSet;

        if (isActive && findText) {
          return decorationSet;
        }
      }
    }
  });
};

exports.createPlugin = createPlugin;
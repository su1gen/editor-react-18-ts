import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DecorationSet } from 'prosemirror-view';
import { pluginFactory } from '../../utils/plugin-state-factory';
import reducer from './reducer';
import { findReplacePluginKey } from './types';
import { findMatches, createDecorations, removeDecorationsFromSet, findSearchIndex, removeMatchesFromSet, findDecorationFromMatch, isMatchAffectedByStep } from './utils';
import { findUniqueItemsIn } from '../../utils/array';
import { stepHasSlice } from '../../utils/step';
export var initialState = {
  isActive: false,
  shouldFocus: false,
  findText: '',
  replaceText: '',
  index: 0,
  matches: [],
  decorationSet: DecorationSet.empty,
  shouldMatchCase: false
};

var handleDocChanged = function handleDocChanged(tr, pluginState) {
  var isActive = pluginState.isActive,
      findText = pluginState.findText;

  if (!isActive || !findText) {
    return pluginState;
  }

  if (!tr.steps.find(stepHasSlice)) {
    return pluginState;
  }

  var index = pluginState.index,
      decorationSet = pluginState.decorationSet,
      matches = pluginState.matches,
      shouldMatchCase = pluginState.shouldMatchCase;
  var newMatches = findMatches(tr.doc, findText, shouldMatchCase);
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
    decorationSet = DecorationSet.empty;
  } else if (newMatches.length > 0 || numDecorations > 0) {
    // go through tr steps and find any new matches from user adding content or
    // any dead matches from user deleting content
    tr.steps.forEach(function (step) {
      if (stepHasSlice(step)) {
        // add all matches that are between the affected positions and don't already have
        // corresponding decorations
        matchesToAdd = [].concat(_toConsumableArray(matchesToAdd), _toConsumableArray(newMatches.filter(function (match) {
          return isMatchAffectedByStep(match, step, tr) && !findDecorationFromMatch(decorationSet, match);
        }))); // delete any matches that are missing from the newMatches array and have a
        // corresponding decoration

        matchesToDelete = [].concat(_toConsumableArray(matchesToDelete), _toConsumableArray(findUniqueItemsIn(mappedMatches.filter(function (match) {
          return isMatchAffectedByStep(match, step, tr) && !!findDecorationFromMatch(decorationSet, match);
        }), newMatches, function (firstMatch, secondMatch) {
          return firstMatch.start === secondMatch.start && firstMatch.end === secondMatch.end;
        })));
      }
    });
  } // update decorations if matches changed following document update


  if (matchesToDelete.length > 0) {
    var decorationsToDelete = matchesToDelete.reduce(function (decorations, match) {
      return [].concat(_toConsumableArray(decorations), _toConsumableArray(decorationSet.find(match.start, match.end)));
    }, []);
    decorationSet = removeDecorationsFromSet(decorationSet, decorationsToDelete, tr.doc);
  }

  if (matchesToAdd.length > 0) {
    decorationSet = decorationSet.add(tr.doc, createDecorations(tr.selection.from, matchesToAdd));
  } // update selected match if it has changed


  var newIndex = index;
  var selectedMatch = mappedMatches[index];

  if (selectedMatch) {
    newIndex = newMatches.findIndex(function (match) {
      return match.start === selectedMatch.start;
    });
  }

  if (newIndex === undefined || newIndex === -1) {
    newIndex = findSearchIndex(tr.selection.from, newMatches);
  }

  var newSelectedMatch = newMatches[newIndex];
  decorationSet = removeMatchesFromSet(decorationSet, [selectedMatch, newSelectedMatch], tr.doc);

  if (newSelectedMatch) {
    decorationSet = decorationSet.add(tr.doc, createDecorations(0, [newSelectedMatch]));
  }

  return _objectSpread(_objectSpread({}, pluginState), {}, {
    matches: newMatches,
    index: newIndex,
    decorationSet: decorationSet
  });
};

var _pluginFactory = pluginFactory(findReplacePluginKey, reducer(function () {
  return initialState;
}), {
  onDocChanged: handleDocChanged
}),
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState,
    createPluginState = _pluginFactory.createPluginState;

export { createCommand, getPluginState, createPluginState };
export var createPlugin = function createPlugin(dispatch) {
  return new SafePlugin({
    key: findReplacePluginKey,
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
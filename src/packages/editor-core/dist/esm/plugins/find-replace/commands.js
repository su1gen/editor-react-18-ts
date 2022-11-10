import { TextSelection } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { createCommand, getPluginState } from './plugin';
import { FindReplaceActionTypes } from './actions';
import { findMatches, findSearchIndex, getSelectedText, createDecoration, nextIndex, prevIndex, findDecorationFromMatch, removeDecorationsFromSet, getSelectionForMatch, removeMatchesFromSet } from './utils';
import { withScrollIntoView } from '../../utils/commands';
import batchDecorations from './utils/batch-decorations';
export var activate = function activate() {
  return createCommand(function (state) {
    var selection = state.selection;
    var findText;
    var matches;
    var index; // if user has selected text and hit cmd-f, set that as the keyword

    if (selection instanceof TextSelection && !selection.empty) {
      findText = getSelectedText(selection);

      var _getPluginState = getPluginState(state),
          shouldMatchCase = _getPluginState.shouldMatchCase;

      matches = findMatches(state.doc, findText, shouldMatchCase);
      index = findSearchIndex(selection.from, matches);
    }

    return {
      type: FindReplaceActionTypes.ACTIVATE,
      findText: findText,
      matches: matches,
      index: index
    };
  });
};
export var find = function find(editorView, containerElement, keyword) {
  return withScrollIntoView(createCommand(function (state) {
    var selection = state.selection;

    var _getPluginState2 = getPluginState(state),
        shouldMatchCase = _getPluginState2.shouldMatchCase;

    var matches = keyword !== undefined ? findMatches(state.doc, keyword, shouldMatchCase) : [];
    var index = findSearchIndex(selection.from, matches); // we can't just apply all the decorations to highlight the search results at once
    // as if there are a lot ProseMirror cries :'(

    batchDecorations.applyAllSearchDecorations(editorView, containerElement, function (decorations) {
      return addDecorations(decorations)(editorView.state, editorView.dispatch);
    }, function (decorations) {
      return removeDecorations(decorations)(editorView.state, editorView.dispatch);
    });
    return {
      type: FindReplaceActionTypes.FIND,
      findText: keyword || '',
      matches: matches,
      index: index
    };
  }, function (tr, state) {
    var selection = state.selection;

    var _getPluginState3 = getPluginState(state),
        shouldMatchCase = _getPluginState3.shouldMatchCase;

    var matches = keyword !== undefined ? findMatches(state.doc, keyword, shouldMatchCase) : [];

    if (matches.length > 0) {
      var index = findSearchIndex(selection.from, matches);
      return tr.setSelection(getSelectionForMatch(tr.selection, tr.doc, index, matches));
    }

    return tr;
  }));
};
export var findNext = function findNext() {
  return withScrollIntoView(createCommand(function (state) {
    return findInDirection(state, 'next');
  }, function (tr, state) {
    var _getPluginState4 = getPluginState(state),
        matches = _getPluginState4.matches,
        index = _getPluginState4.index; // can't use index from plugin state because if the cursor has moved, it will still be the
    // OLD index (the find next operation should look for the first match forward starting
    // from the current cursor position)


    var searchIndex = findSearchIndex(state.selection.from, matches);

    if (searchIndex === index) {
      // cursor has not moved, so we just want to find the next in matches array
      searchIndex = nextIndex(searchIndex, matches.length);
    }

    return tr.setSelection(getSelectionForMatch(tr.selection, tr.doc, searchIndex, matches));
  }));
};
export var findPrevious = function findPrevious() {
  return withScrollIntoView(createCommand(function (state) {
    return findInDirection(state, 'previous');
  }, function (tr, state) {
    var _getPluginState5 = getPluginState(state),
        matches = _getPluginState5.matches; // can't use index from plugin state because if the cursor has moved, it will still be the
    // OLD index (the find prev operation should look for the first match backward starting
    // from the current cursor position)


    var searchIndex = findSearchIndex(state.selection.from, matches, true);
    return tr.setSelection(getSelectionForMatch(tr.selection, tr.doc, searchIndex, matches));
  }));
};

var findInDirection = function findInDirection(state, dir) {
  var pluginState = getPluginState(state);
  var matches = pluginState.matches,
      findText = pluginState.findText;
  var decorationSet = pluginState.decorationSet,
      index = pluginState.index;

  if (findText) {
    var searchIndex = findSearchIndex(state.selection.from, matches, dir === 'previous'); // compare index from plugin state and index of first match forward from cursor position

    if (index === searchIndex) {
      // normal case, cycling through matches
      index = dir === 'next' ? nextIndex(index, matches.length) : prevIndex(index, matches.length);
    } else {
      // cursor has moved
      index = searchIndex;
    }

    decorationSet = updateSelectedHighlight(state, index);
  }

  return {
    type: dir === 'next' ? FindReplaceActionTypes.FIND_NEXT : FindReplaceActionTypes.FIND_PREVIOUS,
    index: index,
    decorationSet: decorationSet
  };
};

export var replace = function replace(replaceText) {
  return withScrollIntoView(createCommand(function (state) {
    var pluginState = getPluginState(state);
    var findText = pluginState.findText;
    var decorationSet = pluginState.decorationSet,
        matches = pluginState.matches,
        index = pluginState.index;
    decorationSet = updateSelectedHighlight(state, nextIndex(index, matches.length));

    if (replaceText.toLowerCase().indexOf(findText.toLowerCase()) === -1) {
      decorationSet = removeMatchesFromSet(decorationSet, [matches[index]], state.doc);
      matches.splice(index, 1);

      if (index > matches.length - 1) {
        index = 0;
      }
    } else {
      index = nextIndex(index, matches.length);
    }

    return {
      type: FindReplaceActionTypes.REPLACE,
      replaceText: replaceText,
      decorationSet: decorationSet,
      matches: matches,
      index: index
    };
  }, function (tr, state) {
    var _getPluginState6 = getPluginState(state),
        matches = _getPluginState6.matches,
        index = _getPluginState6.index,
        findText = _getPluginState6.findText;

    if (matches[index]) {
      var _matches$index = matches[index],
          start = _matches$index.start,
          end = _matches$index.end;
      var newIndex = nextIndex(index, matches.length);
      tr.insertText(replaceText, start, end).setSelection(getSelectionForMatch(tr.selection, tr.doc, newIndex, matches, newIndex === 0 ? 0 : replaceText.length - findText.length));
    }

    return tr;
  }));
};
export var replaceAll = function replaceAll(replaceText) {
  return createCommand({
    type: FindReplaceActionTypes.REPLACE_ALL,
    replaceText: replaceText,
    decorationSet: DecorationSet.empty,
    matches: [],
    index: 0
  }, function (tr, state) {
    var pluginState = getPluginState(state);
    pluginState.matches.forEach(function (match) {
      tr.insertText(replaceText, tr.mapping.map(match.start), tr.mapping.map(match.end));
    });
    tr.setMeta('scrollIntoView', false);
    return tr;
  });
};
export var addDecorations = function addDecorations(decorations) {
  return createCommand(function (state) {
    var _getPluginState7 = getPluginState(state),
        decorationSet = _getPluginState7.decorationSet;

    return {
      type: FindReplaceActionTypes.UPDATE_DECORATIONS,
      decorationSet: decorationSet.add(state.doc, decorations)
    };
  });
};
export var removeDecorations = function removeDecorations(decorations) {
  return createCommand(function (state) {
    var _getPluginState8 = getPluginState(state),
        decorationSet = _getPluginState8.decorationSet;

    return {
      type: FindReplaceActionTypes.UPDATE_DECORATIONS,
      decorationSet: removeDecorationsFromSet(decorationSet, decorations, state.doc)
    };
  });
};
export var cancelSearch = function cancelSearch() {
  return createCommand(function () {
    batchDecorations.stop();
    return {
      type: FindReplaceActionTypes.CANCEL
    };
  });
};
export var blur = function blur() {
  return createCommand({
    type: FindReplaceActionTypes.BLUR
  });
};
export var toggleMatchCase = function toggleMatchCase() {
  return createCommand({
    type: FindReplaceActionTypes.TOGGLE_MATCH_CASE
  });
};

var updateSelectedHighlight = function updateSelectedHighlight(state, nextSelectedIndex) {
  var _getPluginState9 = getPluginState(state),
      decorationSet = _getPluginState9.decorationSet,
      index = _getPluginState9.index,
      matches = _getPluginState9.matches;

  var currentSelectedMatch = matches[index];
  var nextSelectedMatch = matches[nextSelectedIndex];

  if (index === nextSelectedIndex) {
    return decorationSet;
  }

  var currentSelectedDecoration = findDecorationFromMatch(decorationSet, currentSelectedMatch);
  var nextSelectedDecoration = findDecorationFromMatch(decorationSet, nextSelectedMatch); // Update decorations so the current selected match becomes a normal match
  // and the next selected gets the selected styling

  var decorationsToRemove = [];

  if (currentSelectedDecoration) {
    decorationsToRemove.push(currentSelectedDecoration);
  }

  if (nextSelectedDecoration) {
    decorationsToRemove.push(nextSelectedDecoration);
  }

  if (decorationsToRemove.length > 0) {
    // removeDecorationsFromSet depends on decorations being pre-sorted
    decorationsToRemove.sort(function (a, b) {
      return a.from < b.from ? -1 : 1;
    });
    decorationSet = removeDecorationsFromSet(decorationSet, decorationsToRemove, state.doc);
  }

  if (currentSelectedMatch) {
    decorationSet = decorationSet.add(state.doc, [createDecoration(currentSelectedMatch.start, currentSelectedMatch.end)]);
  }

  if (nextSelectedMatch) {
    decorationSet = decorationSet.add(state.doc, [createDecoration(nextSelectedMatch.start, nextSelectedMatch.end, true)]);
  }

  return decorationSet;
};
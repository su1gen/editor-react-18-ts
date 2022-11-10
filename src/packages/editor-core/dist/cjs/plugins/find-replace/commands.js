"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleMatchCase = exports.replaceAll = exports.replace = exports.removeDecorations = exports.findPrevious = exports.findNext = exports.find = exports.cancelSearch = exports.blur = exports.addDecorations = exports.activate = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _plugin = require("./plugin");

var _actions = require("./actions");

var _utils = require("./utils");

var _commands = require("../../utils/commands");

var _batchDecorations = _interopRequireDefault(require("./utils/batch-decorations"));

var activate = function activate() {
  return (0, _plugin.createCommand)(function (state) {
    var selection = state.selection;
    var findText;
    var matches;
    var index; // if user has selected text and hit cmd-f, set that as the keyword

    if (selection instanceof _prosemirrorState.TextSelection && !selection.empty) {
      findText = (0, _utils.getSelectedText)(selection);

      var _getPluginState = (0, _plugin.getPluginState)(state),
          shouldMatchCase = _getPluginState.shouldMatchCase;

      matches = (0, _utils.findMatches)(state.doc, findText, shouldMatchCase);
      index = (0, _utils.findSearchIndex)(selection.from, matches);
    }

    return {
      type: _actions.FindReplaceActionTypes.ACTIVATE,
      findText: findText,
      matches: matches,
      index: index
    };
  });
};

exports.activate = activate;

var find = function find(editorView, containerElement, keyword) {
  return (0, _commands.withScrollIntoView)((0, _plugin.createCommand)(function (state) {
    var selection = state.selection;

    var _getPluginState2 = (0, _plugin.getPluginState)(state),
        shouldMatchCase = _getPluginState2.shouldMatchCase;

    var matches = keyword !== undefined ? (0, _utils.findMatches)(state.doc, keyword, shouldMatchCase) : [];
    var index = (0, _utils.findSearchIndex)(selection.from, matches); // we can't just apply all the decorations to highlight the search results at once
    // as if there are a lot ProseMirror cries :'(

    _batchDecorations.default.applyAllSearchDecorations(editorView, containerElement, function (decorations) {
      return addDecorations(decorations)(editorView.state, editorView.dispatch);
    }, function (decorations) {
      return removeDecorations(decorations)(editorView.state, editorView.dispatch);
    });

    return {
      type: _actions.FindReplaceActionTypes.FIND,
      findText: keyword || '',
      matches: matches,
      index: index
    };
  }, function (tr, state) {
    var selection = state.selection;

    var _getPluginState3 = (0, _plugin.getPluginState)(state),
        shouldMatchCase = _getPluginState3.shouldMatchCase;

    var matches = keyword !== undefined ? (0, _utils.findMatches)(state.doc, keyword, shouldMatchCase) : [];

    if (matches.length > 0) {
      var index = (0, _utils.findSearchIndex)(selection.from, matches);
      return tr.setSelection((0, _utils.getSelectionForMatch)(tr.selection, tr.doc, index, matches));
    }

    return tr;
  }));
};

exports.find = find;

var findNext = function findNext() {
  return (0, _commands.withScrollIntoView)((0, _plugin.createCommand)(function (state) {
    return findInDirection(state, 'next');
  }, function (tr, state) {
    var _getPluginState4 = (0, _plugin.getPluginState)(state),
        matches = _getPluginState4.matches,
        index = _getPluginState4.index; // can't use index from plugin state because if the cursor has moved, it will still be the
    // OLD index (the find next operation should look for the first match forward starting
    // from the current cursor position)


    var searchIndex = (0, _utils.findSearchIndex)(state.selection.from, matches);

    if (searchIndex === index) {
      // cursor has not moved, so we just want to find the next in matches array
      searchIndex = (0, _utils.nextIndex)(searchIndex, matches.length);
    }

    return tr.setSelection((0, _utils.getSelectionForMatch)(tr.selection, tr.doc, searchIndex, matches));
  }));
};

exports.findNext = findNext;

var findPrevious = function findPrevious() {
  return (0, _commands.withScrollIntoView)((0, _plugin.createCommand)(function (state) {
    return findInDirection(state, 'previous');
  }, function (tr, state) {
    var _getPluginState5 = (0, _plugin.getPluginState)(state),
        matches = _getPluginState5.matches; // can't use index from plugin state because if the cursor has moved, it will still be the
    // OLD index (the find prev operation should look for the first match backward starting
    // from the current cursor position)


    var searchIndex = (0, _utils.findSearchIndex)(state.selection.from, matches, true);
    return tr.setSelection((0, _utils.getSelectionForMatch)(tr.selection, tr.doc, searchIndex, matches));
  }));
};

exports.findPrevious = findPrevious;

var findInDirection = function findInDirection(state, dir) {
  var pluginState = (0, _plugin.getPluginState)(state);
  var matches = pluginState.matches,
      findText = pluginState.findText;
  var decorationSet = pluginState.decorationSet,
      index = pluginState.index;

  if (findText) {
    var searchIndex = (0, _utils.findSearchIndex)(state.selection.from, matches, dir === 'previous'); // compare index from plugin state and index of first match forward from cursor position

    if (index === searchIndex) {
      // normal case, cycling through matches
      index = dir === 'next' ? (0, _utils.nextIndex)(index, matches.length) : (0, _utils.prevIndex)(index, matches.length);
    } else {
      // cursor has moved
      index = searchIndex;
    }

    decorationSet = updateSelectedHighlight(state, index);
  }

  return {
    type: dir === 'next' ? _actions.FindReplaceActionTypes.FIND_NEXT : _actions.FindReplaceActionTypes.FIND_PREVIOUS,
    index: index,
    decorationSet: decorationSet
  };
};

var replace = function replace(replaceText) {
  return (0, _commands.withScrollIntoView)((0, _plugin.createCommand)(function (state) {
    var pluginState = (0, _plugin.getPluginState)(state);
    var findText = pluginState.findText;
    var decorationSet = pluginState.decorationSet,
        matches = pluginState.matches,
        index = pluginState.index;
    decorationSet = updateSelectedHighlight(state, (0, _utils.nextIndex)(index, matches.length));

    if (replaceText.toLowerCase().indexOf(findText.toLowerCase()) === -1) {
      decorationSet = (0, _utils.removeMatchesFromSet)(decorationSet, [matches[index]], state.doc);
      matches.splice(index, 1);

      if (index > matches.length - 1) {
        index = 0;
      }
    } else {
      index = (0, _utils.nextIndex)(index, matches.length);
    }

    return {
      type: _actions.FindReplaceActionTypes.REPLACE,
      replaceText: replaceText,
      decorationSet: decorationSet,
      matches: matches,
      index: index
    };
  }, function (tr, state) {
    var _getPluginState6 = (0, _plugin.getPluginState)(state),
        matches = _getPluginState6.matches,
        index = _getPluginState6.index,
        findText = _getPluginState6.findText;

    if (matches[index]) {
      var _matches$index = matches[index],
          start = _matches$index.start,
          end = _matches$index.end;
      var newIndex = (0, _utils.nextIndex)(index, matches.length);
      tr.insertText(replaceText, start, end).setSelection((0, _utils.getSelectionForMatch)(tr.selection, tr.doc, newIndex, matches, newIndex === 0 ? 0 : replaceText.length - findText.length));
    }

    return tr;
  }));
};

exports.replace = replace;

var replaceAll = function replaceAll(replaceText) {
  return (0, _plugin.createCommand)({
    type: _actions.FindReplaceActionTypes.REPLACE_ALL,
    replaceText: replaceText,
    decorationSet: _prosemirrorView.DecorationSet.empty,
    matches: [],
    index: 0
  }, function (tr, state) {
    var pluginState = (0, _plugin.getPluginState)(state);
    pluginState.matches.forEach(function (match) {
      tr.insertText(replaceText, tr.mapping.map(match.start), tr.mapping.map(match.end));
    });
    tr.setMeta('scrollIntoView', false);
    return tr;
  });
};

exports.replaceAll = replaceAll;

var addDecorations = function addDecorations(decorations) {
  return (0, _plugin.createCommand)(function (state) {
    var _getPluginState7 = (0, _plugin.getPluginState)(state),
        decorationSet = _getPluginState7.decorationSet;

    return {
      type: _actions.FindReplaceActionTypes.UPDATE_DECORATIONS,
      decorationSet: decorationSet.add(state.doc, decorations)
    };
  });
};

exports.addDecorations = addDecorations;

var removeDecorations = function removeDecorations(decorations) {
  return (0, _plugin.createCommand)(function (state) {
    var _getPluginState8 = (0, _plugin.getPluginState)(state),
        decorationSet = _getPluginState8.decorationSet;

    return {
      type: _actions.FindReplaceActionTypes.UPDATE_DECORATIONS,
      decorationSet: (0, _utils.removeDecorationsFromSet)(decorationSet, decorations, state.doc)
    };
  });
};

exports.removeDecorations = removeDecorations;

var cancelSearch = function cancelSearch() {
  return (0, _plugin.createCommand)(function () {
    _batchDecorations.default.stop();

    return {
      type: _actions.FindReplaceActionTypes.CANCEL
    };
  });
};

exports.cancelSearch = cancelSearch;

var blur = function blur() {
  return (0, _plugin.createCommand)({
    type: _actions.FindReplaceActionTypes.BLUR
  });
};

exports.blur = blur;

var toggleMatchCase = function toggleMatchCase() {
  return (0, _plugin.createCommand)({
    type: _actions.FindReplaceActionTypes.TOGGLE_MATCH_CASE
  });
};

exports.toggleMatchCase = toggleMatchCase;

var updateSelectedHighlight = function updateSelectedHighlight(state, nextSelectedIndex) {
  var _getPluginState9 = (0, _plugin.getPluginState)(state),
      decorationSet = _getPluginState9.decorationSet,
      index = _getPluginState9.index,
      matches = _getPluginState9.matches;

  var currentSelectedMatch = matches[index];
  var nextSelectedMatch = matches[nextSelectedIndex];

  if (index === nextSelectedIndex) {
    return decorationSet;
  }

  var currentSelectedDecoration = (0, _utils.findDecorationFromMatch)(decorationSet, currentSelectedMatch);
  var nextSelectedDecoration = (0, _utils.findDecorationFromMatch)(decorationSet, nextSelectedMatch); // Update decorations so the current selected match becomes a normal match
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
    decorationSet = (0, _utils.removeDecorationsFromSet)(decorationSet, decorationsToRemove, state.doc);
  }

  if (currentSelectedMatch) {
    decorationSet = decorationSet.add(state.doc, [(0, _utils.createDecoration)(currentSelectedMatch.start, currentSelectedMatch.end)]);
  }

  if (nextSelectedMatch) {
    decorationSet = decorationSet.add(state.doc, [(0, _utils.createDecoration)(nextSelectedMatch.start, nextSelectedMatch.end, true)]);
  }

  return decorationSet;
};
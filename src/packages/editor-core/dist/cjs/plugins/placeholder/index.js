"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlaceholderDecoration = createPlaceholderDecoration;
exports.createPlugin = createPlugin;
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _utils = require("@atlaskit/editor-common/utils");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _document = require("../../utils/document");

var _main = require("../alignment/pm-plugins/main");

var _styles = require("./styles");

var _focusHandler = require("../base/pm-plugins/focus-handler");

var _utils2 = require("../type-ahead/utils");

var _composition = require("../base/pm-plugins/composition");

var pluginKey = new _prosemirrorState.PluginKey('placeholderPlugin');
exports.pluginKey = pluginKey;

function getPlaceholderState(editorState) {
  return pluginKey.getState(editorState);
}

function createPlaceholderDecoration(editorState, placeholderText) {
  var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var placeholderDecoration = document.createElement('span');
  var placeHolderClass = _styles.placeHolderClassName;

  var alignment = _main.pluginKey.getState(editorState);

  if (alignment && alignment.align === 'end') {
    placeHolderClass = placeHolderClass + ' align-end';
  } else if (alignment && alignment.align === 'center') {
    placeHolderClass = placeHolderClass + ' align-center';
  }

  placeholderDecoration.className = placeHolderClass;
  var placeholderNode = document.createElement('span');
  placeholderNode.textContent = placeholderText;
  placeholderDecoration.appendChild(placeholderNode); // ME-2289 Tapping on backspace in empty editor hides and displays the keyboard
  // Add a editable buff node as the cursor moving forward is inevitable
  // when backspace in GBoard composition

  if (_utils.browser.android && _utils.browser.chrome) {
    var buffNode = document.createElement('span');
    buffNode.setAttribute('contenteditable', 'true');
    buffNode.textContent = ' ';
    placeholderDecoration.appendChild(buffNode);
  }

  return _prosemirrorView.DecorationSet.create(editorState.doc, [_prosemirrorView.Decoration.widget(pos, placeholderDecoration, {
    side: -1,
    key: 'placeholder'
  })]);
}

function setPlaceHolderState(placeholderText, pos) {
  return {
    hasPlaceholder: true,
    placeholderText: placeholderText,
    pos: pos ? pos : 1
  };
}

var emptyPlaceholder = {
  hasPlaceholder: false
};

function createPlaceHolderStateFrom(editorState, getPlaceholderHintMessage, defaultPlaceholderText, bracketPlaceholderText) {
  var isEditorFocused = _focusHandler.focusStateKey.getState(editorState);

  if ((0, _utils2.isTypeAheadOpen)(editorState)) {
    return emptyPlaceholder;
  }

  if (defaultPlaceholderText && (0, _document.isEmptyDocument)(editorState.doc)) {
    return setPlaceHolderState(defaultPlaceholderText);
  }

  var placeholderHint = getPlaceholderHintMessage();

  if (placeholderHint && (0, _document.isInEmptyLine)(editorState) && isEditorFocused) {
    var $from = editorState.selection.$from;
    return setPlaceHolderState(placeholderHint, $from.pos);
  }

  if (bracketPlaceholderText && (0, _document.bracketTyped)(editorState) && isEditorFocused) {
    var _$from = editorState.selection.$from; // Space is to account for positioning of the bracket

    var bracketHint = '  ' + bracketPlaceholderText;
    return setPlaceHolderState(bracketHint, _$from.pos - 1);
  }

  return emptyPlaceholder;
}

function createGetPlaceholderHintMessage(placeholderHints) {
  var index = 0;
  return function () {
    if (!placeholderHints || placeholderHints.length === 0) {
      return;
    }

    var length = placeholderHints.length;
    var placeholder = placeholderHints[index++];
    index = index % length;
    return placeholder;
  };
}

function createPlugin(defaultPlaceholderText, placeholderHints, bracketPlaceholderText) {
  if (!defaultPlaceholderText && !placeholderHints && !bracketPlaceholderText) {
    return;
  }

  var getPlaceholderHintMessage = createGetPlaceholderHintMessage(placeholderHints);
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_, state) {
        return createPlaceHolderStateFrom(state, getPlaceholderHintMessage, defaultPlaceholderText, bracketPlaceholderText);
      },
      apply: function apply(tr, _oldPluginState, _oldEditorState, newEditorState) {
        var meta = tr.getMeta(pluginKey);

        if (meta) {
          if (meta.removePlaceholder) {
            return emptyPlaceholder;
          }

          if (meta.applyPlaceholderIfEmpty) {
            return createPlaceHolderStateFrom(newEditorState, getPlaceholderHintMessage, defaultPlaceholderText, bracketPlaceholderText);
          }
        }

        return createPlaceHolderStateFrom(newEditorState, getPlaceholderHintMessage, defaultPlaceholderText, bracketPlaceholderText);
      }
    },
    props: {
      decorations: function decorations(editorState) {
        var _getPlaceholderState = getPlaceholderState(editorState),
            hasPlaceholder = _getPlaceholderState.hasPlaceholder,
            placeholderText = _getPlaceholderState.placeholderText,
            pos = _getPlaceholderState.pos;

        if (hasPlaceholder && placeholderText && pos !== undefined && !(0, _composition.isComposing)(editorState)) {
          return createPlaceholderDecoration(editorState, placeholderText, pos);
        }

        return;
      }
    }
  });
}

var placeholderPlugin = function placeholderPlugin(options) {
  return {
    name: 'placeholder',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'placeholder',
        plugin: function plugin() {
          return createPlugin(options && options.placeholder, options && options.placeholderHints, options && options.placeholderBracketHint);
        }
      }];
    }
  };
};

var _default = placeholderPlugin;
exports.default = _default;
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { PluginKey } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { isInEmptyLine, isEmptyDocument, bracketTyped } from '../../utils/document';
import { pluginKey as alignmentPluginKey } from '../alignment/pm-plugins/main';
import { placeHolderClassName } from './styles';
export var pluginKey = new PluginKey('placeholderPlugin');
import { focusStateKey } from '../base/pm-plugins/focus-handler';
import { isTypeAheadOpen } from '../type-ahead/utils';
import { isComposing } from '../base/pm-plugins/composition';

function getPlaceholderState(editorState) {
  return pluginKey.getState(editorState);
}

export function createPlaceholderDecoration(editorState, placeholderText) {
  var pos = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var placeholderDecoration = document.createElement('span');
  var placeHolderClass = placeHolderClassName;
  var alignment = alignmentPluginKey.getState(editorState);

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

  if (browser.android && browser.chrome) {
    var buffNode = document.createElement('span');
    buffNode.setAttribute('contenteditable', 'true');
    buffNode.textContent = ' ';
    placeholderDecoration.appendChild(buffNode);
  }

  return DecorationSet.create(editorState.doc, [Decoration.widget(pos, placeholderDecoration, {
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
  var isEditorFocused = focusStateKey.getState(editorState);

  if (isTypeAheadOpen(editorState)) {
    return emptyPlaceholder;
  }

  if (defaultPlaceholderText && isEmptyDocument(editorState.doc)) {
    return setPlaceHolderState(defaultPlaceholderText);
  }

  var placeholderHint = getPlaceholderHintMessage();

  if (placeholderHint && isInEmptyLine(editorState) && isEditorFocused) {
    var $from = editorState.selection.$from;
    return setPlaceHolderState(placeholderHint, $from.pos);
  }

  if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
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

export function createPlugin(defaultPlaceholderText, placeholderHints, bracketPlaceholderText) {
  if (!defaultPlaceholderText && !placeholderHints && !bracketPlaceholderText) {
    return;
  }

  var getPlaceholderHintMessage = createGetPlaceholderHintMessage(placeholderHints);
  return new SafePlugin({
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

        if (hasPlaceholder && placeholderText && pos !== undefined && !isComposing(editorState)) {
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

export default placeholderPlugin;
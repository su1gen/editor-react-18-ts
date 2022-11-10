import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { PluginKey } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { isInEmptyLine, isEmptyDocument, bracketTyped } from '../../utils/document';
import { pluginKey as alignmentPluginKey } from '../alignment/pm-plugins/main';
import { placeHolderClassName } from './styles';
export const pluginKey = new PluginKey('placeholderPlugin');
import { focusStateKey } from '../base/pm-plugins/focus-handler';
import { isTypeAheadOpen } from '../type-ahead/utils';
import { isComposing } from '../base/pm-plugins/composition';

function getPlaceholderState(editorState) {
  return pluginKey.getState(editorState);
}

export function createPlaceholderDecoration(editorState, placeholderText, pos = 1) {
  const placeholderDecoration = document.createElement('span');
  let placeHolderClass = placeHolderClassName;
  const alignment = alignmentPluginKey.getState(editorState);

  if (alignment && alignment.align === 'end') {
    placeHolderClass = placeHolderClass + ' align-end';
  } else if (alignment && alignment.align === 'center') {
    placeHolderClass = placeHolderClass + ' align-center';
  }

  placeholderDecoration.className = placeHolderClass;
  const placeholderNode = document.createElement('span');
  placeholderNode.textContent = placeholderText;
  placeholderDecoration.appendChild(placeholderNode); // ME-2289 Tapping on backspace in empty editor hides and displays the keyboard
  // Add a editable buff node as the cursor moving forward is inevitable
  // when backspace in GBoard composition

  if (browser.android && browser.chrome) {
    const buffNode = document.createElement('span');
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
    placeholderText,
    pos: pos ? pos : 1
  };
}

const emptyPlaceholder = {
  hasPlaceholder: false
};

function createPlaceHolderStateFrom(editorState, getPlaceholderHintMessage, defaultPlaceholderText, bracketPlaceholderText) {
  const isEditorFocused = focusStateKey.getState(editorState);

  if (isTypeAheadOpen(editorState)) {
    return emptyPlaceholder;
  }

  if (defaultPlaceholderText && isEmptyDocument(editorState.doc)) {
    return setPlaceHolderState(defaultPlaceholderText);
  }

  const placeholderHint = getPlaceholderHintMessage();

  if (placeholderHint && isInEmptyLine(editorState) && isEditorFocused) {
    const {
      $from
    } = editorState.selection;
    return setPlaceHolderState(placeholderHint, $from.pos);
  }

  if (bracketPlaceholderText && bracketTyped(editorState) && isEditorFocused) {
    const {
      $from
    } = editorState.selection; // Space is to account for positioning of the bracket

    const bracketHint = '  ' + bracketPlaceholderText;
    return setPlaceHolderState(bracketHint, $from.pos - 1);
  }

  return emptyPlaceholder;
}

function createGetPlaceholderHintMessage(placeholderHints) {
  let index = 0;
  return () => {
    if (!placeholderHints || placeholderHints.length === 0) {
      return;
    }

    const {
      length
    } = placeholderHints;
    const placeholder = placeholderHints[index++];
    index = index % length;
    return placeholder;
  };
}

export function createPlugin(defaultPlaceholderText, placeholderHints, bracketPlaceholderText) {
  if (!defaultPlaceholderText && !placeholderHints && !bracketPlaceholderText) {
    return;
  }

  const getPlaceholderHintMessage = createGetPlaceholderHintMessage(placeholderHints);
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: (_, state) => createPlaceHolderStateFrom(state, getPlaceholderHintMessage, defaultPlaceholderText, bracketPlaceholderText),
      apply: (tr, _oldPluginState, _oldEditorState, newEditorState) => {
        const meta = tr.getMeta(pluginKey);

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
      decorations(editorState) {
        const {
          hasPlaceholder,
          placeholderText,
          pos
        } = getPlaceholderState(editorState);

        if (hasPlaceholder && placeholderText && pos !== undefined && !isComposing(editorState)) {
          return createPlaceholderDecoration(editorState, placeholderText, pos);
        }

        return;
      }

    }
  });
}

const placeholderPlugin = options => ({
  name: 'placeholder',

  pmPlugins() {
    return [{
      name: 'placeholder',
      plugin: () => createPlugin(options && options.placeholder, options && options.placeholderHints, options && options.placeholderBracketHint)
    }];
  }

});

export default placeholderPlugin;
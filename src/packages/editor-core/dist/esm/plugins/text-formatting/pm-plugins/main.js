import { toggleMark } from 'prosemirror-commands';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../../keymaps';
import { shallowEqual } from '../../../utils';
import { createInlineCodeFromTextInputWithAnalytics } from '../commands/text-formatting'; // eslint-disable-next-line no-duplicate-imports

import * as commands from '../commands/text-formatting';
import { anyMarkActive } from '../utils';
import { pluginKey } from './plugin-key';
export { pluginKey };

var getTextFormattingState = function getTextFormattingState(editorState) {
  var _editorState$schema$m = editorState.schema.marks,
      em = _editorState$schema$m.em,
      code = _editorState$schema$m.code,
      strike = _editorState$schema$m.strike,
      strong = _editorState$schema$m.strong,
      subsup = _editorState$schema$m.subsup,
      underline = _editorState$schema$m.underline;
  var state = {};

  if (code) {
    state.codeActive = anyMarkActive(editorState, code.create());
    state.codeDisabled = !toggleMark(code)(editorState);
  }

  if (em) {
    state.emActive = anyMarkActive(editorState, em);
    state.emDisabled = state.codeActive ? true : !toggleMark(em)(editorState);
  }

  if (strike) {
    state.strikeActive = anyMarkActive(editorState, strike);
    state.strikeDisabled = state.codeActive ? true : !toggleMark(strike)(editorState);
  }

  if (strong) {
    state.strongActive = anyMarkActive(editorState, strong);
    state.strongDisabled = state.codeActive ? true : !toggleMark(strong)(editorState);
  }

  if (subsup) {
    var subMark = subsup.create({
      type: 'sub'
    });
    var supMark = subsup.create({
      type: 'sup'
    });
    state.subscriptActive = anyMarkActive(editorState, subMark);
    state.subscriptDisabled = state.codeActive ? true : !toggleMark(subsup, {
      type: 'sub'
    })(editorState);
    state.superscriptActive = anyMarkActive(editorState, supMark);
    state.superscriptDisabled = state.codeActive ? true : !toggleMark(subsup, {
      type: 'sup'
    })(editorState);
  }

  if (underline) {
    state.underlineActive = anyMarkActive(editorState, underline);
    state.underlineDisabled = state.codeActive ? true : !toggleMark(underline)(editorState);
  }

  return state;
};

export var plugin = function plugin(dispatch) {
  return new SafePlugin({
    state: {
      init: function init(_config, state) {
        return getTextFormattingState(state);
      },
      apply: function apply(_tr, pluginState, _oldState, newState) {
        var state = getTextFormattingState(newState);

        if (!shallowEqual(pluginState, state)) {
          dispatch(pluginKey, state);
          return state;
        }

        return pluginState;
      }
    },
    key: pluginKey,
    props: {
      handleKeyDown: function handleKeyDown(view, event) {
        var state = view.state,
            dispatch = view.dispatch;

        if (event.key === keymaps.moveRight.common && !event.metaKey) {
          return commands.moveRight()(state, dispatch);
        } else if (event.key === keymaps.moveLeft.common && !event.metaKey) {
          return commands.moveLeft()(state, dispatch);
        }

        return false;
      },
      handleTextInput: function handleTextInput(view, from, to, text) {
        var state = view.state,
            dispatch = view.dispatch;
        var schema = state.schema,
            parentNodeType = state.selection.$from.parent.type;

        if (parentNodeType.allowsMarkType(schema.marks.code)) {
          return createInlineCodeFromTextInputWithAnalytics(from, to, text)(state, dispatch);
        }

        return false;
      }
    }
  });
};
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { keymap } from 'prosemirror-keymap';
import * as keymaps from '../../keymaps';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../../plugins/analytics';
import { stateKey as mediaPluginKey } from '../../plugins/media/pm-plugins/plugin-key';
import { analyticsEventKey } from '../analytics/consts';
export function createPlugin(eventDispatch, onSave) {
  if (!onSave) {
    return;
  }

  return keymap(_defineProperty({}, "".concat(keymaps.submit.common), function _(state, _dispatch, editorView) {
    var mediaState = mediaPluginKey.getState(state);

    if (mediaState && mediaState.waitForMediaUpload && !mediaState.allUploadsFinished) {
      return true;
    }

    eventDispatch(analyticsEventKey, analyticsPayload(state));
    onSave(editorView);
    return true;
  }));
}

var analyticsPayload = function analyticsPayload(state) {
  return {
    payload: {
      action: ACTION.STOPPED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      actionSubjectId: ACTION_SUBJECT_ID.SAVE,
      attributes: {
        inputMethod: INPUT_METHOD.SHORTCUT,
        documentSize: state.doc.nodeSize // TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks

      },
      eventType: EVENT_TYPE.UI
    }
  };
};

var submitEditorPlugin = function submitEditorPlugin(onSave) {
  return {
    name: 'submitEditor',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'submitEditor',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, onSave);
        }
      }];
    }
  };
};

export default submitEditorPlugin;
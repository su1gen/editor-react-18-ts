import { indentList, outdentList, toggleBulletList, toggleOrderedList } from '../../list/commands';
import { getIndentCommand as indentParagraphOrHeading, getOutdentCommand as outdentParagraphOrHeading } from '../../indentation/commands';
import { getIndentCommand as indentTaskList, getUnindentCommand as outdentTaskList } from '../../tasks-and-decisions/pm-plugins/keymaps';
import { INPUT_METHOD } from '../../analytics';
import { pluginKey as indentationButtonsPluginKey } from '../pm-plugins/indentation-buttons';
export function onItemActivated(_ref) {
  var buttonName = _ref.buttonName,
      editorView = _ref.editorView;

  switch (buttonName) {
    case 'bullet_list':
      toggleBulletList(editorView, INPUT_METHOD.TOOLBAR);
      break;

    case 'ordered_list':
      toggleOrderedList(editorView, INPUT_METHOD.TOOLBAR);
      break;

    case 'indent':
      {
        var node = indentationButtonsPluginKey.getState(editorView.state).node;

        if (node === 'paragraph_heading') {
          indentParagraphOrHeading(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (node === 'list') {
          indentList(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (node === 'taskList') {
          indentTaskList(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        break;
      }

    case 'outdent':
      {
        var _node = indentationButtonsPluginKey.getState(editorView.state).node;

        if (_node === 'paragraph_heading') {
          outdentParagraphOrHeading(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (_node === 'list') {
          outdentList(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        if (_node === 'taskList') {
          outdentTaskList(INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
        }

        break;
      }
  }
}
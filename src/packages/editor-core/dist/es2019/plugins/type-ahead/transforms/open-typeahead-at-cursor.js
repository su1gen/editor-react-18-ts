import { TextSelection } from 'prosemirror-state';
import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
import { browser } from '@atlaskit/editor-common/utils';
export const openTypeAhead = props => tr => {
  const {
    triggerHandler,
    inputMethod,
    query
  } = props;
  tr.setMeta(pluginKey, {
    action: ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR,
    params: {
      triggerHandler,
      inputMethod,
      query
    }
  });
};
export const openTypeAheadAtCursor = ({
  triggerHandler,
  inputMethod,
  query
}) => tr => {
  var _selection$$head, _selection$$head$pare, _selection$$head$pare2, _selection$$head$pare3;

  openTypeAhead({
    triggerHandler,
    inputMethod,
    query
  })(tr);
  const {
    selection
  } = tr;

  if (!(selection instanceof TextSelection)) {
    return tr;
  }

  if (!selection.$cursor) {
    tr.deleteSelection();
    return tr;
  } // Search & Destroy placeholder


  const cursorPos = selection.$cursor.pos;
  const nodeAtCursor = tr.doc.nodeAt(cursorPos);
  const isPlaceholderAtCursorPosition = nodeAtCursor && nodeAtCursor.type.name === 'placeholder';

  if (nodeAtCursor && isPlaceholderAtCursorPosition) {
    tr.delete(cursorPos, cursorPos + nodeAtCursor.nodeSize);
  } // ME-2375 remove the superfluous '@' inserted before decoration
  // by composition (https://github.com/ProseMirror/prosemirror/issues/903)


  if (browser.chrome && browser.android && cursorPos > 2 && !!(selection !== null && selection !== void 0 && (_selection$$head = selection.$head) !== null && _selection$$head !== void 0 && (_selection$$head$pare = _selection$$head.parent) !== null && _selection$$head$pare !== void 0 && _selection$$head$pare.textContent) && (_selection$$head$pare2 = (_selection$$head$pare3 = selection.$head.parent.textContent).endsWith) !== null && _selection$$head$pare2 !== void 0 && _selection$$head$pare2.call(_selection$$head$pare3, '@')) {
    tr.delete(cursorPos - 1, cursorPos);
  }

  return tr;
};
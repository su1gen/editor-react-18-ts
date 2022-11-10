import { TextSelection } from 'prosemirror-state';
import { pluginKey } from '../pm-plugins/key';
import { ACTIONS } from '../pm-plugins/actions';
import { browser } from '@atlaskit/editor-common/utils';
export var openTypeAhead = function openTypeAhead(props) {
  return function (tr) {
    var triggerHandler = props.triggerHandler,
        inputMethod = props.inputMethod,
        query = props.query;
    tr.setMeta(pluginKey, {
      action: ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR,
      params: {
        triggerHandler: triggerHandler,
        inputMethod: inputMethod,
        query: query
      }
    });
  };
};
export var openTypeAheadAtCursor = function openTypeAheadAtCursor(_ref) {
  var triggerHandler = _ref.triggerHandler,
      inputMethod = _ref.inputMethod,
      query = _ref.query;
  return function (tr) {
    var _selection$$head, _selection$$head$pare, _selection$$head$pare2, _selection$$head$pare3;

    openTypeAhead({
      triggerHandler: triggerHandler,
      inputMethod: inputMethod,
      query: query
    })(tr);
    var selection = tr.selection;

    if (!(selection instanceof TextSelection)) {
      return tr;
    }

    if (!selection.$cursor) {
      tr.deleteSelection();
      return tr;
    } // Search & Destroy placeholder


    var cursorPos = selection.$cursor.pos;
    var nodeAtCursor = tr.doc.nodeAt(cursorPos);
    var isPlaceholderAtCursorPosition = nodeAtCursor && nodeAtCursor.type.name === 'placeholder';

    if (nodeAtCursor && isPlaceholderAtCursorPosition) {
      tr.delete(cursorPos, cursorPos + nodeAtCursor.nodeSize);
    } // ME-2375 remove the superfluous '@' inserted before decoration
    // by composition (https://github.com/ProseMirror/prosemirror/issues/903)


    if (browser.chrome && browser.android && cursorPos > 2 && !!(selection !== null && selection !== void 0 && (_selection$$head = selection.$head) !== null && _selection$$head !== void 0 && (_selection$$head$pare = _selection$$head.parent) !== null && _selection$$head$pare !== void 0 && _selection$$head$pare.textContent) && (_selection$$head$pare2 = (_selection$$head$pare3 = selection.$head.parent.textContent).endsWith) !== null && _selection$$head$pare2 !== void 0 && _selection$$head$pare2.call(_selection$$head$pare3, '@')) {
      tr.delete(cursorPos - 1, cursorPos);
    }

    return tr;
  };
};
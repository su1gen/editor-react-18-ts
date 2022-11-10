"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openTypeAheadAtCursor = exports.openTypeAhead = void 0;

var _prosemirrorState = require("prosemirror-state");

var _key = require("../pm-plugins/key");

var _actions = require("../pm-plugins/actions");

var _utils = require("@atlaskit/editor-common/utils");

var openTypeAhead = function openTypeAhead(props) {
  return function (tr) {
    var triggerHandler = props.triggerHandler,
        inputMethod = props.inputMethod,
        query = props.query;
    tr.setMeta(_key.pluginKey, {
      action: _actions.ACTIONS.OPEN_TYPEAHEAD_AT_CURSOR,
      params: {
        triggerHandler: triggerHandler,
        inputMethod: inputMethod,
        query: query
      }
    });
  };
};

exports.openTypeAhead = openTypeAhead;

var openTypeAheadAtCursor = function openTypeAheadAtCursor(_ref) {
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

    if (!(selection instanceof _prosemirrorState.TextSelection)) {
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


    if (_utils.browser.chrome && _utils.browser.android && cursorPos > 2 && !!(selection !== null && selection !== void 0 && (_selection$$head = selection.$head) !== null && _selection$$head !== void 0 && (_selection$$head$pare = _selection$$head.parent) !== null && _selection$$head$pare !== void 0 && _selection$$head$pare.textContent) && (_selection$$head$pare2 = (_selection$$head$pare3 = selection.$head.parent.textContent).endsWith) !== null && _selection$$head$pare2 !== void 0 && _selection$$head$pare2.call(_selection$$head$pare3, '@')) {
      tr.delete(cursorPos - 1, cursorPos);
    }

    return tr;
  };
};

exports.openTypeAheadAtCursor = openTypeAheadAtCursor;
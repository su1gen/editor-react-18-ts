import _typeof from "@babel/runtime/helpers/typeof";

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import { Selection, TextSelection } from 'prosemirror-state';
import { Decoration } from 'prosemirror-view';
import * as themeColors from '@atlaskit/theme/colors';
import { hexToRgba } from '@atlaskit/adf-schema';
import { ZERO_WIDTH_JOINER } from '@atlaskit/editor-common/utils';
import { addAnalytics } from '../analytics/utils';
import { EVENT_TYPE, ACTION, ACTION_SUBJECT } from '../analytics/types';
export var colors = [themeColors.R100, themeColors.R300, themeColors.R500, themeColors.Y100, themeColors.Y300, themeColors.Y500, themeColors.G100, themeColors.G300, themeColors.G500, themeColors.T100, themeColors.T300, themeColors.T500, themeColors.B100, themeColors.B300, themeColors.B500, themeColors.P100, themeColors.P300, themeColors.P500, themeColors.N70, themeColors.N200, themeColors.N800].map(function (solid) {
  return {
    solid: solid,
    selection: hexToRgba(solid, 0.2)
  };
});
export var getAvatarColor = function getAvatarColor(str) {
  var hash = 0;

  for (var i = 0; i < str.length; i++) {
    /* eslint-disable no-bitwise */
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash;
    /* eslint-enable no-bitwise */
  }

  var index = Math.abs(hash) % colors.length;
  return {
    index: index,
    color: colors[index]
  };
};
export var findPointers = function findPointers(id, decorations) {
  return decorations.find().reduce(function (arr, deco) {
    return deco.spec.pointer.sessionId === id ? arr.concat(deco) : arr;
  }, []);
};

function style(options) {
  var color = options && options.color || 'black';
  return "border-left: 1px solid ".concat(color, "; border-right: 1px solid ").concat(color, "; margin-right: -2px;");
}

export var createTelepointers = function createTelepointers(from, to, sessionId, isSelection, initial) {
  var decorations = [];
  var avatarColor = getAvatarColor(sessionId);
  var color = avatarColor.index.toString();

  if (isSelection) {
    var className = "telepointer color-".concat(color, " telepointer-selection");
    decorations.push(Decoration.inline(from, to, {
      class: className,
      'data-initial': initial
    }, {
      pointer: {
        sessionId: sessionId
      }
    }));
  }

  var spaceJoinerBefore = document.createElement('span');
  spaceJoinerBefore.textContent = ZERO_WIDTH_JOINER;
  var spaceJoinerAfter = document.createElement('span');
  spaceJoinerAfter.textContent = ZERO_WIDTH_JOINER;
  var cursor = document.createElement('span');
  cursor.textContent = ZERO_WIDTH_JOINER;
  cursor.className = "telepointer color-".concat(color, " telepointer-selection-badge");
  cursor.style.cssText = "".concat(style({
    color: avatarColor.color.solid
  }), ";");
  cursor.setAttribute('data-initial', initial);
  return decorations.concat(Decoration.widget(to, spaceJoinerAfter, {
    pointer: {
      sessionId: sessionId
    },
    key: "telepointer-".concat(sessionId, "-zero")
  })).concat(Decoration.widget(to, cursor, {
    pointer: {
      sessionId: sessionId
    },
    key: "telepointer-".concat(sessionId)
  })).concat(Decoration.widget(to, spaceJoinerBefore, {
    pointer: {
      sessionId: sessionId
    },
    key: "telepointer-".concat(sessionId, "-zero")
  }));
};
export var replaceDocument = function replaceDocument(doc, state, version, options, reserveCursor) {
  var schema = state.schema,
      tr = state.tr;
  var content = (doc.content || []).map(function (child) {
    return schema.nodeFromJSON(child);
  });
  var hasContent = !!content.length;

  if (hasContent) {
    tr.setMeta('addToHistory', false);
    tr.replaceWith(0, state.doc.nodeSize - 2, content);
    var selection = state.selection;

    if (reserveCursor) {
      // If the cursor is still in the range of the new document,
      // keep where it was.
      if (selection.to < tr.doc.content.size - 2) {
        var $from = tr.doc.resolve(selection.from);
        var $to = tr.doc.resolve(selection.to);
        var newselection = new TextSelection($from, $to);
        tr.setSelection(newselection);
      }
    } else {
      tr.setSelection(Selection.atStart(tr.doc));
    }

    tr.setMeta('replaceDocument', true);

    if (_typeof(version) !== undefined && options && options.useNativePlugin) {
      var collabState = {
        version: version,
        unconfirmed: []
      };
      tr.setMeta('collab$', collabState);
    }
  }

  return tr;
};
export var scrollToCollabCursor = function scrollToCollabCursor(editorView, participants, sessionId, index) {
  var selectedUser = participants[index];

  if (selectedUser && selectedUser.cursorPos !== undefined && selectedUser.sessionId !== sessionId) {
    var state = editorView.state;
    var tr = state.tr;
    var analyticsPayload = {
      action: ACTION.MATCHED,
      actionSubject: ACTION_SUBJECT.SELECTION,
      eventType: EVENT_TYPE.TRACK
    };
    tr.setSelection(Selection.near(tr.doc.resolve(selectedUser.cursorPos)));
    tr = addAnalytics(state, tr, analyticsPayload);
    tr.scrollIntoView();
    editorView.dispatch(tr);

    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }
};
export var getPositionOfTelepointer = function getPositionOfTelepointer(sessionId, decorationSet) {
  var scrollPosition;
  decorationSet.find().forEach(function (deco) {
    if (deco.type.spec.pointer.sessionId === sessionId) {
      scrollPosition = deco.from;
    }
  });
  return scrollPosition;
};
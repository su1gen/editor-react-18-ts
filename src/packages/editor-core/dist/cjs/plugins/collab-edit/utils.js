"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scrollToCollabCursor = exports.replaceDocument = exports.getPositionOfTelepointer = exports.getAvatarColor = exports.findPointers = exports.createTelepointers = exports.colors = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var themeColors = _interopRequireWildcard(require("@atlaskit/theme/colors"));

var _adfSchema = require("@atlaskit/adf-schema");

var _utils = require("@atlaskit/editor-common/utils");

var _utils2 = require("../analytics/utils");

var _types = require("../analytics/types");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
var colors = [themeColors.R100, themeColors.R300, themeColors.R500, themeColors.Y100, themeColors.Y300, themeColors.Y500, themeColors.G100, themeColors.G300, themeColors.G500, themeColors.T100, themeColors.T300, themeColors.T500, themeColors.B100, themeColors.B300, themeColors.B500, themeColors.P100, themeColors.P300, themeColors.P500, themeColors.N70, themeColors.N200, themeColors.N800].map(function (solid) {
  return {
    solid: solid,
    selection: (0, _adfSchema.hexToRgba)(solid, 0.2)
  };
});
exports.colors = colors;

var getAvatarColor = function getAvatarColor(str) {
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

exports.getAvatarColor = getAvatarColor;

var findPointers = function findPointers(id, decorations) {
  return decorations.find().reduce(function (arr, deco) {
    return deco.spec.pointer.sessionId === id ? arr.concat(deco) : arr;
  }, []);
};

exports.findPointers = findPointers;

function style(options) {
  var color = options && options.color || 'black';
  return "border-left: 1px solid ".concat(color, "; border-right: 1px solid ").concat(color, "; margin-right: -2px;");
}

var createTelepointers = function createTelepointers(from, to, sessionId, isSelection, initial) {
  var decorations = [];
  var avatarColor = getAvatarColor(sessionId);
  var color = avatarColor.index.toString();

  if (isSelection) {
    var className = "telepointer color-".concat(color, " telepointer-selection");
    decorations.push(_prosemirrorView.Decoration.inline(from, to, {
      class: className,
      'data-initial': initial
    }, {
      pointer: {
        sessionId: sessionId
      }
    }));
  }

  var spaceJoinerBefore = document.createElement('span');
  spaceJoinerBefore.textContent = _utils.ZERO_WIDTH_JOINER;
  var spaceJoinerAfter = document.createElement('span');
  spaceJoinerAfter.textContent = _utils.ZERO_WIDTH_JOINER;
  var cursor = document.createElement('span');
  cursor.textContent = _utils.ZERO_WIDTH_JOINER;
  cursor.className = "telepointer color-".concat(color, " telepointer-selection-badge");
  cursor.style.cssText = "".concat(style({
    color: avatarColor.color.solid
  }), ";");
  cursor.setAttribute('data-initial', initial);
  return decorations.concat(_prosemirrorView.Decoration.widget(to, spaceJoinerAfter, {
    pointer: {
      sessionId: sessionId
    },
    key: "telepointer-".concat(sessionId, "-zero")
  })).concat(_prosemirrorView.Decoration.widget(to, cursor, {
    pointer: {
      sessionId: sessionId
    },
    key: "telepointer-".concat(sessionId)
  })).concat(_prosemirrorView.Decoration.widget(to, spaceJoinerBefore, {
    pointer: {
      sessionId: sessionId
    },
    key: "telepointer-".concat(sessionId, "-zero")
  }));
};

exports.createTelepointers = createTelepointers;

var replaceDocument = function replaceDocument(doc, state, version, options, reserveCursor) {
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
        var newselection = new _prosemirrorState.TextSelection($from, $to);
        tr.setSelection(newselection);
      }
    } else {
      tr.setSelection(_prosemirrorState.Selection.atStart(tr.doc));
    }

    tr.setMeta('replaceDocument', true);

    if ((0, _typeof2.default)(version) !== undefined && options && options.useNativePlugin) {
      var collabState = {
        version: version,
        unconfirmed: []
      };
      tr.setMeta('collab$', collabState);
    }
  }

  return tr;
};

exports.replaceDocument = replaceDocument;

var scrollToCollabCursor = function scrollToCollabCursor(editorView, participants, sessionId, index) {
  var selectedUser = participants[index];

  if (selectedUser && selectedUser.cursorPos !== undefined && selectedUser.sessionId !== sessionId) {
    var state = editorView.state;
    var tr = state.tr;
    var analyticsPayload = {
      action: _types.ACTION.MATCHED,
      actionSubject: _types.ACTION_SUBJECT.SELECTION,
      eventType: _types.EVENT_TYPE.TRACK
    };
    tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(selectedUser.cursorPos)));
    tr = (0, _utils2.addAnalytics)(state, tr, analyticsPayload);
    tr.scrollIntoView();
    editorView.dispatch(tr);

    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }
};

exports.scrollToCollabCursor = scrollToCollabCursor;

var getPositionOfTelepointer = function getPositionOfTelepointer(sessionId, decorationSet) {
  var scrollPosition;
  decorationSet.find().forEach(function (deco) {
    if (deco.type.spec.pointer.sessionId === sessionId) {
      scrollPosition = deco.from;
    }
  });
  return scrollPosition;
};

exports.getPositionOfTelepointer = getPositionOfTelepointer;
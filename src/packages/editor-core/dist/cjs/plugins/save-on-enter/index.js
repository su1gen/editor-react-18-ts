"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.default = void 0;

var _prosemirrorKeymap = require("prosemirror-keymap");

var _analytics = require("../../plugins/analytics");

var _consts = require("../analytics/consts");

function createPlugin(eventDispatch, onSave) {
  if (!onSave) {
    return;
  }

  return (0, _prosemirrorKeymap.keymap)({
    Enter: function Enter(state, _dispatch, editorView) {
      if (canSaveOnEnter(editorView)) {
        eventDispatch(_consts.analyticsEventKey, analyticsPayload(state));
        onSave(editorView);
        return true;
      }

      return false;
    }
  });
}

function canSaveOnEnter(editorView) {
  var _ref = editorView.state.selection,
      $cursor = _ref.$cursor;
  var _editorView$state$sch = editorView.state.schema.nodes,
      decisionItem = _editorView$state$sch.decisionItem,
      paragraph = _editorView$state$sch.paragraph,
      taskItem = _editorView$state$sch.taskItem;
  return !$cursor || $cursor.parent.type === paragraph && $cursor.depth === 1 || $cursor.parent.type === decisionItem && !isEmptyAtCursor($cursor) || $cursor.parent.type === taskItem && !isEmptyAtCursor($cursor);
}

function isEmptyAtCursor($cursor) {
  var content = $cursor.parent.content;
  return !(content && content.size);
}

var analyticsPayload = function analyticsPayload(state) {
  return {
    payload: {
      action: _analytics.ACTION.STOPPED,
      actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.SAVE,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.SHORTCUT,
        documentSize: state.doc.nodeSize // TODO add individual node counts - tables, headings, lists, mediaSingles, mediaGroups, mediaCards, panels, extensions, decisions, action, codeBlocks

      },
      eventType: _analytics.EVENT_TYPE.UI
    }
  };
};

var saveOnEnterPlugin = function saveOnEnterPlugin(onSave) {
  return {
    name: 'saveOnEnter',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'saveOnEnter',
        plugin: function plugin(_ref2) {
          var dispatch = _ref2.dispatch;
          return createPlugin(dispatch, onSave);
        }
      }];
    }
  };
};

var _default = saveOnEnterPlugin;
exports.default = _default;
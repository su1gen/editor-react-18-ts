"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggleUnderlineWithAnalytics = exports.toggleUnderline = exports.toggleSuperscriptWithAnalytics = exports.toggleSuperscript = exports.toggleSubscriptWithAnalytics = exports.toggleSubscript = exports.toggleStrongWithAnalytics = exports.toggleStrong = exports.toggleStrikeWithAnalytics = exports.toggleStrike = exports.toggleEmWithAnalytics = exports.toggleEm = exports.toggleCodeWithAnalytics = exports.toggleCode = exports.moveRight = exports.moveLeft = exports.createInlineCodeFromTextInputWithAnalytics = void 0;

var _prosemirrorState = require("prosemirror-state");

var _commands = require("../../../utils/commands");

var _analytics = require("../../analytics");

var _utils = require("../utils");

var moveRight = function moveRight() {
  return function (state, dispatch) {
    var code = state.schema.marks.code;
    var _ref = state.selection,
        empty = _ref.empty,
        $cursor = _ref.$cursor;

    if (!empty || !$cursor) {
      return false;
    }

    var storedMarks = state.tr.storedMarks;

    if (code) {
      var insideCode = (0, _utils.markActive)(state, code.create());
      var currentPosHasCode = state.doc.rangeHasMark($cursor.pos, $cursor.pos, code);
      var nextPosHasCode = state.doc.rangeHasMark($cursor.pos, $cursor.pos + 1, code);
      var exitingCode = !currentPosHasCode && !nextPosHasCode && (!storedMarks || !!storedMarks.length);
      var enteringCode = !currentPosHasCode && nextPosHasCode && (!storedMarks || !storedMarks.length); // entering code mark (from the left edge): don't move the cursor, just add the mark

      if (!insideCode && enteringCode) {
        if (dispatch) {
          dispatch(state.tr.addStoredMark(code.create()));
        }

        return true;
      } // exiting code mark: don't move the cursor, just remove the mark


      if (insideCode && exitingCode) {
        if (dispatch) {
          dispatch(state.tr.removeStoredMark(code));
        }

        return true;
      }
    }

    return false;
  };
};

exports.moveRight = moveRight;

var moveLeft = function moveLeft() {
  return function (state, dispatch) {
    var code = state.schema.marks.code;
    var _ref2 = state.selection,
        empty = _ref2.empty,
        $cursor = _ref2.$cursor;

    if (!empty || !$cursor) {
      return false;
    }

    var storedMarks = state.tr.storedMarks;

    if (code) {
      var insideCode = code && (0, _utils.markActive)(state, code.create());
      var currentPosHasCode = (0, _utils.hasCode)(state, $cursor.pos);
      var nextPosHasCode = (0, _utils.hasCode)(state, $cursor.pos - 1);
      var nextNextPosHasCode = (0, _utils.hasCode)(state, $cursor.pos - 2);
      var exitingCode = currentPosHasCode && !nextPosHasCode && Array.isArray(storedMarks);
      var atLeftEdge = nextPosHasCode && !nextNextPosHasCode && (storedMarks === null || Array.isArray(storedMarks) && !!storedMarks.length);
      var atRightEdge = (exitingCode && Array.isArray(storedMarks) && !storedMarks.length || !exitingCode && storedMarks === null) && !nextPosHasCode && nextNextPosHasCode;
      var enteringCode = !currentPosHasCode && nextPosHasCode && Array.isArray(storedMarks) && !storedMarks.length; // at the right edge: remove code mark and move the cursor to the left

      if (!insideCode && atRightEdge) {
        var tr = state.tr.setSelection(_prosemirrorState.Selection.near(state.doc.resolve($cursor.pos - 1)));

        if (dispatch) {
          dispatch(tr.removeStoredMark(code));
        }

        return true;
      } // entering code mark (from right edge): don't move the cursor, just add the mark


      if (!insideCode && enteringCode) {
        if (dispatch) {
          dispatch(state.tr.addStoredMark(code.create()));
        }

        return true;
      } // at the left edge: add code mark and move the cursor to the left


      if (insideCode && atLeftEdge) {
        var _tr = state.tr.setSelection(_prosemirrorState.Selection.near(state.doc.resolve($cursor.pos - 1)));

        if (dispatch) {
          dispatch(_tr.addStoredMark(code.create()));
        }

        return true;
      } // exiting code mark (or at the beginning of the line): don't move the cursor, just remove the mark


      var isFirstChild = $cursor.index($cursor.depth - 1) === 0;

      if (insideCode && (exitingCode || !$cursor.nodeBefore && isFirstChild)) {
        if (dispatch) {
          dispatch(state.tr.removeStoredMark(code));
        }

        return true;
      }
    }

    return false;
  };
};

exports.moveLeft = moveLeft;

var toggleEm = function toggleEm() {
  return function (state, dispatch) {
    var em = state.schema.marks.em;

    if (em) {
      return (0, _commands.toggleMark)(em)(state, dispatch);
    }

    return false;
  };
};

exports.toggleEm = toggleEm;

var toggleEmWithAnalytics = function toggleEmWithAnalytics(_ref3) {
  var inputMethod = _ref3.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_ITALIC,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleEm());
};

exports.toggleEmWithAnalytics = toggleEmWithAnalytics;

var toggleStrike = function toggleStrike() {
  return function (state, dispatch) {
    var strike = state.schema.marks.strike;

    if (strike) {
      return (0, _commands.toggleMark)(strike)(state, dispatch);
    }

    return false;
  };
};

exports.toggleStrike = toggleStrike;

var toggleStrikeWithAnalytics = function toggleStrikeWithAnalytics(_ref4) {
  var inputMethod = _ref4.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_STRIKE,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleStrike());
};

exports.toggleStrikeWithAnalytics = toggleStrikeWithAnalytics;

var toggleStrong = function toggleStrong() {
  return function (state, dispatch) {
    var strong = state.schema.marks.strong;

    if (strong) {
      return (0, _commands.toggleMark)(strong)(state, dispatch);
    }

    return false;
  };
};

exports.toggleStrong = toggleStrong;

var toggleStrongWithAnalytics = function toggleStrongWithAnalytics(_ref5) {
  var inputMethod = _ref5.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_STRONG,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleStrong());
};

exports.toggleStrongWithAnalytics = toggleStrongWithAnalytics;

var toggleUnderline = function toggleUnderline() {
  return function (state, dispatch) {
    var underline = state.schema.marks.underline;

    if (underline) {
      return (0, _commands.toggleMark)(underline)(state, dispatch);
    }

    return false;
  };
};

exports.toggleUnderline = toggleUnderline;

var toggleUnderlineWithAnalytics = function toggleUnderlineWithAnalytics(_ref6) {
  var inputMethod = _ref6.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_UNDERLINE,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleUnderline());
};

exports.toggleUnderlineWithAnalytics = toggleUnderlineWithAnalytics;

var toggleSuperscript = function toggleSuperscript() {
  return function (state, dispatch) {
    var subsup = state.schema.marks.subsup;

    if (subsup) {
      return (0, _commands.toggleMark)(subsup, {
        type: 'sup'
      })(state, dispatch);
    }

    return false;
  };
};

exports.toggleSuperscript = toggleSuperscript;

var toggleSuperscriptWithAnalytics = function toggleSuperscriptWithAnalytics(_ref7) {
  var inputMethod = _ref7.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_SUPER,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleSuperscript());
};

exports.toggleSuperscriptWithAnalytics = toggleSuperscriptWithAnalytics;

var toggleSubscript = function toggleSubscript() {
  return function (state, dispatch) {
    var subsup = state.schema.marks.subsup;

    if (subsup) {
      return (0, _commands.toggleMark)(subsup, {
        type: 'sub'
      })(state, dispatch);
    }

    return false;
  };
};

exports.toggleSubscript = toggleSubscript;

var toggleSubscriptWithAnalytics = function toggleSubscriptWithAnalytics(_ref8) {
  var inputMethod = _ref8.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_SUB,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleSubscript());
};

exports.toggleSubscriptWithAnalytics = toggleSubscriptWithAnalytics;

var toggleCode = function toggleCode() {
  return function (state, dispatch) {
    var code = state.schema.marks.code;

    if (code) {
      return (0, _commands.toggleMark)(code)(state, dispatch);
    }

    return false;
  };
};

exports.toggleCode = toggleCode;

var toggleCodeWithAnalytics = function toggleCodeWithAnalytics(_ref9) {
  var inputMethod = _ref9.inputMethod;
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_CODE,
    attributes: {
      inputMethod: inputMethod
    }
  })(toggleCode());
};

exports.toggleCodeWithAnalytics = toggleCodeWithAnalytics;

var createInlineCodeFromTextInput = function createInlineCodeFromTextInput(from, to, text) {
  return function (state, dispatch) {
    if (state.selection.empty) {
      var _state$doc$resolve = state.doc.resolve(from),
          before = _state$doc$resolve.nodeBefore;

      var _state$doc$resolve2 = state.doc.resolve(to),
          after = _state$doc$resolve2.nodeAfter;

      var hasTickBefore = before && before.text && before.text.endsWith('`');
      var hasTickAfter = after && after.text && after.text.startsWith('`');

      if (hasTickBefore && hasTickAfter) {
        var tr = state.tr.replaceRangeWith(from - 1, to + 1, state.schema.text(text));

        if (dispatch) {
          var codeMark = state.schema.marks.code.create();
          tr = (0, _commands.applyMarkOnRange)(tr.mapping.map(from - 1), tr.mapping.map(to + 1), false, codeMark, tr).setStoredMarks([codeMark]);
          dispatch(tr);
        }

        return true;
      }
    }

    return false;
  };
};

var createInlineCodeFromTextInputWithAnalytics = function createInlineCodeFromTextInputWithAnalytics(from, to, text) {
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_CODE,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.FORMATTING
    }
  })(createInlineCodeFromTextInput(from, to, text));
};

exports.createInlineCodeFromTextInputWithAnalytics = createInlineCodeFromTextInputWithAnalytics;
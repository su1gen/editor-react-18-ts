"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indent = indent;
exports.insertIndent = insertIndent;
exports.insertNewlineWithIndent = insertNewlineWithIndent;
exports.outdent = outdent;

var _prosemirrorState = require("prosemirror-state");

var _lineHandling = require("./line-handling");

var _analytics = require("../../analytics");

/**
 * Return the current indentation level
 * @param indentText - Text in the code block that represent an indentation
 * @param indentSize - Size of the indentation token in a string
 */
function getIndentLevel(indentText, indentSize) {
  if (indentSize === 0 || indentText.length === 0) {
    return 0;
  }

  return indentText.length / indentSize;
}

function indent(state, dispatch) {
  var _getLinesFromSelectio = (0, _lineHandling.getLinesFromSelection)(state),
      text = _getLinesFromSelectio.text,
      start = _getLinesFromSelectio.start;

  var tr = state.tr,
      selection = state.selection;
  (0, _lineHandling.forEachLine)(text, function (line, offset) {
    var _getLineInfo = (0, _lineHandling.getLineInfo)(line),
        indentText = _getLineInfo.indentText,
        indentToken = _getLineInfo.indentToken;

    var indentLevel = getIndentLevel(indentText, indentToken.size);
    var indentToAdd = indentToken.token.repeat(indentToken.size - indentText.length % indentToken.size || indentToken.size);
    tr.insertText(indentToAdd, tr.mapping.map(start + offset, -1));
    (0, _analytics.addAnalytics)(state, tr, {
      action: _analytics.ACTION.FORMATTED,
      actionSubject: _analytics.ACTION_SUBJECT.TEXT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_INDENT,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.KEYBOARD,
        previousIndentationLevel: indentLevel,
        newIndentLevel: indentLevel + 1,
        direction: _analytics.INDENT_DIRECTION.INDENT,
        indentType: _analytics.INDENT_TYPE.CODE_BLOCK
      }
    });

    if (!selection.empty) {
      tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, tr.mapping.map(selection.from, -1), tr.selection.to));
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}

function outdent(state, dispatch) {
  var _getLinesFromSelectio2 = (0, _lineHandling.getLinesFromSelection)(state),
      text = _getLinesFromSelectio2.text,
      start = _getLinesFromSelectio2.start;

  var tr = state.tr;
  (0, _lineHandling.forEachLine)(text, function (line, offset) {
    var _getLineInfo2 = (0, _lineHandling.getLineInfo)(line),
        indentText = _getLineInfo2.indentText,
        indentToken = _getLineInfo2.indentToken;

    if (indentText) {
      var indentLevel = getIndentLevel(indentText, indentToken.size);
      var unindentLength = indentText.length % indentToken.size || indentToken.size;
      tr.delete(tr.mapping.map(start + offset), tr.mapping.map(start + offset + unindentLength));
      (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.FORMATTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_INDENT,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: _analytics.INPUT_METHOD.KEYBOARD,
          previousIndentationLevel: indentLevel,
          newIndentLevel: indentLevel - 1,
          direction: _analytics.INDENT_DIRECTION.OUTDENT,
          indentType: _analytics.INDENT_TYPE.CODE_BLOCK
        }
      });
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}

function insertIndent(state, dispatch) {
  var _getStartOfCurrentLin = (0, _lineHandling.getStartOfCurrentLine)(state),
      textAtStartOfLine = _getStartOfCurrentLin.text;

  var _getLineInfo3 = (0, _lineHandling.getLineInfo)(textAtStartOfLine),
      indentToken = _getLineInfo3.indentToken;

  var indentToAdd = indentToken.token.repeat(indentToken.size - textAtStartOfLine.length % indentToken.size || indentToken.size);
  dispatch(state.tr.insertText(indentToAdd));
  return true;
}

function insertNewlineWithIndent(state, dispatch) {
  var _getStartOfCurrentLin2 = (0, _lineHandling.getStartOfCurrentLine)(state),
      textAtStartOfLine = _getStartOfCurrentLin2.text;

  var _getLineInfo4 = (0, _lineHandling.getLineInfo)(textAtStartOfLine),
      indentText = _getLineInfo4.indentText;

  if (indentText && dispatch) {
    dispatch(state.tr.insertText('\n' + indentText));
    return true;
  }

  return false;
}
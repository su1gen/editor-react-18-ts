import { TextSelection } from 'prosemirror-state';
import { getLinesFromSelection, getLineInfo, forEachLine, getStartOfCurrentLine } from './line-handling';
import { addAnalytics, ACTION, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD, INDENT_DIRECTION, INDENT_TYPE, ACTION_SUBJECT } from '../../analytics';

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

export function indent(state, dispatch) {
  var _getLinesFromSelectio = getLinesFromSelection(state),
      text = _getLinesFromSelectio.text,
      start = _getLinesFromSelectio.start;

  var tr = state.tr,
      selection = state.selection;
  forEachLine(text, function (line, offset) {
    var _getLineInfo = getLineInfo(line),
        indentText = _getLineInfo.indentText,
        indentToken = _getLineInfo.indentToken;

    var indentLevel = getIndentLevel(indentText, indentToken.size);
    var indentToAdd = indentToken.token.repeat(indentToken.size - indentText.length % indentToken.size || indentToken.size);
    tr.insertText(indentToAdd, tr.mapping.map(start + offset, -1));
    addAnalytics(state, tr, {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.KEYBOARD,
        previousIndentationLevel: indentLevel,
        newIndentLevel: indentLevel + 1,
        direction: INDENT_DIRECTION.INDENT,
        indentType: INDENT_TYPE.CODE_BLOCK
      }
    });

    if (!selection.empty) {
      tr.setSelection(TextSelection.create(tr.doc, tr.mapping.map(selection.from, -1), tr.selection.to));
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}
export function outdent(state, dispatch) {
  var _getLinesFromSelectio2 = getLinesFromSelection(state),
      text = _getLinesFromSelectio2.text,
      start = _getLinesFromSelectio2.start;

  var tr = state.tr;
  forEachLine(text, function (line, offset) {
    var _getLineInfo2 = getLineInfo(line),
        indentText = _getLineInfo2.indentText,
        indentToken = _getLineInfo2.indentToken;

    if (indentText) {
      var indentLevel = getIndentLevel(indentText, indentToken.size);
      var unindentLength = indentText.length % indentToken.size || indentToken.size;
      tr.delete(tr.mapping.map(start + offset), tr.mapping.map(start + offset + unindentLength));
      addAnalytics(state, tr, {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_INDENT,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: INPUT_METHOD.KEYBOARD,
          previousIndentationLevel: indentLevel,
          newIndentLevel: indentLevel - 1,
          direction: INDENT_DIRECTION.OUTDENT,
          indentType: INDENT_TYPE.CODE_BLOCK
        }
      });
    }
  });

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}
export function insertIndent(state, dispatch) {
  var _getStartOfCurrentLin = getStartOfCurrentLine(state),
      textAtStartOfLine = _getStartOfCurrentLin.text;

  var _getLineInfo3 = getLineInfo(textAtStartOfLine),
      indentToken = _getLineInfo3.indentToken;

  var indentToAdd = indentToken.token.repeat(indentToken.size - textAtStartOfLine.length % indentToken.size || indentToken.size);
  dispatch(state.tr.insertText(indentToAdd));
  return true;
}
export function insertNewlineWithIndent(state, dispatch) {
  var _getStartOfCurrentLin2 = getStartOfCurrentLine(state),
      textAtStartOfLine = _getStartOfCurrentLin2.text;

  var _getLineInfo4 = getLineInfo(textAtStartOfLine),
      indentText = _getLineInfo4.indentText;

  if (indentText && dispatch) {
    dispatch(state.tr.insertText('\n' + indentText));
    return true;
  }

  return false;
}
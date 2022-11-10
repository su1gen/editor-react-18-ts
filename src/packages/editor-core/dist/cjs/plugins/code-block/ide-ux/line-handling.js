"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLineInfo = exports.getEndOfCurrentLine = exports.forEachLine = void 0;
exports.getLinesFromSelection = getLinesFromSelection;
exports.isSelectionEntirelyInsideCodeBlock = exports.isCursorInsideCodeBlock = exports.getStartOfCurrentLine = void 0;

var _utils = require("../../../utils");

var isSelectionEntirelyInsideCodeBlock = function isSelectionEntirelyInsideCodeBlock(state) {
  return state.selection.$from.sameParent(state.selection.$to) && state.selection.$from.parent.type === state.schema.nodes.codeBlock;
};

exports.isSelectionEntirelyInsideCodeBlock = isSelectionEntirelyInsideCodeBlock;

var isCursorInsideCodeBlock = function isCursorInsideCodeBlock(state) {
  return !!(0, _utils.getCursor)(state.selection) && isSelectionEntirelyInsideCodeBlock(state);
};

exports.isCursorInsideCodeBlock = isCursorInsideCodeBlock;

var getStartOfCurrentLine = function getStartOfCurrentLine(state) {
  var $from = state.selection.$from;

  if ($from.nodeBefore && $from.nodeBefore.isText) {
    var prevNewLineIndex = $from.nodeBefore.text.lastIndexOf('\n');
    return {
      text: $from.nodeBefore.text.substring(prevNewLineIndex + 1),
      pos: $from.start() + prevNewLineIndex + 1
    };
  }

  return {
    text: '',
    pos: $from.pos
  };
};

exports.getStartOfCurrentLine = getStartOfCurrentLine;

var getEndOfCurrentLine = function getEndOfCurrentLine(state) {
  var $to = state.selection.$to;

  if ($to.nodeAfter && $to.nodeAfter.isText) {
    var nextNewLineIndex = $to.nodeAfter.text.indexOf('\n');
    return {
      text: $to.nodeAfter.text.substring(0, nextNewLineIndex >= 0 ? nextNewLineIndex : undefined),
      pos: nextNewLineIndex >= 0 ? $to.pos + nextNewLineIndex : $to.end()
    };
  }

  return {
    text: '',
    pos: $to.pos
  };
};

exports.getEndOfCurrentLine = getEndOfCurrentLine;

function getLinesFromSelection(state) {
  var _getStartOfCurrentLin = getStartOfCurrentLine(state),
      start = _getStartOfCurrentLin.pos;

  var _getEndOfCurrentLine = getEndOfCurrentLine(state),
      end = _getEndOfCurrentLine.pos;

  var text = state.doc.textBetween(start, end);
  return {
    text: text,
    start: start,
    end: end
  };
}

var forEachLine = function forEachLine(text, callback) {
  var offset = 0;
  text.split('\n').forEach(function (line) {
    callback(line, offset);
    offset += line.length + 1;
  });
};

exports.forEachLine = forEachLine;
var SPACE = {
  token: ' ',
  size: 2,
  regex: /[^ ]/
};
var TAB = {
  token: '\t',
  size: 1,
  regex: /[^\t]/
};

var getLineInfo = function getLineInfo(line) {
  var indentToken = line.startsWith('\t') ? TAB : SPACE;
  var indentLength = line.search(indentToken.regex);
  var indentText = line.substring(0, indentLength >= 0 ? indentLength : line.length);
  return {
    indentToken: indentToken,
    indentText: indentText
  };
};

exports.getLineInfo = getLineInfo;
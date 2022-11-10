"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("../../../utils");

var _commands = require("../../../utils/commands");

var _pairedCharacterHandling = require("../ide-ux/paired-character-handling");

var _bracketHandling = require("../ide-ux/bracket-handling");

var _quoteHandling = require("../ide-ux/quote-handling");

var _lineHandling = require("../ide-ux/line-handling");

var _commands2 = require("../ide-ux/commands");

var _composition = require("../../base/pm-plugins/composition");

var _default = new _safePlugin.SafePlugin({
  props: {
    handleTextInput: function handleTextInput(view, from, to, text) {
      var state = view.state,
          dispatch = view.dispatch;

      if ((0, _lineHandling.isCursorInsideCodeBlock)(state) && !(0, _composition.isComposing)(state)) {
        var beforeText = (0, _lineHandling.getStartOfCurrentLine)(state).text;
        var afterText = (0, _lineHandling.getEndOfCurrentLine)(state).text; // If text is a closing bracket/quote and we've already inserted it, move the selection after

        if ((0, _pairedCharacterHandling.isCursorBeforeClosingCharacter)(afterText) && (0, _pairedCharacterHandling.isClosingCharacter)(text) && afterText.startsWith(text)) {
          dispatch((0, _prosemirrorUtils.setTextSelection)(to + text.length)(state.tr));
          return true;
        } // Automatically add right-hand side bracket when user types the left bracket


        if ((0, _bracketHandling.shouldAutoCloseBracket)(beforeText, afterText)) {
          var _getAutoClosingBracke = (0, _bracketHandling.getAutoClosingBracketInfo)(beforeText + text, afterText),
              left = _getAutoClosingBracke.left,
              right = _getAutoClosingBracke.right;

          if (left && right) {
            var bracketPair = state.schema.text(text + right);
            var tr = state.tr.replaceWith(from, to, bracketPair);
            dispatch((0, _prosemirrorUtils.setTextSelection)(from + text.length)(tr));
            return true;
          }
        } // Automatically add closing quote when user types a starting quote


        if ((0, _quoteHandling.shouldAutoCloseQuote)(beforeText, afterText)) {
          var _getAutoClosingQuoteI = (0, _quoteHandling.getAutoClosingQuoteInfo)(beforeText + text, afterText),
              leftQuote = _getAutoClosingQuoteI.left,
              rightQuote = _getAutoClosingQuoteI.right;

          if (leftQuote && rightQuote) {
            var quotePair = state.schema.text(text + rightQuote);

            var _tr = state.tr.replaceWith(from, to, quotePair);

            dispatch((0, _prosemirrorUtils.setTextSelection)(from + text.length)(_tr));
            return true;
          }
        }
      }

      return false;
    },
    handleKeyDown: (0, _prosemirrorKeymap.keydownHandler)({
      Backspace: function Backspace(state, dispatch) {
        if ((0, _lineHandling.isCursorInsideCodeBlock)(state)) {
          var $cursor = (0, _utils.getCursor)(state.selection);
          var beforeText = (0, _lineHandling.getStartOfCurrentLine)(state).text;
          var afterText = (0, _lineHandling.getEndOfCurrentLine)(state).text;

          var _getAutoClosingBracke2 = (0, _bracketHandling.getAutoClosingBracketInfo)(beforeText, afterText),
              leftBracket = _getAutoClosingBracke2.left,
              rightBracket = _getAutoClosingBracke2.right,
              hasTrailingMatchingBracket = _getAutoClosingBracke2.hasTrailingMatchingBracket;

          if (leftBracket && rightBracket && hasTrailingMatchingBracket && dispatch) {
            dispatch(state.tr.delete($cursor.pos - leftBracket.length, $cursor.pos + rightBracket.length));
            return true;
          }

          var _getAutoClosingQuoteI2 = (0, _quoteHandling.getAutoClosingQuoteInfo)(beforeText, afterText),
              leftQuote = _getAutoClosingQuoteI2.left,
              rightQuote = _getAutoClosingQuoteI2.right,
              hasTrailingMatchingQuote = _getAutoClosingQuoteI2.hasTrailingMatchingQuote;

          if (leftQuote && rightQuote && hasTrailingMatchingQuote && dispatch) {
            dispatch(state.tr.delete($cursor.pos - leftQuote.length, $cursor.pos + rightQuote.length));
            return true;
          }

          var _getLineInfo = (0, _lineHandling.getLineInfo)(beforeText),
              _getLineInfo$indentTo = _getLineInfo.indentToken,
              size = _getLineInfo$indentTo.size,
              token = _getLineInfo$indentTo.token,
              indentText = _getLineInfo.indentText;

          if (beforeText === indentText) {
            if (indentText.endsWith(token.repeat(size)) && dispatch) {
              dispatch(state.tr.delete($cursor.pos - (size - indentText.length % size || size), $cursor.pos));
              return true;
            }
          }
        }

        return false;
      },
      Enter: (0, _commands.filter)(_lineHandling.isSelectionEntirelyInsideCodeBlock, _commands2.insertNewlineWithIndent),
      'Mod-]': (0, _commands.filter)(_lineHandling.isSelectionEntirelyInsideCodeBlock, _commands2.indent),
      'Mod-[': (0, _commands.filter)(_lineHandling.isSelectionEntirelyInsideCodeBlock, _commands2.outdent),
      Tab: (0, _commands.filter)(_lineHandling.isSelectionEntirelyInsideCodeBlock, function (state, dispatch) {
        if (!dispatch) {
          return false;
        }

        if ((0, _lineHandling.isCursorInsideCodeBlock)(state)) {
          return (0, _commands2.insertIndent)(state, dispatch);
        }

        return (0, _commands2.indent)(state, dispatch);
      }),
      'Shift-Tab': (0, _commands.filter)(_lineHandling.isSelectionEntirelyInsideCodeBlock, _commands2.outdent),
      'Mod-a': function ModA(state, dispatch) {
        if ((0, _lineHandling.isSelectionEntirelyInsideCodeBlock)(state)) {
          var _state$selection = state.selection,
              $from = _state$selection.$from,
              $to = _state$selection.$to;
          var isFullCodeBlockSelection = $from.parentOffset === 0 && $to.parentOffset === $to.parent.nodeSize - 2;

          if (!isFullCodeBlockSelection && dispatch) {
            dispatch(state.tr.setSelection(_prosemirrorState.TextSelection.create(state.doc, $from.start(), $to.end())));
            return true;
          }
        }

        return false;
      }
    })
  }
});

exports.default = _default;
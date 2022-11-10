import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TextSelection } from 'prosemirror-state';
import { keydownHandler } from 'prosemirror-keymap';
import { setTextSelection } from 'prosemirror-utils';
import { getCursor } from '../../../utils';
import { filter } from '../../../utils/commands';
import { isCursorBeforeClosingCharacter, isClosingCharacter } from '../ide-ux/paired-character-handling';
import { getAutoClosingBracketInfo, shouldAutoCloseBracket } from '../ide-ux/bracket-handling';
import { getAutoClosingQuoteInfo, shouldAutoCloseQuote } from '../ide-ux/quote-handling';
import { getEndOfCurrentLine, getStartOfCurrentLine, isCursorInsideCodeBlock, isSelectionEntirelyInsideCodeBlock, getLineInfo } from '../ide-ux/line-handling';
import { insertIndent, outdent, indent, insertNewlineWithIndent } from '../ide-ux/commands';
import { isComposing } from '../../base/pm-plugins/composition';
export default new SafePlugin({
  props: {
    handleTextInput: function handleTextInput(view, from, to, text) {
      var state = view.state,
          dispatch = view.dispatch;

      if (isCursorInsideCodeBlock(state) && !isComposing(state)) {
        var beforeText = getStartOfCurrentLine(state).text;
        var afterText = getEndOfCurrentLine(state).text; // If text is a closing bracket/quote and we've already inserted it, move the selection after

        if (isCursorBeforeClosingCharacter(afterText) && isClosingCharacter(text) && afterText.startsWith(text)) {
          dispatch(setTextSelection(to + text.length)(state.tr));
          return true;
        } // Automatically add right-hand side bracket when user types the left bracket


        if (shouldAutoCloseBracket(beforeText, afterText)) {
          var _getAutoClosingBracke = getAutoClosingBracketInfo(beforeText + text, afterText),
              left = _getAutoClosingBracke.left,
              right = _getAutoClosingBracke.right;

          if (left && right) {
            var bracketPair = state.schema.text(text + right);
            var tr = state.tr.replaceWith(from, to, bracketPair);
            dispatch(setTextSelection(from + text.length)(tr));
            return true;
          }
        } // Automatically add closing quote when user types a starting quote


        if (shouldAutoCloseQuote(beforeText, afterText)) {
          var _getAutoClosingQuoteI = getAutoClosingQuoteInfo(beforeText + text, afterText),
              leftQuote = _getAutoClosingQuoteI.left,
              rightQuote = _getAutoClosingQuoteI.right;

          if (leftQuote && rightQuote) {
            var quotePair = state.schema.text(text + rightQuote);

            var _tr = state.tr.replaceWith(from, to, quotePair);

            dispatch(setTextSelection(from + text.length)(_tr));
            return true;
          }
        }
      }

      return false;
    },
    handleKeyDown: keydownHandler({
      Backspace: function Backspace(state, dispatch) {
        if (isCursorInsideCodeBlock(state)) {
          var $cursor = getCursor(state.selection);
          var beforeText = getStartOfCurrentLine(state).text;
          var afterText = getEndOfCurrentLine(state).text;

          var _getAutoClosingBracke2 = getAutoClosingBracketInfo(beforeText, afterText),
              leftBracket = _getAutoClosingBracke2.left,
              rightBracket = _getAutoClosingBracke2.right,
              hasTrailingMatchingBracket = _getAutoClosingBracke2.hasTrailingMatchingBracket;

          if (leftBracket && rightBracket && hasTrailingMatchingBracket && dispatch) {
            dispatch(state.tr.delete($cursor.pos - leftBracket.length, $cursor.pos + rightBracket.length));
            return true;
          }

          var _getAutoClosingQuoteI2 = getAutoClosingQuoteInfo(beforeText, afterText),
              leftQuote = _getAutoClosingQuoteI2.left,
              rightQuote = _getAutoClosingQuoteI2.right,
              hasTrailingMatchingQuote = _getAutoClosingQuoteI2.hasTrailingMatchingQuote;

          if (leftQuote && rightQuote && hasTrailingMatchingQuote && dispatch) {
            dispatch(state.tr.delete($cursor.pos - leftQuote.length, $cursor.pos + rightQuote.length));
            return true;
          }

          var _getLineInfo = getLineInfo(beforeText),
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
      Enter: filter(isSelectionEntirelyInsideCodeBlock, insertNewlineWithIndent),
      'Mod-]': filter(isSelectionEntirelyInsideCodeBlock, indent),
      'Mod-[': filter(isSelectionEntirelyInsideCodeBlock, outdent),
      Tab: filter(isSelectionEntirelyInsideCodeBlock, function (state, dispatch) {
        if (!dispatch) {
          return false;
        }

        if (isCursorInsideCodeBlock(state)) {
          return insertIndent(state, dispatch);
        }

        return indent(state, dispatch);
      }),
      'Shift-Tab': filter(isSelectionEntirelyInsideCodeBlock, outdent),
      'Mod-a': function ModA(state, dispatch) {
        if (isSelectionEntirelyInsideCodeBlock(state)) {
          var _state$selection = state.selection,
              $from = _state$selection.$from,
              $to = _state$selection.$to;
          var isFullCodeBlockSelection = $from.parentOffset === 0 && $to.parentOffset === $to.parent.nodeSize - 2;

          if (!isFullCodeBlockSelection && dispatch) {
            dispatch(state.tr.setSelection(TextSelection.create(state.doc, $from.start(), $to.end())));
            return true;
          }
        }

        return false;
      }
    })
  }
});
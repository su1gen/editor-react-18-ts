import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { Selection } from 'prosemirror-state';
import { createPlugin, createRule, ruleWithAnalytics } from '../../../utils/input-rules';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, PUNC, SYMBOL } from '../../analytics';
/**
 * Creates an InputRuleHandler that will match on a regular expression of the
 * form `(prefix, content, suffix?)`, and replace it with some given text,
 * maintaining prefix and suffix around the replacement.
 *
 * @param text text to replace with
 */

function replaceTextUsingCaptureGroup(text) {
  return function (state, match, start, end) {
    var _match = _slicedToArray(match, 4),
        prefix = _match[1],
        suffix = _match[3];

    var replacement = (prefix || '') + text + (suffix || '');
    var tr = state.tr,
        $to = state.selection.$to;
    tr.replaceWith(start, end, state.schema.text(replacement, $to.marks()));
    tr.setSelection(Selection.near(tr.doc.resolve(tr.selection.to)));
    return tr;
  };
}

function createReplacementRule(to, from) {
  return createRule(from, replaceTextUsingCaptureGroup(to));
}
/**
 * Create replacement rules fiven a replacement map
 * @param replMap - Replacement map
 * @param trackingEventName - Analytics V2 tracking event name
 * @param replacementRuleWithAnalytics - Analytics GAS V3 middleware for replacement and rules.
 */


function createReplacementRules(replMap, replacementRuleWithAnalytics) {
  return Object.keys(replMap).map(function (replacement) {
    var regex = replMap[replacement];
    var rule = createReplacementRule(replacement, regex);

    if (replacementRuleWithAnalytics) {
      return replacementRuleWithAnalytics(replacement)(rule);
    }

    return rule;
  });
} // We don't agressively upgrade single quotes to smart quotes because
// they may clash with an emoji. Only do that when we have a matching
// single quote, or a contraction.


function createSingleQuotesRules() {
  return [// wrapped text
  createRule(/(\s|^)'(\S+.*\S+)'$/, function (state, match, start, end) {
    var OPEN_SMART_QUOTE_CHAR = '‘';
    var CLOSED_SMART_QUOTE_CHAR = '’';

    var _match2 = _slicedToArray(match, 3),
        spacing = _match2[1],
        innerContent = _match2[2]; // Edge case where match begins with some spacing. We need to add
    // it back to the document


    var openQuoteReplacement = spacing + OPEN_SMART_QUOTE_CHAR; // End is not always where the closed quote is, edge case exists
    // when there is spacing after the closed quote. We need to
    // determine position of closed quote from the start position.

    var positionOfClosedQuote = start + openQuoteReplacement.length + innerContent.length;
    return state.tr.insertText(CLOSED_SMART_QUOTE_CHAR, positionOfClosedQuote, end).insertText(openQuoteReplacement, start, start + openQuoteReplacement.length);
  }), // apostrophe
  createReplacementRule('’', /(\w+)(')(\w+)$/)];
}
/**
 * Get replacement rules related to product
 */


function getProductRules() {
  var productRuleWithAnalytics = function productRuleWithAnalytics(product) {
    return ruleWithAnalytics(function (_state, match) {
      return {
        action: ACTION.SUBSTITUTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.PRODUCT_NAME,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          product: product,
          originalSpelling: match[2]
        }
      };
    });
  };

  return createReplacementRules({
    Atlassian: /(\s+|^)(atlassian)(\s)$/,
    Jira: /(\s+|^)(jira|JIRA)(\s)$/,
    Bitbucket: /(\s+|^)(bitbucket|BitBucket)(\s)$/,
    Hipchat: /(\s+|^)(hipchat|HipChat)(\s)$/,
    Trello: /(\s+|^)(trello)(\s)$/
  }, productRuleWithAnalytics);
}
/**
 * Get replacement rules related to symbol
 */


function getSymbolRules() {
  var symbolToString = {
    '→': SYMBOL.ARROW_RIGHT,
    '←': SYMBOL.ARROW_LEFT,
    '↔︎': SYMBOL.ARROW_DOUBLE
  };

  var symbolRuleWithAnalytics = function symbolRuleWithAnalytics(symbol) {
    return ruleWithAnalytics(function () {
      return {
        action: ACTION.SUBSTITUTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.SYMBOL,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          symbol: symbolToString[symbol]
        }
      };
    });
  };

  return createReplacementRules({
    '→': /(\s+|^)(--?>)(\s)$/,
    '←': /(\s+|^)(<--?)(\s)$/,
    '↔︎': /(\s+|^)(<->?)(\s)$/
  }, symbolRuleWithAnalytics);
}
/**
 * Get replacement rules related to punctuation
 */


function getPunctuationRules() {
  var punctuationToString = _defineProperty({
    '–': PUNC.DASH,
    '…': PUNC.ELLIPSIS,
    '“': PUNC.QUOTE_DOUBLE,
    '”': PUNC.QUOTE_DOUBLE
  }, PUNC.QUOTE_SINGLE, PUNC.QUOTE_SINGLE);

  var punctuationRuleWithAnalytics = function punctuationRuleWithAnalytics(punctuation) {
    return ruleWithAnalytics(function () {
      return {
        action: ACTION.SUBSTITUTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.PUNC,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          punctuation: punctuationToString[punctuation]
        }
      };
    });
  };

  var dashEllipsisRules = createReplacementRules({
    '–': /(\s+|^)(--)(\s)$/,
    '…': /()(\.\.\.)$/
  }, punctuationRuleWithAnalytics);
  var doubleQuoteRules = createReplacementRules({
    '“': /((?:^|[\s\{\[\(\<'"\u2018\u201C]))(")$/,
    '”': /"$/
  }, punctuationRuleWithAnalytics);
  var singleQuoteRules = createSingleQuotesRules();
  return [].concat(_toConsumableArray(dashEllipsisRules), _toConsumableArray(doubleQuoteRules), _toConsumableArray(singleQuoteRules.map(function (rule) {
    return punctuationRuleWithAnalytics(PUNC.QUOTE_SINGLE)(rule);
  })));
}

export default (function (featureFlags) {
  return createPlugin('text-formatting:smart-input', [].concat(_toConsumableArray(getProductRules()), _toConsumableArray(getSymbolRules()), _toConsumableArray(getPunctuationRules())));
});
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorState = require("prosemirror-state");

var _inputRules = require("../../../utils/input-rules");

var _analytics = require("../../analytics");

/**
 * Creates an InputRuleHandler that will match on a regular expression of the
 * form `(prefix, content, suffix?)`, and replace it with some given text,
 * maintaining prefix and suffix around the replacement.
 *
 * @param text text to replace with
 */
function replaceTextUsingCaptureGroup(text) {
  return function (state, match, start, end) {
    var _match = (0, _slicedToArray2.default)(match, 4),
        prefix = _match[1],
        suffix = _match[3];

    var replacement = (prefix || '') + text + (suffix || '');
    var tr = state.tr,
        $to = state.selection.$to;
    tr.replaceWith(start, end, state.schema.text(replacement, $to.marks()));
    tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(tr.selection.to)));
    return tr;
  };
}

function createReplacementRule(to, from) {
  return (0, _inputRules.createRule)(from, replaceTextUsingCaptureGroup(to));
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
  (0, _inputRules.createRule)(/(\s|^)'(\S+.*\S+)'$/, function (state, match, start, end) {
    var OPEN_SMART_QUOTE_CHAR = '‘';
    var CLOSED_SMART_QUOTE_CHAR = '’';

    var _match2 = (0, _slicedToArray2.default)(match, 3),
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
    return (0, _inputRules.ruleWithAnalytics)(function (_state, match) {
      return {
        action: _analytics.ACTION.SUBSTITUTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.PRODUCT_NAME,
        eventType: _analytics.EVENT_TYPE.TRACK,
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
    '→': _analytics.SYMBOL.ARROW_RIGHT,
    '←': _analytics.SYMBOL.ARROW_LEFT,
    '↔︎': _analytics.SYMBOL.ARROW_DOUBLE
  };

  var symbolRuleWithAnalytics = function symbolRuleWithAnalytics(symbol) {
    return (0, _inputRules.ruleWithAnalytics)(function () {
      return {
        action: _analytics.ACTION.SUBSTITUTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.SYMBOL,
        eventType: _analytics.EVENT_TYPE.TRACK,
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
  var punctuationToString = (0, _defineProperty2.default)({
    '–': _analytics.PUNC.DASH,
    '…': _analytics.PUNC.ELLIPSIS,
    '“': _analytics.PUNC.QUOTE_DOUBLE,
    '”': _analytics.PUNC.QUOTE_DOUBLE
  }, _analytics.PUNC.QUOTE_SINGLE, _analytics.PUNC.QUOTE_SINGLE);

  var punctuationRuleWithAnalytics = function punctuationRuleWithAnalytics(punctuation) {
    return (0, _inputRules.ruleWithAnalytics)(function () {
      return {
        action: _analytics.ACTION.SUBSTITUTED,
        actionSubject: _analytics.ACTION_SUBJECT.TEXT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.PUNC,
        eventType: _analytics.EVENT_TYPE.TRACK,
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
  return [].concat((0, _toConsumableArray2.default)(dashEllipsisRules), (0, _toConsumableArray2.default)(doubleQuoteRules), (0, _toConsumableArray2.default)(singleQuoteRules.map(function (rule) {
    return punctuationRuleWithAnalytics(_analytics.PUNC.QUOTE_SINGLE)(rule);
  })));
}

var _default = function _default(featureFlags) {
  return (0, _inputRules.createPlugin)('text-formatting:smart-input', [].concat((0, _toConsumableArray2.default)(getProductRules()), (0, _toConsumableArray2.default)(getSymbolRules()), (0, _toConsumableArray2.default)(getPunctuationRules())));
};

exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blockQuoteRule = blockQuoteRule;
exports.codeBlockRule = codeBlockRule;
exports.default = void 0;
exports.headingRule = headingRule;
exports.inputRulePlugin = inputRulePlugin;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _inputRules = require("../../../utils/input-rules");

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

var _transformToCodeBlock = require("../commands/transform-to-code-block");

var _insertBlock = require("../commands/insert-block");

var _prosemirrorUtils = require("prosemirror-utils");

var _analytics = require("../../analytics");

var MAX_HEADING_LEVEL = 6;

function getHeadingLevel(match) {
  return {
    level: match[1].length
  };
}

function headingRule(nodeType, maxLevel) {
  return (0, _inputRules.createWrappingTextBlockRule)({
    match: new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType: nodeType,
    getAttrs: getHeadingLevel
  });
}

function blockQuoteRule(nodeType) {
  return (0, _inputRules.createJoinNodesRule)(/^\s*>\s$/, nodeType);
}

function codeBlockRule(nodeType) {
  return (0, _inputRules.createWrappingTextBlockRule)({
    match: /^```$/,
    nodeType: nodeType
  });
}
/**
 * Get heading rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */


function getHeadingRules(schema) {
  // '# ' for h1, '## ' for h2 and etc
  var hashRule = headingRule(schema.nodes.heading, MAX_HEADING_LEVEL);
  var leftNodeReplacementHashRule = (0, _inputRules.createRule)(new RegExp("".concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "(#{1,6})\\s$")), function (state, match, start, end) {
    var level = match[1].length;
    return (0, _insertBlock.insertBlock)(state, schema.nodes.heading, "heading".concat(level), start, end, {
      level: level
    });
  }); // New analytics handler

  var ruleWithHeadingAnalytics = (0, _inputRules.ruleWithAnalytics)(function (_state, matchResult) {
    return {
      action: _analytics.ACTION.FORMATTED,
      actionSubject: _analytics.ACTION_SUBJECT.TEXT,
      eventType: _analytics.EVENT_TYPE.TRACK,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.FORMATTING,
        newHeadingLevel: getHeadingLevel(matchResult).level
      }
    };
  });
  return [ruleWithHeadingAnalytics(hashRule), ruleWithHeadingAnalytics(leftNodeReplacementHashRule)];
}
/**
 * Get all block quote input rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */


function getBlockQuoteRules(schema) {
  // '> ' for blockquote
  var greatherThanRule = blockQuoteRule(schema.nodes.blockquote);
  var leftNodeReplacementGreatherRule = (0, _inputRules.createRule)(new RegExp("".concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "\\s*>\\s$")), function (state, _match, start, end) {
    return (0, _insertBlock.insertBlock)(state, schema.nodes.blockquote, 'blockquote', start, end);
  }); // Analytics V3 handler

  var ruleWithBlockQuoteAnalytics = (0, _inputRules.ruleWithAnalytics)({
    action: _analytics.ACTION.FORMATTED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.FORMATTING
    }
  });
  return [ruleWithBlockQuoteAnalytics(greatherThanRule), ruleWithBlockQuoteAnalytics(leftNodeReplacementGreatherRule)];
}
/**
 * Get all code block input rules
 *
 * @param {Schema} schema
 * @returns {InputRuleWithHandler[]}
 */


function getCodeBlockRules(schema) {
  var ruleAnalytics = (0, _inputRules.ruleWithAnalytics)({
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.CODE_BLOCK,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.FORMATTING
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  });

  var validMatchLength = function validMatchLength(match) {
    return match.length > 0 && match[0].length === 3;
  };

  var threeTildeRule = (0, _inputRules.createRule)(/(?!\s)(`{3,})$/, function (state, match, start, end) {
    if (!validMatchLength(match)) {
      return null;
    }

    var attributes = {};

    if (match[4]) {
      attributes.language = match[4];
    }

    if ((0, _transformToCodeBlock.isConvertableToCodeBlock)(state)) {
      return (0, _transformToCodeBlock.transformToCodeBlockAction)(state, start, attributes);
    }

    var tr = state.tr;
    tr.delete(start, end);
    var codeBlock = tr.doc.type.schema.nodes.codeBlock.createChecked();
    (0, _prosemirrorUtils.safeInsert)(codeBlock)(tr);
    return tr;
  });
  var leftNodeReplacementThreeTildeRule = (0, _inputRules.createRule)(new RegExp("((".concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "`{3,})|^\\s(`{3,}))(\\S*)$")), function (state, match, start, end) {
    if (!validMatchLength(match)) {
      return null;
    }

    var attributes = {};

    if (match[4]) {
      attributes.language = match[4];
    }

    var inlineStart = Math.max(match.index + state.selection.$from.start(), 1);
    return (0, _insertBlock.insertBlock)(state, schema.nodes.codeBlock, 'codeblock', inlineStart, end, attributes);
  });
  return [ruleAnalytics(threeTildeRule), ruleAnalytics(leftNodeReplacementThreeTildeRule)];
}

function inputRulePlugin(schema, featureFlags) {
  var rules = [];

  if (schema.nodes.heading) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getHeadingRules(schema)));
  }

  if (schema.nodes.blockquote) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getBlockQuoteRules(schema)));
  }

  if (schema.nodes.codeBlock) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getCodeBlockRules(schema)));
  }

  if (rules.length !== 0) {
    return (0, _inputRules.createPlugin)('block-type', rules, {
      isBlockNodeRule: true
    });
  }

  return;
}

var _default = inputRulePlugin;
exports.default = _default;
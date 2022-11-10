import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { createRule, createPlugin, createJoinNodesRule, createWrappingTextBlockRule, ruleWithAnalytics } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { isConvertableToCodeBlock, transformToCodeBlockAction } from '../commands/transform-to-code-block';
import { insertBlock } from '../commands/insert-block';
import { safeInsert } from 'prosemirror-utils';
import { INPUT_METHOD, ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID } from '../../analytics';
var MAX_HEADING_LEVEL = 6;

function getHeadingLevel(match) {
  return {
    level: match[1].length
  };
}

export function headingRule(nodeType, maxLevel) {
  return createWrappingTextBlockRule({
    match: new RegExp('^(#{1,' + maxLevel + '})\\s$'),
    nodeType: nodeType,
    getAttrs: getHeadingLevel
  });
}
export function blockQuoteRule(nodeType) {
  return createJoinNodesRule(/^\s*>\s$/, nodeType);
}
export function codeBlockRule(nodeType) {
  return createWrappingTextBlockRule({
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
  var leftNodeReplacementHashRule = createRule(new RegExp("".concat(leafNodeReplacementCharacter, "(#{1,6})\\s$")), function (state, match, start, end) {
    var level = match[1].length;
    return insertBlock(state, schema.nodes.heading, "heading".concat(level), start, end, {
      level: level
    });
  }); // New analytics handler

  var ruleWithHeadingAnalytics = ruleWithAnalytics(function (_state, matchResult) {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      eventType: EVENT_TYPE.TRACK,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING,
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
  var leftNodeReplacementGreatherRule = createRule(new RegExp("".concat(leafNodeReplacementCharacter, "\\s*>\\s$")), function (state, _match, start, end) {
    return insertBlock(state, schema.nodes.blockquote, 'blockquote', start, end);
  }); // Analytics V3 handler

  var ruleWithBlockQuoteAnalytics = ruleWithAnalytics({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
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
  var ruleAnalytics = ruleWithAnalytics({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
    },
    eventType: EVENT_TYPE.TRACK
  });

  var validMatchLength = function validMatchLength(match) {
    return match.length > 0 && match[0].length === 3;
  };

  var threeTildeRule = createRule(/(?!\s)(`{3,})$/, function (state, match, start, end) {
    if (!validMatchLength(match)) {
      return null;
    }

    var attributes = {};

    if (match[4]) {
      attributes.language = match[4];
    }

    if (isConvertableToCodeBlock(state)) {
      return transformToCodeBlockAction(state, start, attributes);
    }

    var tr = state.tr;
    tr.delete(start, end);
    var codeBlock = tr.doc.type.schema.nodes.codeBlock.createChecked();
    safeInsert(codeBlock)(tr);
    return tr;
  });
  var leftNodeReplacementThreeTildeRule = createRule(new RegExp("((".concat(leafNodeReplacementCharacter, "`{3,})|^\\s(`{3,}))(\\S*)$")), function (state, match, start, end) {
    if (!validMatchLength(match)) {
      return null;
    }

    var attributes = {};

    if (match[4]) {
      attributes.language = match[4];
    }

    var inlineStart = Math.max(match.index + state.selection.$from.start(), 1);
    return insertBlock(state, schema.nodes.codeBlock, 'codeblock', inlineStart, end, attributes);
  });
  return [ruleAnalytics(threeTildeRule), ruleAnalytics(leftNodeReplacementThreeTildeRule)];
}

export function inputRulePlugin(schema, featureFlags) {
  var rules = [];

  if (schema.nodes.heading) {
    rules.push.apply(rules, _toConsumableArray(getHeadingRules(schema)));
  }

  if (schema.nodes.blockquote) {
    rules.push.apply(rules, _toConsumableArray(getBlockQuoteRules(schema)));
  }

  if (schema.nodes.codeBlock) {
    rules.push.apply(rules, _toConsumableArray(getCodeBlockRules(schema)));
  }

  if (rules.length !== 0) {
    return createPlugin('block-type', rules, {
      isBlockNodeRule: true
    });
  }

  return;
}
export default inputRulePlugin;
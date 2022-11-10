import { createPlugin, createRule, ruleWithAnalytics } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../../analytics';
import { transformSmartCharsMentionsAndEmojis } from '../commands/transform-to-code';
var ValidAutoformatChars;

(function (ValidAutoformatChars) {
  ValidAutoformatChars["STRONG"] = "__";
  ValidAutoformatChars["STRIKE"] = "~~";
  ValidAutoformatChars["STRONG_MARKDOWN"] = "**";
  ValidAutoformatChars["ITALIC_MARKDOWN"] = "*";
  ValidAutoformatChars["ITALIC"] = "_";
  ValidAutoformatChars["CODE"] = "`";
})(ValidAutoformatChars || (ValidAutoformatChars = {}));

export const ValidCombinations = {
  [ValidAutoformatChars.STRIKE]: [// e.g: _~~lol~~_
  ValidAutoformatChars.ITALIC, // e.g: __~~lol~~__
  ValidAutoformatChars.STRONG, // e.g: **~~lol~~**
  ValidAutoformatChars.STRONG_MARKDOWN, // e.g: *~~lol~~*
  ValidAutoformatChars.ITALIC_MARKDOWN],
  [ValidAutoformatChars.STRONG]: [// e.g: ~~__lol__~~
  ValidAutoformatChars.STRIKE, // e.g: *__lol__*
  ValidAutoformatChars.ITALIC_MARKDOWN],
  [ValidAutoformatChars.STRONG_MARKDOWN]: [// e.g: _**lol**_
  ValidAutoformatChars.ITALIC, // e.g: ~~**lol**~~
  ValidAutoformatChars.STRIKE],
  [ValidAutoformatChars.ITALIC_MARKDOWN]: [// e.g: ~~*lol*~~
  ValidAutoformatChars.STRIKE, // e.g: __*lol*__
  ValidAutoformatChars.STRONG],
  [ValidAutoformatChars.ITALIC]: [// e.g: ~~_lol_~~
  ValidAutoformatChars.STRIKE, // e.g: **_lol_**
  ValidAutoformatChars.STRONG_MARKDOWN],
  [ValidAutoformatChars.CODE]: [// e.g: loko (`some code`
  '( ']
};

function addMark(markType, schema, char) {
  return (state, match, start, end) => {
    var _schema$marks, _schema$marks$code;

    const {
      doc,
      schema,
      tr
    } = state;
    const textPrefix = state.doc.textBetween(start, start + char.length); // fixes the following case: my `*name` is *
    // expected result: should ignore special characters inside "code"

    if (textPrefix !== char || schema !== null && schema !== void 0 && (_schema$marks = schema.marks) !== null && _schema$marks !== void 0 && (_schema$marks$code = _schema$marks.code) !== null && _schema$marks$code !== void 0 && _schema$marks$code.isInSet(doc.resolve(start + 1).marks())) {
      return null;
    } // Prevent autoformatting across hardbreaks


    let containsHardBreak;
    doc.nodesBetween(start, end, node => {
      if (node.type === schema.nodes.hardBreak) {
        containsHardBreak = true;
        return null;
      }

      return !containsHardBreak;
    });

    if (containsHardBreak) {
      return null;
    } // fixes autoformatting in heading nodes: # Heading *bold*
    // expected result: should not autoformat *bold*; <h1>Heading *bold*</h1>


    const startPosResolved = doc.resolve(start);
    const endPosResolved = doc.resolve(end);

    if (startPosResolved.sameParent(endPosResolved) && !startPosResolved.parent.type.allowsMarkType(markType)) {
      return null;
    }

    if (markType.name === 'code') {
      transformSmartCharsMentionsAndEmojis(tr.mapping.map(start), tr.mapping.map(end), tr);
    }

    const mappedStart = tr.mapping.map(start);
    const mappedEnd = tr.mapping.map(end);
    tr.addMark(mappedStart, mappedEnd, markType.create());
    const textSuffix = tr.doc.textBetween(mappedEnd - char.length, mappedEnd);

    if (textSuffix === char) {
      tr.delete(mappedEnd - char.length, mappedEnd);
    }

    if (textPrefix === char) {
      tr.delete(mappedStart, mappedStart + char.length);
    }

    return tr.removeStoredMark(markType);
  };
}

class ReverseRegexExp extends RegExp {
  exec(str) {
    if (!str) {
      return null;
    }

    const reverseStr = [...str].reverse().join('');
    const result = super.exec(reverseStr);

    if (!result) {
      return null;
    }

    for (let i = 0; i < result.length; i++) {
      if (result[i] && typeof result[i] === 'string') {
        result[i] = [...result[i]].reverse().join('');
      }
    }

    if (result.input && typeof result.input === 'string') {
      result.input = [...result.input].reverse().join('');
    }

    if (result.input && result[0]) {
      result.index = result.input.length - result[0].length;
    }

    return result;
  }

}

const buildRegex = char => {
  const escapedChar = char.replace(/(\W)/g, '\\$1');
  const combinations = ValidCombinations[char].map(c => c.replace(/(\W)/g, '\\$1')).join('|'); // Single X - https://regex101.com/r/McT3yq/14/
  // Double X - https://regex101.com/r/pQUgjx/1/

  const baseRegex = '^X(?=[^X\\s]).*?[^\\sX]X(?=[\\sOBJECT_REPLACEMENT_CHARACTER]COMBINATIONS|$)'.replace('OBJECT_REPLACEMENT_CHARACTER', leafNodeReplacementCharacter).replace('COMBINATIONS', combinations ? `|${combinations}` : '');
  const replacedRegex = String.prototype.hasOwnProperty('replaceAll') ? baseRegex.replaceAll('X', escapedChar) : baseRegex.replace(/X/g, escapedChar);
  return new ReverseRegexExp(replacedRegex);
};

export const strongRegex1 = buildRegex(ValidAutoformatChars.STRONG);
export const strongRegex2 = buildRegex(ValidAutoformatChars.STRONG_MARKDOWN);
export const italicRegex1 = buildRegex(ValidAutoformatChars.ITALIC);
export const italicRegex2 = buildRegex(ValidAutoformatChars.ITALIC_MARKDOWN);
export const strikeRegex = buildRegex(ValidAutoformatChars.STRIKE);
export const codeRegex = buildRegex(ValidAutoformatChars.CODE);
/**
 * Create input rules for strong mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */

function getStrongInputRules(schema) {
  const ruleWithStrongAnalytics = ruleWithAnalytics(() => ({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
    }
  })); // **string** or __strong__ should bold the text

  const doubleUnderscoreRule = createRule(strongRegex1, addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG));
  const doubleAsterixRule = createRule(strongRegex2, addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG_MARKDOWN));
  return [ruleWithStrongAnalytics(doubleUnderscoreRule), ruleWithStrongAnalytics(doubleAsterixRule)];
}
/**
 * Create input rules for em mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getItalicInputRules(schema) {
  const ruleWithItalicAnalytics = ruleWithAnalytics(() => ({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
    }
  }));
  const underscoreRule = createRule(italicRegex1, addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC));
  const asterixRule = createRule(italicRegex2, addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC_MARKDOWN));
  return [ruleWithItalicAnalytics(underscoreRule), ruleWithItalicAnalytics(asterixRule)];
}
/**
 * Create input rules for strike mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getStrikeInputRules(schema) {
  const ruleWithStrikeAnalytics = ruleWithAnalytics(() => ({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
    }
  }));
  const doubleTildeRule = createRule(strikeRegex, addMark(schema.marks.strike, schema, ValidAutoformatChars.STRIKE));
  return [ruleWithStrikeAnalytics(doubleTildeRule)];
}
/**
 * Create input rules for code mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getCodeInputRules(schema) {
  const ruleWithCodeAnalytics = ruleWithAnalytics(() => ({
    action: ACTION.FORMATTED,
    actionSubject: ACTION_SUBJECT.TEXT,
    actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
    }
  }));
  const backTickRule = createRule(codeRegex, addMark(schema.marks.code, schema, ValidAutoformatChars.CODE));
  return [ruleWithCodeAnalytics(backTickRule)];
}

export function inputRulePlugin(schema, featureFlags) {
  const rules = [];

  if (schema.marks.strong) {
    rules.push(...getStrongInputRules(schema));
  }

  if (schema.marks.em) {
    rules.push(...getItalicInputRules(schema));
  }

  if (schema.marks.strike) {
    rules.push(...getStrikeInputRules(schema));
  }

  if (schema.marks.code) {
    rules.push(...getCodeInputRules(schema));
  }

  if (rules.length !== 0) {
    return createPlugin('text-formatting', rules);
  }

  return;
}
export default inputRulePlugin;
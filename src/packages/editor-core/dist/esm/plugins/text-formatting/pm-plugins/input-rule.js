import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _wrapNativeSuper from "@babel/runtime/helpers/wrapNativeSuper";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

var _ValidCombinations;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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

export var ValidCombinations = (_ValidCombinations = {}, _defineProperty(_ValidCombinations, ValidAutoformatChars.STRIKE, [// e.g: _~~lol~~_
ValidAutoformatChars.ITALIC, // e.g: __~~lol~~__
ValidAutoformatChars.STRONG, // e.g: **~~lol~~**
ValidAutoformatChars.STRONG_MARKDOWN, // e.g: *~~lol~~*
ValidAutoformatChars.ITALIC_MARKDOWN]), _defineProperty(_ValidCombinations, ValidAutoformatChars.STRONG, [// e.g: ~~__lol__~~
ValidAutoformatChars.STRIKE, // e.g: *__lol__*
ValidAutoformatChars.ITALIC_MARKDOWN]), _defineProperty(_ValidCombinations, ValidAutoformatChars.STRONG_MARKDOWN, [// e.g: _**lol**_
ValidAutoformatChars.ITALIC, // e.g: ~~**lol**~~
ValidAutoformatChars.STRIKE]), _defineProperty(_ValidCombinations, ValidAutoformatChars.ITALIC_MARKDOWN, [// e.g: ~~*lol*~~
ValidAutoformatChars.STRIKE, // e.g: __*lol*__
ValidAutoformatChars.STRONG]), _defineProperty(_ValidCombinations, ValidAutoformatChars.ITALIC, [// e.g: ~~_lol_~~
ValidAutoformatChars.STRIKE, // e.g: **_lol_**
ValidAutoformatChars.STRONG_MARKDOWN]), _defineProperty(_ValidCombinations, ValidAutoformatChars.CODE, [// e.g: loko (`some code`
'( ']), _ValidCombinations);

function addMark(markType, schema, char) {
  return function (state, match, start, end) {
    var _schema$marks, _schema$marks$code;

    var doc = state.doc,
        schema = state.schema,
        tr = state.tr;
    var textPrefix = state.doc.textBetween(start, start + char.length); // fixes the following case: my `*name` is *
    // expected result: should ignore special characters inside "code"

    if (textPrefix !== char || schema !== null && schema !== void 0 && (_schema$marks = schema.marks) !== null && _schema$marks !== void 0 && (_schema$marks$code = _schema$marks.code) !== null && _schema$marks$code !== void 0 && _schema$marks$code.isInSet(doc.resolve(start + 1).marks())) {
      return null;
    } // Prevent autoformatting across hardbreaks


    var containsHardBreak;
    doc.nodesBetween(start, end, function (node) {
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


    var startPosResolved = doc.resolve(start);
    var endPosResolved = doc.resolve(end);

    if (startPosResolved.sameParent(endPosResolved) && !startPosResolved.parent.type.allowsMarkType(markType)) {
      return null;
    }

    if (markType.name === 'code') {
      transformSmartCharsMentionsAndEmojis(tr.mapping.map(start), tr.mapping.map(end), tr);
    }

    var mappedStart = tr.mapping.map(start);
    var mappedEnd = tr.mapping.map(end);
    tr.addMark(mappedStart, mappedEnd, markType.create());
    var textSuffix = tr.doc.textBetween(mappedEnd - char.length, mappedEnd);

    if (textSuffix === char) {
      tr.delete(mappedEnd - char.length, mappedEnd);
    }

    if (textPrefix === char) {
      tr.delete(mappedStart, mappedStart + char.length);
    }

    return tr.removeStoredMark(markType);
  };
}

var ReverseRegexExp = /*#__PURE__*/function (_RegExp) {
  _inherits(ReverseRegexExp, _RegExp);

  var _super = _createSuper(ReverseRegexExp);

  function ReverseRegexExp() {
    _classCallCheck(this, ReverseRegexExp);

    return _super.apply(this, arguments);
  }

  _createClass(ReverseRegexExp, [{
    key: "exec",
    value: function exec(str) {
      if (!str) {
        return null;
      }

      var reverseStr = _toConsumableArray(str).reverse().join('');

      var result = _get(_getPrototypeOf(ReverseRegexExp.prototype), "exec", this).call(this, reverseStr);

      if (!result) {
        return null;
      }

      for (var i = 0; i < result.length; i++) {
        if (result[i] && typeof result[i] === 'string') {
          result[i] = _toConsumableArray(result[i]).reverse().join('');
        }
      }

      if (result.input && typeof result.input === 'string') {
        result.input = _toConsumableArray(result.input).reverse().join('');
      }

      if (result.input && result[0]) {
        result.index = result.input.length - result[0].length;
      }

      return result;
    }
  }]);

  return ReverseRegexExp;
}( /*#__PURE__*/_wrapNativeSuper(RegExp));

var buildRegex = function buildRegex(char) {
  var escapedChar = char.replace(/(\W)/g, '\\$1');
  var combinations = ValidCombinations[char].map(function (c) {
    return c.replace(/(\W)/g, '\\$1');
  }).join('|'); // Single X - https://regex101.com/r/McT3yq/14/
  // Double X - https://regex101.com/r/pQUgjx/1/

  var baseRegex = '^X(?=[^X\\s]).*?[^\\sX]X(?=[\\sOBJECT_REPLACEMENT_CHARACTER]COMBINATIONS|$)'.replace('OBJECT_REPLACEMENT_CHARACTER', leafNodeReplacementCharacter).replace('COMBINATIONS', combinations ? "|".concat(combinations) : '');
  var replacedRegex = String.prototype.hasOwnProperty('replaceAll') ? baseRegex.replaceAll('X', escapedChar) : baseRegex.replace(/X/g, escapedChar);
  return new ReverseRegexExp(replacedRegex);
};

export var strongRegex1 = buildRegex(ValidAutoformatChars.STRONG);
export var strongRegex2 = buildRegex(ValidAutoformatChars.STRONG_MARKDOWN);
export var italicRegex1 = buildRegex(ValidAutoformatChars.ITALIC);
export var italicRegex2 = buildRegex(ValidAutoformatChars.ITALIC_MARKDOWN);
export var strikeRegex = buildRegex(ValidAutoformatChars.STRIKE);
export var codeRegex = buildRegex(ValidAutoformatChars.CODE);
/**
 * Create input rules for strong mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */

function getStrongInputRules(schema) {
  var ruleWithStrongAnalytics = ruleWithAnalytics(function () {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRONG,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING
      }
    };
  }); // **string** or __strong__ should bold the text

  var doubleUnderscoreRule = createRule(strongRegex1, addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG));
  var doubleAsterixRule = createRule(strongRegex2, addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG_MARKDOWN));
  return [ruleWithStrongAnalytics(doubleUnderscoreRule), ruleWithStrongAnalytics(doubleAsterixRule)];
}
/**
 * Create input rules for em mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getItalicInputRules(schema) {
  var ruleWithItalicAnalytics = ruleWithAnalytics(function () {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_ITALIC,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING
      }
    };
  });
  var underscoreRule = createRule(italicRegex1, addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC));
  var asterixRule = createRule(italicRegex2, addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC_MARKDOWN));
  return [ruleWithItalicAnalytics(underscoreRule), ruleWithItalicAnalytics(asterixRule)];
}
/**
 * Create input rules for strike mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getStrikeInputRules(schema) {
  var ruleWithStrikeAnalytics = ruleWithAnalytics(function () {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_STRIKE,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING
      }
    };
  });
  var doubleTildeRule = createRule(strikeRegex, addMark(schema.marks.strike, schema, ValidAutoformatChars.STRIKE));
  return [ruleWithStrikeAnalytics(doubleTildeRule)];
}
/**
 * Create input rules for code mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getCodeInputRules(schema) {
  var ruleWithCodeAnalytics = ruleWithAnalytics(function () {
    return {
      action: ACTION.FORMATTED,
      actionSubject: ACTION_SUBJECT.TEXT,
      actionSubjectId: ACTION_SUBJECT_ID.FORMAT_CODE,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: INPUT_METHOD.FORMATTING
      }
    };
  });
  var backTickRule = createRule(codeRegex, addMark(schema.marks.code, schema, ValidAutoformatChars.CODE));
  return [ruleWithCodeAnalytics(backTickRule)];
}

export function inputRulePlugin(schema, featureFlags) {
  var rules = [];

  if (schema.marks.strong) {
    rules.push.apply(rules, _toConsumableArray(getStrongInputRules(schema)));
  }

  if (schema.marks.em) {
    rules.push.apply(rules, _toConsumableArray(getItalicInputRules(schema)));
  }

  if (schema.marks.strike) {
    rules.push.apply(rules, _toConsumableArray(getStrikeInputRules(schema)));
  }

  if (schema.marks.code) {
    rules.push.apply(rules, _toConsumableArray(getCodeInputRules(schema)));
  }

  if (rules.length !== 0) {
    return createPlugin('text-formatting', rules);
  }

  return;
}
export default inputRulePlugin;
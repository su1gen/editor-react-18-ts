"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.codeRegex = exports.ValidCombinations = void 0;
exports.inputRulePlugin = inputRulePlugin;
exports.strongRegex2 = exports.strongRegex1 = exports.strikeRegex = exports.italicRegex2 = exports.italicRegex1 = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _wrapNativeSuper2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapNativeSuper"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _inputRules = require("../../../utils/input-rules");

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

var _analytics = require("../../analytics");

var _transformToCode = require("../commands/transform-to-code");

var _ValidCombinations;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ValidAutoformatChars;

(function (ValidAutoformatChars) {
  ValidAutoformatChars["STRONG"] = "__";
  ValidAutoformatChars["STRIKE"] = "~~";
  ValidAutoformatChars["STRONG_MARKDOWN"] = "**";
  ValidAutoformatChars["ITALIC_MARKDOWN"] = "*";
  ValidAutoformatChars["ITALIC"] = "_";
  ValidAutoformatChars["CODE"] = "`";
})(ValidAutoformatChars || (ValidAutoformatChars = {}));

var ValidCombinations = (_ValidCombinations = {}, (0, _defineProperty2.default)(_ValidCombinations, ValidAutoformatChars.STRIKE, [// e.g: _~~lol~~_
ValidAutoformatChars.ITALIC, // e.g: __~~lol~~__
ValidAutoformatChars.STRONG, // e.g: **~~lol~~**
ValidAutoformatChars.STRONG_MARKDOWN, // e.g: *~~lol~~*
ValidAutoformatChars.ITALIC_MARKDOWN]), (0, _defineProperty2.default)(_ValidCombinations, ValidAutoformatChars.STRONG, [// e.g: ~~__lol__~~
ValidAutoformatChars.STRIKE, // e.g: *__lol__*
ValidAutoformatChars.ITALIC_MARKDOWN]), (0, _defineProperty2.default)(_ValidCombinations, ValidAutoformatChars.STRONG_MARKDOWN, [// e.g: _**lol**_
ValidAutoformatChars.ITALIC, // e.g: ~~**lol**~~
ValidAutoformatChars.STRIKE]), (0, _defineProperty2.default)(_ValidCombinations, ValidAutoformatChars.ITALIC_MARKDOWN, [// e.g: ~~*lol*~~
ValidAutoformatChars.STRIKE, // e.g: __*lol*__
ValidAutoformatChars.STRONG]), (0, _defineProperty2.default)(_ValidCombinations, ValidAutoformatChars.ITALIC, [// e.g: ~~_lol_~~
ValidAutoformatChars.STRIKE, // e.g: **_lol_**
ValidAutoformatChars.STRONG_MARKDOWN]), (0, _defineProperty2.default)(_ValidCombinations, ValidAutoformatChars.CODE, [// e.g: loko (`some code`
'( ']), _ValidCombinations);
exports.ValidCombinations = ValidCombinations;

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
      (0, _transformToCode.transformSmartCharsMentionsAndEmojis)(tr.mapping.map(start), tr.mapping.map(end), tr);
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
  (0, _inherits2.default)(ReverseRegexExp, _RegExp);

  var _super = _createSuper(ReverseRegexExp);

  function ReverseRegexExp() {
    (0, _classCallCheck2.default)(this, ReverseRegexExp);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ReverseRegexExp, [{
    key: "exec",
    value: function exec(str) {
      if (!str) {
        return null;
      }

      var reverseStr = (0, _toConsumableArray2.default)(str).reverse().join('');
      var result = (0, _get2.default)((0, _getPrototypeOf2.default)(ReverseRegexExp.prototype), "exec", this).call(this, reverseStr);

      if (!result) {
        return null;
      }

      for (var i = 0; i < result.length; i++) {
        if (result[i] && typeof result[i] === 'string') {
          result[i] = (0, _toConsumableArray2.default)(result[i]).reverse().join('');
        }
      }

      if (result.input && typeof result.input === 'string') {
        result.input = (0, _toConsumableArray2.default)(result.input).reverse().join('');
      }

      if (result.input && result[0]) {
        result.index = result.input.length - result[0].length;
      }

      return result;
    }
  }]);
  return ReverseRegexExp;
}( /*#__PURE__*/(0, _wrapNativeSuper2.default)(RegExp));

var buildRegex = function buildRegex(char) {
  var escapedChar = char.replace(/(\W)/g, '\\$1');
  var combinations = ValidCombinations[char].map(function (c) {
    return c.replace(/(\W)/g, '\\$1');
  }).join('|'); // Single X - https://regex101.com/r/McT3yq/14/
  // Double X - https://regex101.com/r/pQUgjx/1/

  var baseRegex = '^X(?=[^X\\s]).*?[^\\sX]X(?=[\\sOBJECT_REPLACEMENT_CHARACTER]COMBINATIONS|$)'.replace('OBJECT_REPLACEMENT_CHARACTER', _prosemirrorInputRules.leafNodeReplacementCharacter).replace('COMBINATIONS', combinations ? "|".concat(combinations) : '');
  var replacedRegex = String.prototype.hasOwnProperty('replaceAll') ? baseRegex.replaceAll('X', escapedChar) : baseRegex.replace(/X/g, escapedChar);
  return new ReverseRegexExp(replacedRegex);
};

var strongRegex1 = buildRegex(ValidAutoformatChars.STRONG);
exports.strongRegex1 = strongRegex1;
var strongRegex2 = buildRegex(ValidAutoformatChars.STRONG_MARKDOWN);
exports.strongRegex2 = strongRegex2;
var italicRegex1 = buildRegex(ValidAutoformatChars.ITALIC);
exports.italicRegex1 = italicRegex1;
var italicRegex2 = buildRegex(ValidAutoformatChars.ITALIC_MARKDOWN);
exports.italicRegex2 = italicRegex2;
var strikeRegex = buildRegex(ValidAutoformatChars.STRIKE);
exports.strikeRegex = strikeRegex;
var codeRegex = buildRegex(ValidAutoformatChars.CODE);
/**
 * Create input rules for strong mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */

exports.codeRegex = codeRegex;

function getStrongInputRules(schema) {
  var ruleWithStrongAnalytics = (0, _inputRules.ruleWithAnalytics)(function () {
    return {
      action: _analytics.ACTION.FORMATTED,
      actionSubject: _analytics.ACTION_SUBJECT.TEXT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_STRONG,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.FORMATTING
      }
    };
  }); // **string** or __strong__ should bold the text

  var doubleUnderscoreRule = (0, _inputRules.createRule)(strongRegex1, addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG));
  var doubleAsterixRule = (0, _inputRules.createRule)(strongRegex2, addMark(schema.marks.strong, schema, ValidAutoformatChars.STRONG_MARKDOWN));
  return [ruleWithStrongAnalytics(doubleUnderscoreRule), ruleWithStrongAnalytics(doubleAsterixRule)];
}
/**
 * Create input rules for em mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getItalicInputRules(schema) {
  var ruleWithItalicAnalytics = (0, _inputRules.ruleWithAnalytics)(function () {
    return {
      action: _analytics.ACTION.FORMATTED,
      actionSubject: _analytics.ACTION_SUBJECT.TEXT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_ITALIC,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.FORMATTING
      }
    };
  });
  var underscoreRule = (0, _inputRules.createRule)(italicRegex1, addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC));
  var asterixRule = (0, _inputRules.createRule)(italicRegex2, addMark(schema.marks.em, schema, ValidAutoformatChars.ITALIC_MARKDOWN));
  return [ruleWithItalicAnalytics(underscoreRule), ruleWithItalicAnalytics(asterixRule)];
}
/**
 * Create input rules for strike mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getStrikeInputRules(schema) {
  var ruleWithStrikeAnalytics = (0, _inputRules.ruleWithAnalytics)(function () {
    return {
      action: _analytics.ACTION.FORMATTED,
      actionSubject: _analytics.ACTION_SUBJECT.TEXT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_STRIKE,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.FORMATTING
      }
    };
  });
  var doubleTildeRule = (0, _inputRules.createRule)(strikeRegex, addMark(schema.marks.strike, schema, ValidAutoformatChars.STRIKE));
  return [ruleWithStrikeAnalytics(doubleTildeRule)];
}
/**
 * Create input rules for code mark
 *
 * @param {Schema} schema
 * @returns {InputRuleWrapper[]}
 */


function getCodeInputRules(schema) {
  var ruleWithCodeAnalytics = (0, _inputRules.ruleWithAnalytics)(function () {
    return {
      action: _analytics.ACTION.FORMATTED,
      actionSubject: _analytics.ACTION_SUBJECT.TEXT,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.FORMAT_CODE,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.FORMATTING
      }
    };
  });
  var backTickRule = (0, _inputRules.createRule)(codeRegex, addMark(schema.marks.code, schema, ValidAutoformatChars.CODE));
  return [ruleWithCodeAnalytics(backTickRule)];
}

function inputRulePlugin(schema, featureFlags) {
  var rules = [];

  if (schema.marks.strong) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getStrongInputRules(schema)));
  }

  if (schema.marks.em) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getItalicInputRules(schema)));
  }

  if (schema.marks.strike) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getStrikeInputRules(schema)));
  }

  if (schema.marks.code) {
    rules.push.apply(rules, (0, _toConsumableArray2.default)(getCodeInputRules(schema)));
  }

  if (rules.length !== 0) {
    return (0, _inputRules.createPlugin)('text-formatting', rules);
  }

  return;
}

var _default = inputRulePlugin;
exports.default = _default;
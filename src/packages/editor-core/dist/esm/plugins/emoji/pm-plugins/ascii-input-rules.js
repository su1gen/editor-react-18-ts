import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { PluginKey } from 'prosemirror-state';
import { createRule, createPlugin } from '../../../utils/input-rules';
import { leafNodeReplacementCharacter } from '@atlaskit/prosemirror-input-rules';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD, EVENT_TYPE } from '../../analytics';
var matcher;
export function inputRulePlugin(schema, providerFactory, featureFlags) {
  if (schema.nodes.emoji && providerFactory) {
    initMatcher(providerFactory);
    var asciiEmojiRule = createRule(AsciiEmojiMatcher.REGEX, inputRuleHandler);
    return createPlugin('emoji', [asciiEmojiRule]);
  }

  return;
}

function initMatcher(providerFactory) {
  var handleProvider = function handleProvider(_name, provider) {
    if (!provider) {
      return;
    }

    provider.then(function (emojiProvider) {
      emojiProvider.getAsciiMap().then(function (map) {
        matcher = new RecordingAsciiEmojiMatcher(emojiProvider, map);
      });
    });
  };

  providerFactory.subscribe('emojiProvider', handleProvider);
}

function inputRuleHandler(state, matchParts, start, end) {
  if (!matcher) {
    return null;
  }

  var match = matcher.match(matchParts);

  if (match) {
    var transactionCreator = new AsciiEmojiTransactionCreator(state, match, start, end);
    return transactionCreator.create();
  }

  return null;
}

var REGEX_LEADING_CAPTURE_INDEX = 1;
var REGEX_EMOJI_LEADING_PARENTHESES = 2;
var REGEX_EMOJI_ASCII_CAPTURE_INDEX = 3;
var REGEX_TRAILING_CAPTURE_INDEX = 4;

var getLeadingString = function getLeadingString(match) {
  var withParenthesis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return match[REGEX_LEADING_CAPTURE_INDEX] + (withParenthesis ? match[REGEX_EMOJI_LEADING_PARENTHESES] : '');
};

var getLeadingStringWithoutParentheses = function getLeadingStringWithoutParentheses(match) {
  return getLeadingString(match, false);
};

var getAscii = function getAscii(match) {
  var withParentheses = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  return (withParentheses ? match[REGEX_EMOJI_LEADING_PARENTHESES] : '') + match[REGEX_EMOJI_ASCII_CAPTURE_INDEX].trim();
};

var getAsciiWithParentheses = function getAsciiWithParentheses(matchParts) {
  return getAscii(matchParts, true);
};

var getTrailingString = function getTrailingString(match) {
  return match[REGEX_TRAILING_CAPTURE_INDEX] || '';
};

var AsciiEmojiMatcher = /*#__PURE__*/function () {
  /**
   * This regex matches 2 scenarios:
   * 1. an emoticon starting with a colon character (e.g. :D => 😃)
   * 2. an emoticon not starting with a colon character (e.g. 8-D => 😎)
   *
   * Explanation (${leafNodeReplacementCharacter} is replaced with character \ufffc)
   *
   *  1st Capturing Group ((?:^|[\s\ufffc])(?:\(*?))
   *    Non-capturing group (?:^|[\s\ufffc])
   *      1st Alternative ^
   *        ^ asserts position at start of the string
   *      2nd Alternative [\s\ufffc]
   *        matches a single character present in [\s\ufffc]
   *    Non-capturing group (?:\(*?)
   *      matches the character ( literally between zero and unlimited times, as few times as possible, expanding as needed (lazy)
   *  2nd Capturing Group (\(?)
   *    matches a single ( if present
   *  3rd Capturing Group ([^:\s\ufffc\(]\S{1,3}|:\S{1,3}( ))
   *    1st Alternative [^:\s\ufffc\(]\S{1,3}
   *      matches a single character not present in [^:\s\ufffc\(] between 1 and 3 times, as many times as possible, giving back as needed (greedy)
   *    2nd Alternative :\S{1,3}( )
   *      : matches the character : literally
   *      \S{1,3} matches any non-whitespace character between 1 and 3 times, as many times as possible, giving back as needed (greedy)
   *  4th Capturing Group ( )
   *
   * See https://regex101.com/r/HRS9O2/4
   */
  function AsciiEmojiMatcher(asciiToEmojiMap) {
    _classCallCheck(this, AsciiEmojiMatcher);

    this.asciiToEmojiMap = asciiToEmojiMap;
  }

  _createClass(AsciiEmojiMatcher, [{
    key: "match",
    value: function match(matchParts) {
      return this.getAsciiEmojiMatch(getLeadingStringWithoutParentheses(matchParts), getAsciiWithParentheses(matchParts), getTrailingString(matchParts)) || this.getAsciiEmojiMatch(getLeadingString(matchParts), getAscii(matchParts), getTrailingString(matchParts));
    }
  }, {
    key: "getAsciiEmojiMatch",
    value: function getAsciiEmojiMatch(leading, ascii, trailing) {
      var emoji = this.asciiToEmojiMap.get(ascii);
      return emoji ? {
        emoji: emoji,
        leadingString: leading,
        trailingString: trailing
      } : undefined;
    }
  }]);

  return AsciiEmojiMatcher;
}();
/**
 * A matcher that will record ascii matches as usages of the matched emoji.
 */


_defineProperty(AsciiEmojiMatcher, "REGEX", new RegExp("((?:^|[\\s".concat(leafNodeReplacementCharacter, "])(?:\\(*?))(\\(?)([^:\\s").concat(leafNodeReplacementCharacter, "\\(]\\S{1,3}|:\\S{1,3}( ))$")));

var RecordingAsciiEmojiMatcher = /*#__PURE__*/function (_AsciiEmojiMatcher) {
  _inherits(RecordingAsciiEmojiMatcher, _AsciiEmojiMatcher);

  var _super = _createSuper(RecordingAsciiEmojiMatcher);

  function RecordingAsciiEmojiMatcher(emojiProvider, asciiToEmojiMap) {
    var _this;

    _classCallCheck(this, RecordingAsciiEmojiMatcher);

    _this = _super.call(this, asciiToEmojiMap);
    _this.emojiProvider = emojiProvider;
    return _this;
  }

  _createClass(RecordingAsciiEmojiMatcher, [{
    key: "match",
    value: function match(matchParts) {
      var match = _get(_getPrototypeOf(RecordingAsciiEmojiMatcher.prototype), "match", this).call(this, matchParts);

      if (match && this.emojiProvider.recordSelection) {
        this.emojiProvider.recordSelection(match.emoji);
      }

      return match;
    }
  }]);

  return RecordingAsciiEmojiMatcher;
}(AsciiEmojiMatcher);

var AsciiEmojiTransactionCreator = /*#__PURE__*/function () {
  function AsciiEmojiTransactionCreator(state, match, start, end) {
    _classCallCheck(this, AsciiEmojiTransactionCreator);

    this.state = state;
    this.match = match;
    this.start = start;
    this.end = end;
  }

  _createClass(AsciiEmojiTransactionCreator, [{
    key: "create",
    value: function create() {
      var tr = this.state.tr.replaceWith(this.from, this.to, this.createNodes());
      return addAnalytics(this.state, tr, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
        attributes: {
          inputMethod: INPUT_METHOD.ASCII
        },
        eventType: EVENT_TYPE.TRACK
      });
    }
  }, {
    key: "from",
    get: function get() {
      return this.start + this.match.leadingString.length;
    }
  }, {
    key: "to",
    get: function get() {
      return this.end;
    }
  }, {
    key: "createNodes",
    value: function createNodes() {
      var nodes = [this.createEmojiNode()];

      if (this.trailingTextNodeRequired()) {
        nodes.push(this.createTrailingTextNode());
      }

      return nodes;
    }
  }, {
    key: "createEmojiNode",
    value: function createEmojiNode() {
      var emojiTypeNode = this.state.schema.nodes.emoji;
      return emojiTypeNode.create(this.getEmojiNodeAttrs());
    }
  }, {
    key: "getEmojiNodeAttrs",
    value: function getEmojiNodeAttrs() {
      var emoji = this.match.emoji;
      return {
        id: emoji.id,
        shortName: emoji.shortName,
        text: emoji.fallback || emoji.shortName
      };
    }
  }, {
    key: "trailingTextNodeRequired",
    value: function trailingTextNodeRequired() {
      return this.match.trailingString.length > 0;
    }
  }, {
    key: "createTrailingTextNode",
    value: function createTrailingTextNode() {
      return this.state.schema.text(this.match.trailingString);
    }
  }]);

  return AsciiEmojiTransactionCreator;
}();

export var stateKey = new PluginKey('asciiEmojiPlugin');

var plugins = function plugins(schema, providerFactory, featureFlags) {
  return [inputRulePlugin(schema, providerFactory, featureFlags)].filter(function (plugin) {
    return !!plugin;
  });
};

export default plugins;
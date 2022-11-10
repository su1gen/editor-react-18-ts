"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.inputRulePlugin = inputRulePlugin;
exports.stateKey = void 0;

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _inputRules = require("../../../utils/input-rules");

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

var _analytics = require("../../analytics");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var matcher;

function inputRulePlugin(schema, providerFactory, featureFlags) {
  if (schema.nodes.emoji && providerFactory) {
    initMatcher(providerFactory);
    var asciiEmojiRule = (0, _inputRules.createRule)(AsciiEmojiMatcher.REGEX, inputRuleHandler);
    return (0, _inputRules.createPlugin)('emoji', [asciiEmojiRule]);
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
    (0, _classCallCheck2.default)(this, AsciiEmojiMatcher);
    this.asciiToEmojiMap = asciiToEmojiMap;
  }

  (0, _createClass2.default)(AsciiEmojiMatcher, [{
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


(0, _defineProperty2.default)(AsciiEmojiMatcher, "REGEX", new RegExp("((?:^|[\\s".concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "])(?:\\(*?))(\\(?)([^:\\s").concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "\\(]\\S{1,3}|:\\S{1,3}( ))$")));

var RecordingAsciiEmojiMatcher = /*#__PURE__*/function (_AsciiEmojiMatcher) {
  (0, _inherits2.default)(RecordingAsciiEmojiMatcher, _AsciiEmojiMatcher);

  var _super = _createSuper(RecordingAsciiEmojiMatcher);

  function RecordingAsciiEmojiMatcher(emojiProvider, asciiToEmojiMap) {
    var _this;

    (0, _classCallCheck2.default)(this, RecordingAsciiEmojiMatcher);
    _this = _super.call(this, asciiToEmojiMap);
    _this.emojiProvider = emojiProvider;
    return _this;
  }

  (0, _createClass2.default)(RecordingAsciiEmojiMatcher, [{
    key: "match",
    value: function match(matchParts) {
      var match = (0, _get2.default)((0, _getPrototypeOf2.default)(RecordingAsciiEmojiMatcher.prototype), "match", this).call(this, matchParts);

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
    (0, _classCallCheck2.default)(this, AsciiEmojiTransactionCreator);
    this.state = state;
    this.match = match;
    this.start = start;
    this.end = end;
  }

  (0, _createClass2.default)(AsciiEmojiTransactionCreator, [{
    key: "create",
    value: function create() {
      var tr = this.state.tr.replaceWith(this.from, this.to, this.createNodes());
      return (0, _analytics.addAnalytics)(this.state, tr, {
        action: _analytics.ACTION.INSERTED,
        actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.EMOJI,
        attributes: {
          inputMethod: _analytics.INPUT_METHOD.ASCII
        },
        eventType: _analytics.EVENT_TYPE.TRACK
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

var stateKey = new _prosemirrorState.PluginKey('asciiEmojiPlugin');
exports.stateKey = stateKey;

var plugins = function plugins(schema, providerFactory, featureFlags) {
  return [inputRulePlugin(schema, providerFactory, featureFlags)].filter(function (plugin) {
    return !!plugin;
  });
};

var _default = plugins;
exports.default = _default;
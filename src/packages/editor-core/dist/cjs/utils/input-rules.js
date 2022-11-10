"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleWithTransform = exports.ruleWithAnalytics = exports.createWrappingTextBlockRule = exports.createWrappingJoinRule = exports.createRule = exports.createPlugin = exports.createJoinNodesRule = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorHistory = require("prosemirror-history");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("../plugins/analytics/utils");

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var ruleWithAnalytics = function ruleWithAnalytics(getPayload) {
  return function (originalRule) {
    var onHandlerApply = function onHandlerApply(state, tr, matchResult) {
      var payload = typeof getPayload === 'function' ? getPayload(state, matchResult) : getPayload;
      (0, _utils.addAnalytics)(state, tr, payload);

      if (originalRule.onHandlerApply) {
        originalRule.onHandlerApply(state, tr, matchResult);
      }
    };

    return _objectSpread(_objectSpread({}, originalRule), {}, {
      onHandlerApply: onHandlerApply
    });
  };
};

exports.ruleWithAnalytics = ruleWithAnalytics;

var ruleWithTransform = function ruleWithTransform(transform) {
  return function (originalRule) {
    var onHandlerApply = function onHandlerApply(state, tr, matchResult) {
      transform(state, tr);

      if (originalRule.onHandlerApply) {
        originalRule.onHandlerApply(state, tr, matchResult);
      }
    };

    return _objectSpread(_objectSpread({}, originalRule), {}, {
      onHandlerApply: onHandlerApply
    });
  };
};

exports.ruleWithTransform = ruleWithTransform;

var createRule = function createRule(match, handler) {
  return {
    match: match,
    handler: handler,
    onHandlerApply: function onHandlerApply(state, tr) {
      (0, _prosemirrorHistory.closeHistory)(tr);
    }
  };
};

exports.createRule = createRule;

var createPlugin = function createPlugin(pluginName, rules) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$isBlockNodeR = options.isBlockNodeRule,
      isBlockNodeRule = _options$isBlockNodeR === void 0 ? false : _options$isBlockNodeR,
      _options$allowInsertT = options.allowInsertTextOnDocument,
      allowInsertTextOnDocument = _options$allowInsertT === void 0 ? true : _options$allowInsertT;

  var onInputEvent = function onInputEvent(_ref) {
    var state = _ref.state,
        from = _ref.from,
        to = _ref.to;
    var unsupportedMarks = isBlockNodeRule ? ['code', 'link', 'typeAheadQuery'] : ['code'];
    var $from = state.selection.$from;

    if ($from.parent.type.spec.code || !(state.selection instanceof _prosemirrorState.TextSelection) || hasUnsupportedMarks(state, from, to, unsupportedMarks) || isBlockNodeRule && isCursorInsideUnsupportedMarks(state, unsupportedMarks)) {
      return false;
    }

    return true;
  };

  return (0, _prosemirrorInputRules.createInputRulePlugin)(pluginName, rules, {
    allowInsertTextOnDocument: allowInsertTextOnDocument,
    onInputEvent: onInputEvent,
    onBeforeRegexMatch: function onBeforeRegexMatch(tr) {
      (0, _prosemirrorHistory.closeHistory)(tr);
    }
  });
};

exports.createPlugin = createPlugin;

var createWrappingTextBlockRule = function createWrappingTextBlockRule(_ref2) {
  var match = _ref2.match,
      nodeType = _ref2.nodeType,
      getAttrs = _ref2.getAttrs;

  var handler = function handler(state, match, start, end) {
    var fixedStart = Math.max(start, 1);
    var $start = state.doc.resolve(fixedStart);
    var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    var nodeBefore = $start.node(-1);

    if (nodeBefore && !nodeBefore.canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) {
      return null;
    }

    return state.tr.delete(fixedStart, end).setBlockType(fixedStart, fixedStart, nodeType, attrs);
  };

  return createRule(match, handler);
};

exports.createWrappingTextBlockRule = createWrappingTextBlockRule;

var createWrappingJoinRule = function createWrappingJoinRule(_ref3) {
  var match = _ref3.match,
      nodeType = _ref3.nodeType,
      getAttrs = _ref3.getAttrs,
      joinPredicate = _ref3.joinPredicate;

  var handler = function handler(state, match, start, end) {
    var attrs = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) || {};
    var tr = state.tr;
    var fixedStart = Math.max(start, 1);
    tr.delete(fixedStart, end);
    var $start = tr.doc.resolve(fixedStart);
    var range = $start.blockRange();
    var wrapping = range && (0, _prosemirrorTransform.findWrapping)(range, nodeType, attrs);

    if (!wrapping || !range) {
      return null;
    }

    var parentNodePosMapped = tr.mapping.map(range.start);
    var parentNode = tr.doc.nodeAt(parentNodePosMapped);
    var lastWrap = wrapping[wrapping.length - 1];

    if (parentNode && lastWrap) {
      var allowedMarks = lastWrap.type.allowedMarks(parentNode.marks) || [];
      tr.setNodeMarkup(parentNodePosMapped, parentNode.type, parentNode.attrs, allowedMarks);
    }

    tr.wrap(range, wrapping);
    var before = tr.doc.resolve(fixedStart - 1).nodeBefore;

    if (before && before.type === nodeType && (0, _prosemirrorTransform.canJoin)(tr.doc, fixedStart - 1) && (!joinPredicate || joinPredicate(match, before))) {
      tr.join(fixedStart - 1);
    }

    return tr;
  };

  return createRule(match, handler);
};

exports.createWrappingJoinRule = createWrappingJoinRule;

var createJoinNodesRule = function createJoinNodesRule(match, nodeType) {
  return createWrappingJoinRule({
    nodeType: nodeType,
    match: match,
    getAttrs: {},
    joinPredicate: function joinPredicate(_, node) {
      return node.type === nodeType;
    }
  });
};

exports.createJoinNodesRule = createJoinNodesRule;

var hasUnsupportedMarks = function hasUnsupportedMarks(state, start, end, marksNameUnsupported) {
  var isUnsupportedMark = function isUnsupportedMark(node) {
    return (marksNameUnsupported || []).includes(node.type.name);
  };

  var $from = state.doc.resolve(start);
  var $to = state.doc.resolve(end);
  var marksInSelection = start === end ? $from.marks() : $from.marksAcross($to);
  return (marksInSelection || []).some(isUnsupportedMark);
};

var isCursorInsideUnsupportedMarks = function isCursorInsideUnsupportedMarks(state, marksNameUnsupported) {
  var _$cursor$nodeBefore, _$cursor$nodeBefore$m;

  var selection = state.selection;

  if (!(selection instanceof _prosemirrorState.TextSelection)) {
    return false;
  }

  var $cursor = selection.$cursor;

  var isUnsupportedMark = function isUnsupportedMark(node) {
    return marksNameUnsupported.includes(node.type.name);
  };

  return Boolean($cursor === null || $cursor === void 0 ? void 0 : (_$cursor$nodeBefore = $cursor.nodeBefore) === null || _$cursor$nodeBefore === void 0 ? void 0 : (_$cursor$nodeBefore$m = _$cursor$nodeBefore.marks) === null || _$cursor$nodeBefore$m === void 0 ? void 0 : _$cursor$nodeBefore$m.some(isUnsupportedMark));
};
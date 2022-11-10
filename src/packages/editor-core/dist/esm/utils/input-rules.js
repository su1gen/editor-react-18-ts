import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { canJoin, findWrapping } from 'prosemirror-transform';
import { closeHistory } from 'prosemirror-history';
import { TextSelection } from 'prosemirror-state';
import { addAnalytics } from '../plugins/analytics/utils';
import { createInputRulePlugin } from '@atlaskit/prosemirror-input-rules';
export var ruleWithAnalytics = function ruleWithAnalytics(getPayload) {
  return function (originalRule) {
    var onHandlerApply = function onHandlerApply(state, tr, matchResult) {
      var payload = typeof getPayload === 'function' ? getPayload(state, matchResult) : getPayload;
      addAnalytics(state, tr, payload);

      if (originalRule.onHandlerApply) {
        originalRule.onHandlerApply(state, tr, matchResult);
      }
    };

    return _objectSpread(_objectSpread({}, originalRule), {}, {
      onHandlerApply: onHandlerApply
    });
  };
};
export var ruleWithTransform = function ruleWithTransform(transform) {
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
export var createRule = function createRule(match, handler) {
  return {
    match: match,
    handler: handler,
    onHandlerApply: function onHandlerApply(state, tr) {
      closeHistory(tr);
    }
  };
};
export var createPlugin = function createPlugin(pluginName, rules) {
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

    if ($from.parent.type.spec.code || !(state.selection instanceof TextSelection) || hasUnsupportedMarks(state, from, to, unsupportedMarks) || isBlockNodeRule && isCursorInsideUnsupportedMarks(state, unsupportedMarks)) {
      return false;
    }

    return true;
  };

  return createInputRulePlugin(pluginName, rules, {
    allowInsertTextOnDocument: allowInsertTextOnDocument,
    onInputEvent: onInputEvent,
    onBeforeRegexMatch: function onBeforeRegexMatch(tr) {
      closeHistory(tr);
    }
  });
};
export var createWrappingTextBlockRule = function createWrappingTextBlockRule(_ref2) {
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
export var createWrappingJoinRule = function createWrappingJoinRule(_ref3) {
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
    var wrapping = range && findWrapping(range, nodeType, attrs);

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

    if (before && before.type === nodeType && canJoin(tr.doc, fixedStart - 1) && (!joinPredicate || joinPredicate(match, before))) {
      tr.join(fixedStart - 1);
    }

    return tr;
  };

  return createRule(match, handler);
};
export var createJoinNodesRule = function createJoinNodesRule(match, nodeType) {
  return createWrappingJoinRule({
    nodeType: nodeType,
    match: match,
    getAttrs: {},
    joinPredicate: function joinPredicate(_, node) {
      return node.type === nodeType;
    }
  });
};

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

  if (!(selection instanceof TextSelection)) {
    return false;
  }

  var $cursor = selection.$cursor;

  var isUnsupportedMark = function isUnsupportedMark(node) {
    return marksNameUnsupported.includes(node.type.name);
  };

  return Boolean($cursor === null || $cursor === void 0 ? void 0 : (_$cursor$nodeBefore = $cursor.nodeBefore) === null || _$cursor$nodeBefore === void 0 ? void 0 : (_$cursor$nodeBefore$m = _$cursor$nodeBefore.marks) === null || _$cursor$nodeBefore$m === void 0 ? void 0 : _$cursor$nodeBefore$m.some(isUnsupportedMark));
};
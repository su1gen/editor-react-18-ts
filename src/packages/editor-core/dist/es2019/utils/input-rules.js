import { canJoin, findWrapping } from 'prosemirror-transform';
import { closeHistory } from 'prosemirror-history';
import { TextSelection } from 'prosemirror-state';
import { addAnalytics } from '../plugins/analytics/utils';
import { createInputRulePlugin } from '@atlaskit/prosemirror-input-rules';
export const ruleWithAnalytics = getPayload => {
  return originalRule => {
    const onHandlerApply = (state, tr, matchResult) => {
      const payload = typeof getPayload === 'function' ? getPayload(state, matchResult) : getPayload;
      addAnalytics(state, tr, payload);

      if (originalRule.onHandlerApply) {
        originalRule.onHandlerApply(state, tr, matchResult);
      }
    };

    return { ...originalRule,
      onHandlerApply
    };
  };
};
export const ruleWithTransform = transform => {
  return originalRule => {
    const onHandlerApply = (state, tr, matchResult) => {
      transform(state, tr);

      if (originalRule.onHandlerApply) {
        originalRule.onHandlerApply(state, tr, matchResult);
      }
    };

    return { ...originalRule,
      onHandlerApply
    };
  };
};
export const createRule = (match, handler) => {
  return {
    match,
    handler,
    onHandlerApply: (state, tr) => {
      closeHistory(tr);
    }
  };
};
export const createPlugin = (pluginName, rules, options = {}) => {
  const {
    isBlockNodeRule = false,
    allowInsertTextOnDocument = true
  } = options;

  const onInputEvent = ({
    state,
    from,
    to
  }) => {
    const unsupportedMarks = isBlockNodeRule ? ['code', 'link', 'typeAheadQuery'] : ['code'];
    const $from = state.selection.$from;

    if ($from.parent.type.spec.code || !(state.selection instanceof TextSelection) || hasUnsupportedMarks(state, from, to, unsupportedMarks) || isBlockNodeRule && isCursorInsideUnsupportedMarks(state, unsupportedMarks)) {
      return false;
    }

    return true;
  };

  return createInputRulePlugin(pluginName, rules, {
    allowInsertTextOnDocument,
    onInputEvent,
    onBeforeRegexMatch: tr => {
      closeHistory(tr);
    }
  });
};
export const createWrappingTextBlockRule = ({
  match,
  nodeType,
  getAttrs
}) => {
  const handler = (state, match, start, end) => {
    const fixedStart = Math.max(start, 1);
    const $start = state.doc.resolve(fixedStart);
    const attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    const nodeBefore = $start.node(-1);

    if (nodeBefore && !nodeBefore.canReplaceWith($start.index(-1), $start.indexAfter(-1), nodeType)) {
      return null;
    }

    return state.tr.delete(fixedStart, end).setBlockType(fixedStart, fixedStart, nodeType, attrs);
  };

  return createRule(match, handler);
};
export const createWrappingJoinRule = ({
  match,
  nodeType,
  getAttrs,
  joinPredicate
}) => {
  const handler = (state, match, start, end) => {
    const attrs = (getAttrs instanceof Function ? getAttrs(match) : getAttrs) || {};
    const tr = state.tr;
    const fixedStart = Math.max(start, 1);
    tr.delete(fixedStart, end);
    const $start = tr.doc.resolve(fixedStart);
    const range = $start.blockRange();
    const wrapping = range && findWrapping(range, nodeType, attrs);

    if (!wrapping || !range) {
      return null;
    }

    const parentNodePosMapped = tr.mapping.map(range.start);
    const parentNode = tr.doc.nodeAt(parentNodePosMapped);
    const lastWrap = wrapping[wrapping.length - 1];

    if (parentNode && lastWrap) {
      const allowedMarks = lastWrap.type.allowedMarks(parentNode.marks) || [];
      tr.setNodeMarkup(parentNodePosMapped, parentNode.type, parentNode.attrs, allowedMarks);
    }

    tr.wrap(range, wrapping);
    const before = tr.doc.resolve(fixedStart - 1).nodeBefore;

    if (before && before.type === nodeType && canJoin(tr.doc, fixedStart - 1) && (!joinPredicate || joinPredicate(match, before))) {
      tr.join(fixedStart - 1);
    }

    return tr;
  };

  return createRule(match, handler);
};
export const createJoinNodesRule = (match, nodeType) => {
  return createWrappingJoinRule({
    nodeType,
    match,
    getAttrs: {},
    joinPredicate: (_, node) => node.type === nodeType
  });
};

const hasUnsupportedMarks = (state, start, end, marksNameUnsupported) => {
  const isUnsupportedMark = node => (marksNameUnsupported || []).includes(node.type.name);

  const $from = state.doc.resolve(start);
  const $to = state.doc.resolve(end);
  const marksInSelection = start === end ? $from.marks() : $from.marksAcross($to);
  return (marksInSelection || []).some(isUnsupportedMark);
};

const isCursorInsideUnsupportedMarks = (state, marksNameUnsupported) => {
  var _$cursor$nodeBefore, _$cursor$nodeBefore$m;

  const {
    selection
  } = state;

  if (!(selection instanceof TextSelection)) {
    return false;
  }

  const {
    $cursor
  } = selection;

  const isUnsupportedMark = node => marksNameUnsupported.includes(node.type.name);

  return Boolean($cursor === null || $cursor === void 0 ? void 0 : (_$cursor$nodeBefore = $cursor.nodeBefore) === null || _$cursor$nodeBefore === void 0 ? void 0 : (_$cursor$nodeBefore$m = _$cursor$nodeBefore.marks) === null || _$cursor$nodeBefore$m === void 0 ? void 0 : _$cursor$nodeBefore$m.some(isUnsupportedMark));
};
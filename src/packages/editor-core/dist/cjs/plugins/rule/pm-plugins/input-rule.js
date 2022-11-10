"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createHorizontalRule = void 0;
exports.inputRulePlugin = inputRulePlugin;

var _prosemirrorModel = require("prosemirror-model");

var _inputRules = require("../../../utils/input-rules");

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

var _insert = require("../../../utils/insert");

var _analytics = require("../../analytics");

var _featureFlagsContext = require("../../feature-flags-context");

var createHorizontalRule = function createHorizontalRule(state, start, end, inputMethod) {
  if (!state.selection.empty) {
    return null;
  }

  var tr = null;
  var rule = state.schema.nodes.rule;

  var _getFeatureFlags = (0, _featureFlagsContext.getFeatureFlags)(state),
      newInsertionBehaviour = _getFeatureFlags.newInsertionBehaviour;

  if (newInsertionBehaviour) {
    /**
     * This is a workaround to get rid of the typeahead text when using quick insert
     * Once we insert *nothing*, we get a new transaction, so we can use the new selection
     * without considering the extra text after the `/` command.
     **/
    tr = state.tr.replaceWith(start, end, _prosemirrorModel.Fragment.empty);
    tr = (0, _insert.safeInsert)(rule.createChecked(), tr.selection.from)(tr);
  }

  if (!tr) {
    tr = state.tr.replaceRange(start, end, new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.from(state.schema.nodes.rule.createChecked()), 0, 0));
  }

  return (0, _analytics.addAnalytics)(state, tr, {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.DIVIDER,
    attributes: {
      inputMethod: inputMethod
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  });
};

exports.createHorizontalRule = createHorizontalRule;

var createHorizontalRuleAutoformat = function createHorizontalRuleAutoformat(state, start, end) {
  return createHorizontalRule(state, start, end, _analytics.INPUT_METHOD.FORMATTING);
};

function inputRulePlugin(schema, featureFlags) {
  var rules = [];

  if (schema.nodes.rule) {
    // '---' and '***' for hr
    rules.push((0, _inputRules.createRule)(/^(\-\-\-|\*\*\*)$/, function (state, _match, start, end) {
      return createHorizontalRuleAutoformat(state, start, end);
    })); // '---' and '***' after shift+enter for hr

    rules.push((0, _inputRules.createRule)(new RegExp("".concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "(\\-\\-\\-|\\*\\*\\*)")), function (state, _match, start, end) {
      var hardBreak = state.schema.nodes.hardBreak;

      if (state.doc.resolve(start).nodeAfter.type !== hardBreak) {
        return null;
      }

      return createHorizontalRuleAutoformat(state, start, end);
    }));
  }

  if (rules.length !== 0) {
    return (0, _inputRules.createPlugin)('rule', rules, {
      isBlockNodeRule: true
    });
  }

  return;
}

var _default = inputRulePlugin;
exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.inputRulePlugin = inputRulePlugin;

var _prosemirrorInputRules = require("@atlaskit/prosemirror-input-rules");

var _openTypeaheadAtCursor = require("../transforms/open-typeahead-at-cursor");

var _analytics = require("../../analytics");

var _inputRules = require("../../../utils/input-rules");

function inputRulePlugin(schema, typeAheads, featureFlags) {
  if (!typeAheads || typeAheads.length === 0) {
    return;
  }

  var rules = typeAheads.reduce(function (acc, typeAhead) {
    var trigger = typeAhead.customRegex || typeAhead.trigger;

    if (!trigger) {
      return acc;
    }

    var regex = new RegExp("(^|[.!?\\s".concat(_prosemirrorInputRules.leafNodeReplacementCharacter, "])(").concat(trigger, ")$"));
    acc.push((0, _inputRules.createRule)(regex, function (state, match) {
      return (0, _openTypeaheadAtCursor.openTypeAheadAtCursor)({
        triggerHandler: typeAhead,
        inputMethod: _analytics.INPUT_METHOD.KEYBOARD
      })(state.tr);
    }));
    return acc;
  }, []);
  var plugin = (0, _inputRules.createPlugin)('type-ahead', rules, {
    allowInsertTextOnDocument: false
  });
  return plugin;
}

var _default = inputRulePlugin;
exports.default = _default;
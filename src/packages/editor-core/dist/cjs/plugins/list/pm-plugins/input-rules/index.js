"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = inputRulePlugin;

var _inputRules = require("../../../../utils/input-rules");

var _createListInputRule = require("./create-list-input-rule");

function inputRulePlugin(schema, featureFlags) {
  var _schema$nodes = schema.nodes,
      bulletList = _schema$nodes.bulletList,
      orderedList = _schema$nodes.orderedList;
  var rules = [];

  if (bulletList) {
    rules.push((0, _createListInputRule.createRuleForListType)({
      // Using UTF instead of • character
      // because of issue where product converted the
      // character into an escaped version.
      expression: /^\s*([\*\-\u2022]) $/,
      listType: bulletList
    }));
  }

  if (orderedList) {
    rules.push((0, _createListInputRule.createRuleForListType)({
      expression: /^(1)[\.\)] $/,
      listType: orderedList
    }));
  }

  if (rules.length !== 0) {
    return (0, _inputRules.createPlugin)('lists', rules);
  }

  return;
}
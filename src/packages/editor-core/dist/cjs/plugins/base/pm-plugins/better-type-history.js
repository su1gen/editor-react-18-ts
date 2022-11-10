"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorHistory = require("prosemirror-history");

var _prosemirrorTransform = require("prosemirror-transform");

var _step = require("../../../utils/step");

var getEnterKeyboardActionStep = function getEnterKeyboardActionStep(trs) {
  var firstTr = trs.length === 1 && trs[0];

  if (!firstTr || !firstTr.docChanged || !firstTr.isGeneric || !(firstTr.selection instanceof _prosemirrorState.TextSelection)) {
    return null;
  }

  var selection = firstTr.selection,
      steps = firstTr.steps;
  var replaceSteps = steps.filter(function (step) {
    return step instanceof _prosemirrorTransform.ReplaceStep || step instanceof _prosemirrorTransform.ReplaceAroundStep;
  });

  if (!selection.$cursor || replaceSteps.length !== 1) {
    return null;
  }

  return replaceSteps[0];
};

var isSliceSplittingBlockNode = function isSliceSplittingBlockNode(slice) {
  var hasOnlyTwoChildren = slice.size > 1 && slice.content.childCount === 2;

  if (!hasOnlyTwoChildren) {
    return false;
  }

  var firstNode = slice.content.child(0);
  var secondNode = slice.content.child(1);
  return firstNode && secondNode && firstNode.type === secondNode.type;
};

var isSliceAddingNewlineChar = function isSliceAddingNewlineChar(slice, schema) {
  var newLine = _prosemirrorModel.Fragment.from(schema.text('\n'));

  return slice.content.eq(newLine);
};

var pluginKey = new _prosemirrorState.PluginKey('betterTypeHistoryPlugin');
exports.pluginKey = pluginKey;

var _default = function _default() {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      var hasHandlePasteMeta = transactions.find(function (tran) {
        return tran.getMeta(pluginKey);
      });

      if (hasHandlePasteMeta) {
        return (0, _prosemirrorHistory.closeHistory)(newState.tr);
      }

      var enterStep = getEnterKeyboardActionStep(transactions);

      if (!enterStep) {
        return;
      }

      var slice = (0, _step.extractSliceFromStep)(enterStep);
      var schema = newState.schema;

      if (slice && (isSliceSplittingBlockNode(slice) || isSliceAddingNewlineChar(slice, schema))) {
        return (0, _prosemirrorHistory.closeHistory)(newState.tr);
      }
    }
  });
};

exports.default = _default;
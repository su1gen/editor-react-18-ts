import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TextSelection } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
import { closeHistory } from 'prosemirror-history';
import { ReplaceStep, ReplaceAroundStep } from 'prosemirror-transform';
import { PluginKey } from 'prosemirror-state';
import { extractSliceFromStep } from '../../../utils/step';

var getEnterKeyboardActionStep = function getEnterKeyboardActionStep(trs) {
  var firstTr = trs.length === 1 && trs[0];

  if (!firstTr || !firstTr.docChanged || !firstTr.isGeneric || !(firstTr.selection instanceof TextSelection)) {
    return null;
  }

  var selection = firstTr.selection,
      steps = firstTr.steps;
  var replaceSteps = steps.filter(function (step) {
    return step instanceof ReplaceStep || step instanceof ReplaceAroundStep;
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
  var newLine = Fragment.from(schema.text('\n'));
  return slice.content.eq(newLine);
};

export var pluginKey = new PluginKey('betterTypeHistoryPlugin');
export default (function () {
  return new SafePlugin({
    key: pluginKey,
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      var hasHandlePasteMeta = transactions.find(function (tran) {
        return tran.getMeta(pluginKey);
      });

      if (hasHandlePasteMeta) {
        return closeHistory(newState.tr);
      }

      var enterStep = getEnterKeyboardActionStep(transactions);

      if (!enterStep) {
        return;
      }

      var slice = extractSliceFromStep(enterStep);
      var schema = newState.schema;

      if (slice && (isSliceSplittingBlockNode(slice) || isSliceAddingNewlineChar(slice, schema))) {
        return closeHistory(newState.tr);
      }
    }
  });
});
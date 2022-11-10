import { Node } from 'prosemirror-model';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, getAnalyticsEventsFromTransaction } from '../../../../../plugins/analytics';
import { findChangedNodesFromTransaction, validateNodes, validNode } from '../../../../../utils/nodes';
import { compose, toJSON } from '../../../../../utils';
import { getDocStructure } from '../../../../../utils/document-logger';
import { analyticsEventKey } from '../../../../../plugins/analytics/consts'; // Helper to assure correct payload when dispatch analytics

function dispatchAnalytics(dispatch, payload) {
  dispatch(analyticsEventKey, payload);
}

export function createDispatchTransaction(editorSharedConfig) {
  return function dispatchTransaction(transaction) {
    var editorView = editorSharedConfig.editorView,
        onChange = editorSharedConfig.onChange,
        transformer = editorSharedConfig.transformer,
        dispatch = editorSharedConfig.dispatch;

    if (!editorView) {
      return;
    }

    var nodes = findChangedNodesFromTransaction(transaction);

    if (validateNodes(nodes)) {
      // go ahead and update the state now we know the transaction is good
      var editorState = editorView.state.apply(transaction);
      editorView.updateState(editorState);

      if (onChange && transaction.docChanged) {
        onChange(getEditorValue(editorView, transformer), {
          source: 'local'
        });
      }
    } else {
      // If invalid document, send analytics event with the structure of the nodes
      if (dispatch) {
        var invalidNodes = nodes.filter(function (node) {
          return !validNode(node);
        }).map(function (node) {
          return getDocStructure(node);
        });
        dispatchAnalytics(dispatch, {
          action: ACTION.DISPATCHED_INVALID_TRANSACTION,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            analyticsEventPayloads: getAnalyticsEventsFromTransaction(transaction),
            invalidNodes: invalidNodes
          }
        });
      }
    }
  };
}
export function getEditorValue(editorView, transformer) {
  return compose(function (doc) {
    return transformer && transformer.encode ? transformer.encode(Node.fromJSON(editorView.state.schema, doc)) : doc;
  }, toJSON)(editorView.state.doc);
}
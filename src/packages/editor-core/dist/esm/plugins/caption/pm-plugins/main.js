import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { findParentNodeOfType } from 'prosemirror-utils';
import { pluginKey } from './plugin-key';
import captionNodeView from './../nodeviews';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';

var fireAnalytic = function fireAnalytic(state, tr, action) {
  addAnalytics(state, tr, {
    action: action,
    eventType: EVENT_TYPE.TRACK,
    actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
    actionSubjectId: ACTION_SUBJECT_ID.CAPTION
  });
};

export default (function (portalProviderAPI, eventDispatcher, providerFactory, dispatch) {
  return new SafePlugin({
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      // only run for transactions that change selection
      if (!transactions.find(function (tr) {
        return tr.selectionSet;
      })) {
        return;
      }

      var newSelection = !newState.selection.eq(oldState.selection);
      var findCaption = findParentNodeOfType(oldState.schema.nodes.caption);
      var oldSelectionCaption = findCaption(oldState.selection);
      var tr = newState.tr; // if selecting away from caption, or selecting a different caption

      if (newSelection && oldSelectionCaption) {
        if (oldSelectionCaption.node.childCount === 0) {
          tr.delete(oldSelectionCaption.start - 1, oldSelectionCaption.start);
          tr.setMeta('scrollIntoView', false);
          fireAnalytic(newState, tr, ACTION.DELETED);
          return tr;
        } else {
          fireAnalytic(newState, tr, ACTION.EDITED);
        }
      }
    },
    key: pluginKey,
    props: {
      nodeViews: {
        caption: captionNodeView(portalProviderAPI, eventDispatcher)
      }
    }
  });
});
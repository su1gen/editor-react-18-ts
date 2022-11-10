import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { findParentNodeOfType } from 'prosemirror-utils';
import { pluginKey } from './plugin-key';
import captionNodeView from './../nodeviews';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../analytics';

const fireAnalytic = (state, tr, action) => {
  addAnalytics(state, tr, {
    action,
    eventType: EVENT_TYPE.TRACK,
    actionSubject: ACTION_SUBJECT.MEDIA_SINGLE,
    actionSubjectId: ACTION_SUBJECT_ID.CAPTION
  });
};

export default ((portalProviderAPI, eventDispatcher, providerFactory, dispatch) => {
  return new SafePlugin({
    appendTransaction(transactions, oldState, newState) {
      // only run for transactions that change selection
      if (!transactions.find(tr => tr.selectionSet)) {
        return;
      }

      const newSelection = !newState.selection.eq(oldState.selection);
      const findCaption = findParentNodeOfType(oldState.schema.nodes.caption);
      const oldSelectionCaption = findCaption(oldState.selection);
      const {
        tr
      } = newState; // if selecting away from caption, or selecting a different caption

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
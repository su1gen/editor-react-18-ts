import { Fragment } from 'prosemirror-model';
import { NodeSelection, Selection } from 'prosemirror-state';
import { uuid } from '@atlaskit/adf-schema';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, withAnalytics } from '../analytics';
import { pluginKey } from './plugin-key';
import { canInsert } from 'prosemirror-utils';
export const DEFAULT_STATUS = {
  text: '',
  color: 'neutral'
};
export const createStatus = (showStatusPickerAtOffset = 0) => (insert, state) => {
  const statusNode = state.schema.nodes.status.createChecked({ ...DEFAULT_STATUS,
    localId: uuid.generate()
  });
  const space = state.schema.text(' ');
  const tr = insert(Fragment.from([statusNode, space]), {
    selectInlineNode: true
  });
  const showStatusPickerAt = tr.selection.from + showStatusPickerAtOffset;
  return tr.setSelection(NodeSelection.create(tr.doc, showStatusPickerAt)).setMeta(pluginKey, {
    showStatusPickerAt,
    isNew: true
  });
};
export const updateStatus = status => (state, dispatch) => {
  const {
    schema
  } = state;
  const selectedStatus = status ? Object.assign(status, {
    text: status.text.trim(),
    localId: status.localId || uuid.generate()
  }) : status;
  const statusProps = { ...DEFAULT_STATUS,
    ...selectedStatus
  };
  let tr = state.tr;
  const {
    showStatusPickerAt
  } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    // Same behaviour as quick insert (used in createStatus)
    const statusNode = schema.nodes.status.createChecked(statusProps);
    const fragment = Fragment.fromArray([statusNode, state.schema.text(' ')]);
    const insertable = canInsert(tr.selection.$from, fragment);

    if (!insertable) {
      const parentSelection = NodeSelection.create(tr.doc, tr.selection.from - tr.selection.$anchor.parentOffset - 1);
      tr.insert(parentSelection.to, fragment).setSelection(NodeSelection.create(tr.doc, parentSelection.to + 1));
    } else {
      tr.insert(tr.selection.from, fragment).setSelection(NodeSelection.create(tr.doc, tr.selection.from - fragment.size));
    }

    tr.setMeta(pluginKey, {
      showStatusPickerAt: tr.selection.from,
      isNew: true
    }).scrollIntoView();

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  if (state.doc.nodeAt(showStatusPickerAt)) {
    tr.setNodeMarkup(showStatusPickerAt, schema.nodes.status, statusProps).setSelection(NodeSelection.create(tr.doc, showStatusPickerAt)).setMeta(pluginKey, {
      showStatusPickerAt
    }).scrollIntoView();

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  return false;
};
export const updateStatusWithAnalytics = (inputMethod, status) => withAnalytics({
  action: ACTION.INSERTED,
  actionSubject: ACTION_SUBJECT.DOCUMENT,
  actionSubjectId: ACTION_SUBJECT_ID.STATUS,
  attributes: {
    inputMethod
  },
  eventType: EVENT_TYPE.TRACK
})(updateStatus(status));
export const setStatusPickerAt = showStatusPickerAt => (state, dispatch) => {
  dispatch(state.tr.setMeta(pluginKey, {
    showStatusPickerAt,
    isNew: false
  }));
  return true;
};
export const removeStatus = showStatusPickerAt => (state, dispatch) => {
  const tr = state.tr;
  tr.replace(showStatusPickerAt, showStatusPickerAt + 1);

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};
export const commitStatusPicker = () => editorView => {
  const {
    state,
    dispatch
  } = editorView;
  const {
    showStatusPickerAt
  } = pluginKey.getState(state);

  if (!showStatusPickerAt) {
    return;
  }

  const statusNode = state.tr.doc.nodeAt(showStatusPickerAt);

  if (!statusNode) {
    return;
  }

  let tr = state.tr;
  tr = tr.setMeta(pluginKey, {
    showStatusPickerAt: null,
    isNew: false
  });

  if (statusNode.attrs.text) {
    // still has content - keep content
    // move selection after status if selection did not change
    if (tr.selection.from === showStatusPickerAt) {
      tr = tr.setSelection(Selection.near(state.tr.doc.resolve(showStatusPickerAt + 2)));
    }
  } else {
    // no content - remove node
    tr = tr.delete(showStatusPickerAt, showStatusPickerAt + 1);
  }

  dispatch(tr);
  editorView.focus();
};
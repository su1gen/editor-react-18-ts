import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { Fragment } from 'prosemirror-model';
import { NodeSelection, Selection } from 'prosemirror-state';
import { uuid } from '@atlaskit/adf-schema';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, withAnalytics } from '../analytics';
import { pluginKey } from './plugin-key';
import { canInsert } from 'prosemirror-utils';
export var DEFAULT_STATUS = {
  text: '',
  color: 'neutral'
};
export var createStatus = function createStatus() {
  var showStatusPickerAtOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function (insert, state) {
    var statusNode = state.schema.nodes.status.createChecked(_objectSpread(_objectSpread({}, DEFAULT_STATUS), {}, {
      localId: uuid.generate()
    }));
    var space = state.schema.text(' ');
    var tr = insert(Fragment.from([statusNode, space]), {
      selectInlineNode: true
    });
    var showStatusPickerAt = tr.selection.from + showStatusPickerAtOffset;
    return tr.setSelection(NodeSelection.create(tr.doc, showStatusPickerAt)).setMeta(pluginKey, {
      showStatusPickerAt: showStatusPickerAt,
      isNew: true
    });
  };
};
export var updateStatus = function updateStatus(status) {
  return function (state, dispatch) {
    var schema = state.schema;
    var selectedStatus = status ? Object.assign(status, {
      text: status.text.trim(),
      localId: status.localId || uuid.generate()
    }) : status;

    var statusProps = _objectSpread(_objectSpread({}, DEFAULT_STATUS), selectedStatus);

    var tr = state.tr;

    var _pluginKey$getState = pluginKey.getState(state),
        showStatusPickerAt = _pluginKey$getState.showStatusPickerAt;

    if (!showStatusPickerAt) {
      // Same behaviour as quick insert (used in createStatus)
      var statusNode = schema.nodes.status.createChecked(statusProps);
      var fragment = Fragment.fromArray([statusNode, state.schema.text(' ')]);
      var insertable = canInsert(tr.selection.$from, fragment);

      if (!insertable) {
        var parentSelection = NodeSelection.create(tr.doc, tr.selection.from - tr.selection.$anchor.parentOffset - 1);
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
        showStatusPickerAt: showStatusPickerAt
      }).scrollIntoView();

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};
export var updateStatusWithAnalytics = function updateStatusWithAnalytics(inputMethod, status) {
  return withAnalytics({
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.STATUS,
    attributes: {
      inputMethod: inputMethod
    },
    eventType: EVENT_TYPE.TRACK
  })(updateStatus(status));
};
export var setStatusPickerAt = function setStatusPickerAt(showStatusPickerAt) {
  return function (state, dispatch) {
    dispatch(state.tr.setMeta(pluginKey, {
      showStatusPickerAt: showStatusPickerAt,
      isNew: false
    }));
    return true;
  };
};
export var removeStatus = function removeStatus(showStatusPickerAt) {
  return function (state, dispatch) {
    var tr = state.tr;
    tr.replace(showStatusPickerAt, showStatusPickerAt + 1);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};
export var commitStatusPicker = function commitStatusPicker() {
  return function (editorView) {
    var state = editorView.state,
        dispatch = editorView.dispatch;

    var _pluginKey$getState2 = pluginKey.getState(state),
        showStatusPickerAt = _pluginKey$getState2.showStatusPickerAt;

    if (!showStatusPickerAt) {
      return;
    }

    var statusNode = state.tr.doc.nodeAt(showStatusPickerAt);

    if (!statusNode) {
      return;
    }

    var tr = state.tr;
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
};
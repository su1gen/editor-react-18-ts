import { NodeSelection, Selection } from 'prosemirror-state';
import { Fragment } from 'prosemirror-model';
import { todayTimestampInUTC } from '@atlaskit/editor-common/utils';
import { pluginKey } from './pm-plugins/plugin-key';
import { withAnalytics, addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { isToday } from './utils/internal';
import { canInsert } from 'prosemirror-utils';
export var createDate = function createDate(isQuickInsertAction) {
  return function (insert, state) {
    var dateNode = state.schema.nodes.date.createChecked({
      timestamp: todayTimestampInUTC()
    });
    var space = state.schema.text(' ');
    var tr = insert(Fragment.from([dateNode, space]), {
      selectInlineNode: true
    });
    var newPluginState = {
      isQuickInsertAction: isQuickInsertAction,
      showDatePickerAt: tr.selection.from,
      isNew: true,
      isDateEmpty: false,
      focusDateInput: false
    };
    return tr.setMeta(pluginKey, newPluginState);
  };
};
/** Delete the date and close the datepicker */

export var deleteDate = function deleteDate() {
  return function (state, dispatch) {
    var _pluginKey$getState = pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState.showDatePickerAt;

    if (showDatePickerAt === null) {
      return false;
    }

    var tr = state.tr.delete(showDatePickerAt, showDatePickerAt + 1).setMeta(pluginKey, {
      showDatePickerAt: null,
      isNew: false
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};
/** Focus input */

export var focusDateInput = function focusDateInput() {
  return function (state, dispatch) {
    var _pluginKey$getState2 = pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState2.showDatePickerAt;

    if (showDatePickerAt === null) {
      return false;
    }

    if (!dispatch) {
      return false;
    }

    var tr = state.tr.setMeta(pluginKey, {
      focusDateInput: true
    });
    dispatch(tr);
    return true;
  };
};
export var insertDate = function insertDate(date, inputMethod, commitMethod) {
  var enterPressed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return function (state, dispatch) {
    var schema = state.schema;
    var timestamp;

    if (date) {
      timestamp = Date.UTC(date.year, date.month - 1, date.day).toString();
    } else {
      timestamp = todayTimestampInUTC();
    }

    var tr = state.tr;

    if (inputMethod) {
      addAnalytics(state, tr, {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.DATE,
        eventType: EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: inputMethod
        }
      });
    }

    if (commitMethod) {
      addAnalytics(state, tr, {
        eventType: EVENT_TYPE.TRACK,
        action: ACTION.COMMITTED,
        actionSubject: ACTION_SUBJECT.DATE,
        attributes: {
          commitMethod: commitMethod,
          isValid: date !== undefined,
          isToday: isToday(date)
        }
      });
    }

    var _pluginKey$getState3 = pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState3.showDatePickerAt;

    if (!showDatePickerAt) {
      var dateNode = schema.nodes.date.createChecked({
        timestamp: timestamp
      });
      var textNode = state.schema.text(' ');
      var fragment = Fragment.fromArray([dateNode, textNode]);
      var _state$selection = state.selection,
          from = _state$selection.from,
          to = _state$selection.to;
      var insertable = canInsert(tr.selection.$from, fragment);

      if (!insertable) {
        var parentSelection = NodeSelection.create(tr.doc, tr.selection.from - tr.selection.$anchor.parentOffset - 1);
        tr.insert(parentSelection.to, fragment).setSelection(NodeSelection.create(tr.doc, parentSelection.to + 1));
      } else {
        tr.replaceWith(from, to, fragment).setSelection(NodeSelection.create(tr.doc, from));
      }

      if (dispatch) {
        dispatch(tr.scrollIntoView().setMeta(pluginKey, {
          isNew: true
        }));
      }

      return true;
    }

    if (state.doc.nodeAt(showDatePickerAt)) {
      if (enterPressed) {
        // Setting selection to outside the date node causes showDatePickerAt
        // to be set to null by the PM plugin (onSelectionChanged), which will
        // immediately close the datepicker once a valid date is typed in.
        // Adding this check forces it to stay open until the user presses Enter.
        tr = tr.setSelection(Selection.near(tr.doc.resolve(showDatePickerAt + 2)));
      }

      tr = tr.setNodeMarkup(showDatePickerAt, schema.nodes.date, {
        timestamp: timestamp
      }).setMeta(pluginKey, {
        isNew: false
      }).scrollIntoView();

      if (!enterPressed) {
        tr = tr.setSelection(NodeSelection.create(tr.doc, showDatePickerAt));
      }

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};
export var setDatePickerAt = function setDatePickerAt(showDatePickerAt) {
  return function (state, dispatch) {
    dispatch(state.tr.setMeta(pluginKey, {
      showDatePickerAt: showDatePickerAt
    }));
    return true;
  };
};
export var closeDatePicker = function closeDatePicker() {
  return function (state, dispatch) {
    var _pluginKey$getState4 = pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState4.showDatePickerAt;

    if (!dispatch) {
      return false;
    }

    var tr = showDatePickerAt ? state.tr.setMeta(pluginKey, {
      showDatePickerAt: null,
      isNew: false
    }).setSelection(Selection.near(state.tr.doc.resolve(showDatePickerAt + 2))) : state.tr.setMeta(pluginKey, {
      isNew: false
    });
    dispatch(tr);
    return false;
  };
};
export var closeDatePickerWithAnalytics = function closeDatePickerWithAnalytics(_ref) {
  var date = _ref.date;
  return withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.COMMITTED,
    actionSubject: ACTION_SUBJECT.DATE,
    attributes: {
      commitMethod: INPUT_METHOD.BLUR,
      isValid: date !== undefined,
      isToday: isToday(date)
    }
  })(closeDatePicker());
};
export var openDatePicker = function openDatePicker() {
  return function (state, dispatch) {
    var $from = state.selection.$from;
    var node = state.doc.nodeAt($from.pos);

    if (node && node.type.name === state.schema.nodes.date.name) {
      var showDatePickerAt = $from.pos;

      if (dispatch) {
        dispatch(state.tr.setMeta(pluginKey, {
          showDatePickerAt: showDatePickerAt
        }).setSelection(NodeSelection.create(state.doc, showDatePickerAt)));
      }
    }

    return false;
  };
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setDatePickerAt = exports.openDatePicker = exports.insertDate = exports.focusDateInput = exports.deleteDate = exports.createDate = exports.closeDatePickerWithAnalytics = exports.closeDatePicker = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorModel = require("prosemirror-model");

var _utils = require("@atlaskit/editor-common/utils");

var _pluginKey = require("./pm-plugins/plugin-key");

var _analytics = require("../analytics");

var _internal = require("./utils/internal");

var _prosemirrorUtils = require("prosemirror-utils");

var createDate = function createDate(isQuickInsertAction) {
  return function (insert, state) {
    var dateNode = state.schema.nodes.date.createChecked({
      timestamp: (0, _utils.todayTimestampInUTC)()
    });
    var space = state.schema.text(' ');
    var tr = insert(_prosemirrorModel.Fragment.from([dateNode, space]), {
      selectInlineNode: true
    });
    var newPluginState = {
      isQuickInsertAction: isQuickInsertAction,
      showDatePickerAt: tr.selection.from,
      isNew: true,
      isDateEmpty: false,
      focusDateInput: false
    };
    return tr.setMeta(_pluginKey.pluginKey, newPluginState);
  };
};
/** Delete the date and close the datepicker */


exports.createDate = createDate;

var deleteDate = function deleteDate() {
  return function (state, dispatch) {
    var _pluginKey$getState = _pluginKey.pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState.showDatePickerAt;

    if (showDatePickerAt === null) {
      return false;
    }

    var tr = state.tr.delete(showDatePickerAt, showDatePickerAt + 1).setMeta(_pluginKey.pluginKey, {
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


exports.deleteDate = deleteDate;

var focusDateInput = function focusDateInput() {
  return function (state, dispatch) {
    var _pluginKey$getState2 = _pluginKey.pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState2.showDatePickerAt;

    if (showDatePickerAt === null) {
      return false;
    }

    if (!dispatch) {
      return false;
    }

    var tr = state.tr.setMeta(_pluginKey.pluginKey, {
      focusDateInput: true
    });
    dispatch(tr);
    return true;
  };
};

exports.focusDateInput = focusDateInput;

var insertDate = function insertDate(date, inputMethod, commitMethod) {
  var enterPressed = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  return function (state, dispatch) {
    var schema = state.schema;
    var timestamp;

    if (date) {
      timestamp = Date.UTC(date.year, date.month - 1, date.day).toString();
    } else {
      timestamp = (0, _utils.todayTimestampInUTC)();
    }

    var tr = state.tr;

    if (inputMethod) {
      (0, _analytics.addAnalytics)(state, tr, {
        action: _analytics.ACTION.INSERTED,
        actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.DATE,
        eventType: _analytics.EVENT_TYPE.TRACK,
        attributes: {
          inputMethod: inputMethod
        }
      });
    }

    if (commitMethod) {
      (0, _analytics.addAnalytics)(state, tr, {
        eventType: _analytics.EVENT_TYPE.TRACK,
        action: _analytics.ACTION.COMMITTED,
        actionSubject: _analytics.ACTION_SUBJECT.DATE,
        attributes: {
          commitMethod: commitMethod,
          isValid: date !== undefined,
          isToday: (0, _internal.isToday)(date)
        }
      });
    }

    var _pluginKey$getState3 = _pluginKey.pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState3.showDatePickerAt;

    if (!showDatePickerAt) {
      var dateNode = schema.nodes.date.createChecked({
        timestamp: timestamp
      });
      var textNode = state.schema.text(' ');

      var fragment = _prosemirrorModel.Fragment.fromArray([dateNode, textNode]);

      var _state$selection = state.selection,
          from = _state$selection.from,
          to = _state$selection.to;
      var insertable = (0, _prosemirrorUtils.canInsert)(tr.selection.$from, fragment);

      if (!insertable) {
        var parentSelection = _prosemirrorState.NodeSelection.create(tr.doc, tr.selection.from - tr.selection.$anchor.parentOffset - 1);

        tr.insert(parentSelection.to, fragment).setSelection(_prosemirrorState.NodeSelection.create(tr.doc, parentSelection.to + 1));
      } else {
        tr.replaceWith(from, to, fragment).setSelection(_prosemirrorState.NodeSelection.create(tr.doc, from));
      }

      if (dispatch) {
        dispatch(tr.scrollIntoView().setMeta(_pluginKey.pluginKey, {
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
        tr = tr.setSelection(_prosemirrorState.Selection.near(tr.doc.resolve(showDatePickerAt + 2)));
      }

      tr = tr.setNodeMarkup(showDatePickerAt, schema.nodes.date, {
        timestamp: timestamp
      }).setMeta(_pluginKey.pluginKey, {
        isNew: false
      }).scrollIntoView();

      if (!enterPressed) {
        tr = tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, showDatePickerAt));
      }

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    return false;
  };
};

exports.insertDate = insertDate;

var setDatePickerAt = function setDatePickerAt(showDatePickerAt) {
  return function (state, dispatch) {
    dispatch(state.tr.setMeta(_pluginKey.pluginKey, {
      showDatePickerAt: showDatePickerAt
    }));
    return true;
  };
};

exports.setDatePickerAt = setDatePickerAt;

var closeDatePicker = function closeDatePicker() {
  return function (state, dispatch) {
    var _pluginKey$getState4 = _pluginKey.pluginKey.getState(state),
        showDatePickerAt = _pluginKey$getState4.showDatePickerAt;

    if (!dispatch) {
      return false;
    }

    var tr = showDatePickerAt ? state.tr.setMeta(_pluginKey.pluginKey, {
      showDatePickerAt: null,
      isNew: false
    }).setSelection(_prosemirrorState.Selection.near(state.tr.doc.resolve(showDatePickerAt + 2))) : state.tr.setMeta(_pluginKey.pluginKey, {
      isNew: false
    });
    dispatch(tr);
    return false;
  };
};

exports.closeDatePicker = closeDatePicker;

var closeDatePickerWithAnalytics = function closeDatePickerWithAnalytics(_ref) {
  var date = _ref.date;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.TRACK,
    action: _analytics.ACTION.COMMITTED,
    actionSubject: _analytics.ACTION_SUBJECT.DATE,
    attributes: {
      commitMethod: _analytics.INPUT_METHOD.BLUR,
      isValid: date !== undefined,
      isToday: (0, _internal.isToday)(date)
    }
  })(closeDatePicker());
};

exports.closeDatePickerWithAnalytics = closeDatePickerWithAnalytics;

var openDatePicker = function openDatePicker() {
  return function (state, dispatch) {
    var $from = state.selection.$from;
    var node = state.doc.nodeAt($from.pos);

    if (node && node.type.name === state.schema.nodes.date.name) {
      var showDatePickerAt = $from.pos;

      if (dispatch) {
        dispatch(state.tr.setMeta(_pluginKey.pluginKey, {
          showDatePickerAt: showDatePickerAt
        }).setSelection(_prosemirrorState.NodeSelection.create(state.doc, showDatePickerAt)));
      }
    }

    return false;
  };
};

exports.openDatePicker = openDatePicker;
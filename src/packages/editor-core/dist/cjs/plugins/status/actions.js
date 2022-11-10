"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatusWithAnalytics = exports.updateStatus = exports.setStatusPickerAt = exports.removeStatus = exports.createStatus = exports.commitStatusPicker = exports.DEFAULT_STATUS = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _analytics = require("../analytics");

var _pluginKey = require("./plugin-key");

var _prosemirrorUtils = require("prosemirror-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var DEFAULT_STATUS = {
  text: '',
  color: 'neutral'
};
exports.DEFAULT_STATUS = DEFAULT_STATUS;

var createStatus = function createStatus() {
  var showStatusPickerAtOffset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  return function (insert, state) {
    var statusNode = state.schema.nodes.status.createChecked(_objectSpread(_objectSpread({}, DEFAULT_STATUS), {}, {
      localId: _adfSchema.uuid.generate()
    }));
    var space = state.schema.text(' ');
    var tr = insert(_prosemirrorModel.Fragment.from([statusNode, space]), {
      selectInlineNode: true
    });
    var showStatusPickerAt = tr.selection.from + showStatusPickerAtOffset;
    return tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, showStatusPickerAt)).setMeta(_pluginKey.pluginKey, {
      showStatusPickerAt: showStatusPickerAt,
      isNew: true
    });
  };
};

exports.createStatus = createStatus;

var updateStatus = function updateStatus(status) {
  return function (state, dispatch) {
    var schema = state.schema;
    var selectedStatus = status ? Object.assign(status, {
      text: status.text.trim(),
      localId: status.localId || _adfSchema.uuid.generate()
    }) : status;

    var statusProps = _objectSpread(_objectSpread({}, DEFAULT_STATUS), selectedStatus);

    var tr = state.tr;

    var _pluginKey$getState = _pluginKey.pluginKey.getState(state),
        showStatusPickerAt = _pluginKey$getState.showStatusPickerAt;

    if (!showStatusPickerAt) {
      // Same behaviour as quick insert (used in createStatus)
      var statusNode = schema.nodes.status.createChecked(statusProps);

      var fragment = _prosemirrorModel.Fragment.fromArray([statusNode, state.schema.text(' ')]);

      var insertable = (0, _prosemirrorUtils.canInsert)(tr.selection.$from, fragment);

      if (!insertable) {
        var parentSelection = _prosemirrorState.NodeSelection.create(tr.doc, tr.selection.from - tr.selection.$anchor.parentOffset - 1);

        tr.insert(parentSelection.to, fragment).setSelection(_prosemirrorState.NodeSelection.create(tr.doc, parentSelection.to + 1));
      } else {
        tr.insert(tr.selection.from, fragment).setSelection(_prosemirrorState.NodeSelection.create(tr.doc, tr.selection.from - fragment.size));
      }

      tr.setMeta(_pluginKey.pluginKey, {
        showStatusPickerAt: tr.selection.from,
        isNew: true
      }).scrollIntoView();

      if (dispatch) {
        dispatch(tr);
      }

      return true;
    }

    if (state.doc.nodeAt(showStatusPickerAt)) {
      tr.setNodeMarkup(showStatusPickerAt, schema.nodes.status, statusProps).setSelection(_prosemirrorState.NodeSelection.create(tr.doc, showStatusPickerAt)).setMeta(_pluginKey.pluginKey, {
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

exports.updateStatus = updateStatus;

var updateStatusWithAnalytics = function updateStatusWithAnalytics(inputMethod, status) {
  return (0, _analytics.withAnalytics)({
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.STATUS,
    attributes: {
      inputMethod: inputMethod
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  })(updateStatus(status));
};

exports.updateStatusWithAnalytics = updateStatusWithAnalytics;

var setStatusPickerAt = function setStatusPickerAt(showStatusPickerAt) {
  return function (state, dispatch) {
    dispatch(state.tr.setMeta(_pluginKey.pluginKey, {
      showStatusPickerAt: showStatusPickerAt,
      isNew: false
    }));
    return true;
  };
};

exports.setStatusPickerAt = setStatusPickerAt;

var removeStatus = function removeStatus(showStatusPickerAt) {
  return function (state, dispatch) {
    var tr = state.tr;
    tr.replace(showStatusPickerAt, showStatusPickerAt + 1);

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.removeStatus = removeStatus;

var commitStatusPicker = function commitStatusPicker() {
  return function (editorView) {
    var state = editorView.state,
        dispatch = editorView.dispatch;

    var _pluginKey$getState2 = _pluginKey.pluginKey.getState(state),
        showStatusPickerAt = _pluginKey$getState2.showStatusPickerAt;

    if (!showStatusPickerAt) {
      return;
    }

    var statusNode = state.tr.doc.nodeAt(showStatusPickerAt);

    if (!statusNode) {
      return;
    }

    var tr = state.tr;
    tr = tr.setMeta(_pluginKey.pluginKey, {
      showStatusPickerAt: null,
      isNew: false
    });

    if (statusNode.attrs.text) {
      // still has content - keep content
      // move selection after status if selection did not change
      if (tr.selection.from === showStatusPickerAt) {
        tr = tr.setSelection(_prosemirrorState.Selection.near(state.tr.doc.resolve(showStatusPickerAt + 2)));
      }
    } else {
      // no content - remove node
      tr = tr.delete(showStatusPickerAt, showStatusPickerAt + 1);
    }

    dispatch(tr);
    editorView.focus();
  };
};

exports.commitStatusPicker = commitStatusPicker;
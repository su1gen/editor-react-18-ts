"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExpandTitle = exports.toggleExpandExpanded = exports.setSelectionInsideExpand = exports.setExpandRef = exports.insertExpand = exports.focusTitle = exports.deleteExpandAtPos = exports.deleteExpand = exports.createExpandNode = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("@atlaskit/editor-tables/utils");

var _analytics = require("../analytics");

var _gapCursorSelection = require("../selection/gap-cursor-selection");

var _utils2 = require("./utils");

var _pluginFactory = require("./pm-plugins/plugin-factory");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var setExpandRef = function setExpandRef(ref) {
  return (0, _pluginFactory.createCommand)({
    type: 'SET_EXPAND_REF',
    data: {
      ref: ref
    }
  }, function (tr) {
    return tr.setMeta('addToHistory', false);
  });
};

exports.setExpandRef = setExpandRef;

var deleteExpandAtPos = function deleteExpandAtPos(expandNodePos, expandNode) {
  return function (state, dispatch) {
    if (!expandNode || isNaN(expandNodePos)) {
      return false;
    }

    var payload = {
      action: _analytics.ACTION.DELETED,
      actionSubject: expandNode.type === state.schema.nodes.expand ? _analytics.ACTION_SUBJECT.EXPAND : _analytics.ACTION_SUBJECT.NESTED_EXPAND,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.TOOLBAR
      },
      eventType: _analytics.EVENT_TYPE.TRACK
    };

    if (expandNode && dispatch) {
      dispatch((0, _analytics.addAnalytics)(state, state.tr.delete(expandNodePos, expandNodePos + expandNode.nodeSize), payload));
    }

    return true;
  };
};

exports.deleteExpandAtPos = deleteExpandAtPos;

var deleteExpand = function deleteExpand() {
  return function (state, dispatch) {
    var expandNode = (0, _utils2.findExpand)(state);

    if (!expandNode) {
      return false;
    }

    return deleteExpandAtPos(expandNode.pos, expandNode.node)(state, dispatch);
  };
};

exports.deleteExpand = deleteExpand;

var updateExpandTitle = function updateExpandTitle(title, pos, nodeType) {
  return function (state, dispatch) {
    var node = state.doc.nodeAt(pos);

    if (node && node.type === nodeType && dispatch) {
      var tr = state.tr;
      tr.setNodeMarkup(pos, node.type, _objectSpread(_objectSpread({}, node.attrs), {}, {
        title: title
      }), node.marks);
      dispatch(tr);
    }

    return true;
  };
};

exports.updateExpandTitle = updateExpandTitle;

var toggleExpandExpanded = function toggleExpandExpanded(pos, nodeType) {
  return function (state, dispatch) {
    var node = state.doc.nodeAt(pos);

    if (node && node.type === nodeType && dispatch) {
      var tr = state.tr;
      var isExpandedNext = !node.attrs.__expanded;
      tr.setNodeMarkup(pos, node.type, _objectSpread(_objectSpread({}, node.attrs), {}, {
        __expanded: isExpandedNext
      }), node.marks); // If we're going to collapse the expand and our cursor is currently inside
      // Move to a right gap cursor, if the toolbar is interacted (or an API),
      // it will insert below rather than inside (which will be invisible).

      if (isExpandedNext === false && (0, _utils2.findExpand)(state)) {
        tr.setSelection(new _gapCursorSelection.GapCursorSelection(tr.doc.resolve(pos + node.nodeSize), _gapCursorSelection.Side.RIGHT));
      } // log when people open/close expands
      // TODO: ED-8523 make platform/mode global attributes?


      var payload = {
        action: _analytics.ACTION.TOGGLE_EXPAND,
        actionSubject: nodeType === state.schema.nodes.expand ? _analytics.ACTION_SUBJECT.EXPAND : _analytics.ACTION_SUBJECT.NESTED_EXPAND,
        attributes: {
          platform: _analytics.PLATFORMS.WEB,
          mode: _analytics.MODE.EDITOR,
          expanded: isExpandedNext
        },
        eventType: _analytics.EVENT_TYPE.TRACK
      }; // `isRemote` meta prevents this step from being
      // sync'd between sessions in collab edit

      dispatch((0, _analytics.addAnalytics)(state, tr.setMeta('isRemote', true), payload));
    }

    return true;
  };
};

exports.toggleExpandExpanded = toggleExpandExpanded;

var createExpandNode = function createExpandNode(state) {
  var _state$schema$nodes = state.schema.nodes,
      expand = _state$schema$nodes.expand,
      nestedExpand = _state$schema$nodes.nestedExpand;
  var expandType = (0, _utils.findTable)(state.selection) ? nestedExpand : expand;
  return expandType.createAndFill({});
};

exports.createExpandNode = createExpandNode;

var insertExpand = function insertExpand(state, dispatch) {
  var expandNode = createExpandNode(state);
  var payload = {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: expandNode.type === state.schema.nodes.expand ? _analytics.ACTION_SUBJECT_ID.EXPAND : _analytics.ACTION_SUBJECT_ID.NESTED_EXPAND,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.INSERT_MENU
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };

  if (dispatch) {
    dispatch((0, _analytics.addAnalytics)(state, (0, _prosemirrorUtils.safeInsert)(expandNode)(state.tr).scrollIntoView(), payload));
  }

  return true;
};

exports.insertExpand = insertExpand;

var focusTitle = function focusTitle(pos) {
  return function (state, dispatch, editorView) {
    if (editorView) {
      var dom = editorView.domAtPos(pos);
      var expandWrapper = dom.node.parentElement;

      if (expandWrapper) {
        setSelectionInsideExpand(state, dispatch, editorView);
        var input = expandWrapper.querySelector('input');

        if (input) {
          input.focus();
          return true;
        }
      }
    }

    return false;
  };
}; // Used to clear any node or cell selection when expand title is focused


exports.focusTitle = focusTitle;

var setSelectionInsideExpand = function setSelectionInsideExpand(state, dispatch, editorView) {
  var tr = state.tr,
      doc = state.doc,
      selection = state.selection;

  if (editorView && !editorView.hasFocus()) {
    editorView.focus();
  }

  if (dispatch) {
    dispatch(tr.setSelection(_prosemirrorState.TextSelection.create(doc, selection.from)));
  }

  return true;
};

exports.setSelectionInsideExpand = setSelectionInsideExpand;
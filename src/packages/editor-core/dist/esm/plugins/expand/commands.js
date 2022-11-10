import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { TextSelection } from 'prosemirror-state';
import { safeInsert } from 'prosemirror-utils';
import { findTable } from '@atlaskit/editor-tables/utils';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD, EVENT_TYPE, PLATFORMS, MODE } from '../analytics';
import { GapCursorSelection, Side } from '../selection/gap-cursor-selection';
import { findExpand } from './utils';
import { createCommand } from './pm-plugins/plugin-factory';
export var setExpandRef = function setExpandRef(ref) {
  return createCommand({
    type: 'SET_EXPAND_REF',
    data: {
      ref: ref
    }
  }, function (tr) {
    return tr.setMeta('addToHistory', false);
  });
};
export var deleteExpandAtPos = function deleteExpandAtPos(expandNodePos, expandNode) {
  return function (state, dispatch) {
    if (!expandNode || isNaN(expandNodePos)) {
      return false;
    }

    var payload = {
      action: ACTION.DELETED,
      actionSubject: expandNode.type === state.schema.nodes.expand ? ACTION_SUBJECT.EXPAND : ACTION_SUBJECT.NESTED_EXPAND,
      attributes: {
        inputMethod: INPUT_METHOD.TOOLBAR
      },
      eventType: EVENT_TYPE.TRACK
    };

    if (expandNode && dispatch) {
      dispatch(addAnalytics(state, state.tr.delete(expandNodePos, expandNodePos + expandNode.nodeSize), payload));
    }

    return true;
  };
};
export var deleteExpand = function deleteExpand() {
  return function (state, dispatch) {
    var expandNode = findExpand(state);

    if (!expandNode) {
      return false;
    }

    return deleteExpandAtPos(expandNode.pos, expandNode.node)(state, dispatch);
  };
};
export var updateExpandTitle = function updateExpandTitle(title, pos, nodeType) {
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
export var toggleExpandExpanded = function toggleExpandExpanded(pos, nodeType) {
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

      if (isExpandedNext === false && findExpand(state)) {
        tr.setSelection(new GapCursorSelection(tr.doc.resolve(pos + node.nodeSize), Side.RIGHT));
      } // log when people open/close expands
      // TODO: ED-8523 make platform/mode global attributes?


      var payload = {
        action: ACTION.TOGGLE_EXPAND,
        actionSubject: nodeType === state.schema.nodes.expand ? ACTION_SUBJECT.EXPAND : ACTION_SUBJECT.NESTED_EXPAND,
        attributes: {
          platform: PLATFORMS.WEB,
          mode: MODE.EDITOR,
          expanded: isExpandedNext
        },
        eventType: EVENT_TYPE.TRACK
      }; // `isRemote` meta prevents this step from being
      // sync'd between sessions in collab edit

      dispatch(addAnalytics(state, tr.setMeta('isRemote', true), payload));
    }

    return true;
  };
};
export var createExpandNode = function createExpandNode(state) {
  var _state$schema$nodes = state.schema.nodes,
      expand = _state$schema$nodes.expand,
      nestedExpand = _state$schema$nodes.nestedExpand;
  var expandType = findTable(state.selection) ? nestedExpand : expand;
  return expandType.createAndFill({});
};
export var insertExpand = function insertExpand(state, dispatch) {
  var expandNode = createExpandNode(state);
  var payload = {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: expandNode.type === state.schema.nodes.expand ? ACTION_SUBJECT_ID.EXPAND : ACTION_SUBJECT_ID.NESTED_EXPAND,
    attributes: {
      inputMethod: INPUT_METHOD.INSERT_MENU
    },
    eventType: EVENT_TYPE.TRACK
  };

  if (dispatch) {
    dispatch(addAnalytics(state, safeInsert(expandNode)(state.tr).scrollIntoView(), payload));
  }

  return true;
};
export var focusTitle = function focusTitle(pos) {
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

export var setSelectionInsideExpand = function setSelectionInsideExpand(state, dispatch, editorView) {
  var tr = state.tr,
      doc = state.doc,
      selection = state.selection;

  if (editorView && !editorView.hasFocus()) {
    editorView.focus();
  }

  if (dispatch) {
    dispatch(tr.setSelection(TextSelection.create(doc, selection.from)));
  }

  return true;
};
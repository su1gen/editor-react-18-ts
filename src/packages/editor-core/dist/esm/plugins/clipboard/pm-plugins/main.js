import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TextSelection } from 'prosemirror-state';
import { clipboardPluginKey } from '../plugin-key';
import { getNodeSelectionAnalyticsPayload, getAllSelectionAnalyticsPayload, getRangeSelectionAnalyticsPayload, getCellSelectionAnalyticsPayload } from '../../selection/utils';
import { EVENT_TYPE, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../../analytics/types/enums';
import { DOMSerializer } from 'prosemirror-model';
import { findParentNodeOfType } from 'prosemirror-utils';
import { Fragment } from 'prosemirror-model';
export var createPlugin = function createPlugin(_ref) {
  var dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
      schema = _ref.schema;
  var editorView;

  var getEditorView = function getEditorView() {
    return editorView;
  };

  return new SafePlugin({
    key: clipboardPluginKey,
    view: function view(_view) {
      editorView = _view;
      return {
        update: function update(view) {
          editorView = view;
        }
      };
    },
    props: {
      handleDOMEvents: {
        cut: function cut(view) {
          return sendClipboardAnalytics(view, dispatchAnalyticsEvent, ACTION.CUT);
        },
        copy: function copy(view) {
          return sendClipboardAnalytics(view, dispatchAnalyticsEvent, ACTION.COPIED);
        }
      },
      clipboardSerializer: createClipboardSerializer(schema, getEditorView)
    }
  });
};
/**
 * Overrides Prosemirror's default clipboardSerializer, in order to fix table row copy/paste bug raised in ED-13003.
 * This allows us to store the original table’s attributes on the new table that the row is wrapped with when it is being copied.
 * e.g. keeping the layout on a row that is copied.
 * We store the default serializer in order to call it after we handle the table row case.
 */

export var createClipboardSerializer = function createClipboardSerializer(schema, getEditorView) {
  var oldSerializer = DOMSerializer.fromSchema(schema);
  var newSerializer = new DOMSerializer(oldSerializer.nodes, oldSerializer.marks);
  var originalSerializeFragment = newSerializer.serializeFragment.bind(newSerializer);

  newSerializer.serializeFragment = function (content) {
    var _content$firstChild;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var target = arguments.length > 2 ? arguments[2] : undefined;
    var editorView = getEditorView();
    var selection = editorView.state.selection; // We do not need to handle when a user copies a tableRow + other content.
    // In that scenario it already wraps the Row with correct Table and attributes.

    if (!options.tableWrapperExists) {
      var i = 0;

      while (i < content.childCount) {
        var _content$maybeChild;

        if (((_content$maybeChild = content.maybeChild(i)) === null || _content$maybeChild === void 0 ? void 0 : _content$maybeChild.type.name) === 'table') {
          options.tableWrapperExists = true;
          break;
        }

        i++;
      }
    } // When the content being copied includes a tableRow that is not already wrapped with a table,
    // We will wrap it with one ourselves, while preserving the parent table's attributes.


    if (((_content$firstChild = content.firstChild) === null || _content$firstChild === void 0 ? void 0 : _content$firstChild.type.name) === 'tableRow' && !options.tableWrapperExists) {
      // We only want 1 table wrapping the rows.
      // tableWrapperExist is a custom prop added solely for the purposes of this recursive algorithm.
      // The function is recursively called for each node in the tree captured in the fragment.
      // For recursive logic see the bind call above and the prosemirror-model (https://github.com/ProseMirror/prosemirror-model/blob/master/src/to_dom.js#L44
      // and https://github.com/ProseMirror/prosemirror-model/blob/master/src/to_dom.js#L87)
      options.tableWrapperExists = true;
      var parentTable = findParentNodeOfType(schema.nodes.table)(selection);
      var attributes = parentTable === null || parentTable === void 0 ? void 0 : parentTable.node.attrs;
      var newTable = schema.nodes.table;
      var newTableNode = newTable.createChecked(_objectSpread({}, attributes), content);
      var newContent = Fragment.from(newTableNode); // Pass updated content into original ProseMirror serializeFragment function.
      // Currently incorrectly typed in @Types. See this GitHub thread: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57668
      //@ts-ignore

      return originalSerializeFragment(newContent, options, target);
    } // If we're not copying any rows, just run default serializeFragment function.
    // Currently incorrectly typed in @Types. See this GitHub thread: https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57668
    //@ts-ignore


    return originalSerializeFragment(content, options, target);
  };

  return newSerializer;
};
export var sendClipboardAnalytics = function sendClipboardAnalytics(view, dispatchAnalyticsEvent, action) {
  var clipboardAnalyticsPayload = getAnalyticsPayload(view.state, action);

  if (clipboardAnalyticsPayload) {
    dispatchAnalyticsEvent(clipboardAnalyticsPayload);
  } // return false so we don't block any other plugins' cut or copy handlers
  // from running just because we are sending an analytics event


  return false;
};
export var getAnalyticsPayload = function getAnalyticsPayload(state, action) {
  var selection = state.selection,
      doc = state.doc;
  var selectionAnalyticsPayload = getNodeSelectionAnalyticsPayload(selection) || getRangeSelectionAnalyticsPayload(selection, doc) || getAllSelectionAnalyticsPayload(selection) || getCellSelectionAnalyticsPayload(state);

  if (selectionAnalyticsPayload) {
    var selectionActionSubjectId = selectionAnalyticsPayload.actionSubjectId;
    var content = [];

    switch (selectionActionSubjectId) {
      case ACTION_SUBJECT_ID.NODE:
        content.push(selectionAnalyticsPayload.attributes.node);
        break;

      case ACTION_SUBJECT_ID.RANGE:
        content.push.apply(content, _toConsumableArray(selectionAnalyticsPayload.attributes.nodes));
        break;

      case ACTION_SUBJECT_ID.ALL:
        content.push('all');
        break;

      case ACTION_SUBJECT_ID.CELL:
        {
          var _ref2 = selectionAnalyticsPayload.attributes,
              selectedCells = _ref2.selectedCells;
          content.push.apply(content, _toConsumableArray(Array(selectedCells).fill('tableCell')));
          break;
        }
    }

    return {
      eventType: EVENT_TYPE.TRACK,
      action: action,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      attributes: {
        content: content
      }
    };
  }

  if (selection instanceof TextSelection && selection.$cursor) {
    return {
      eventType: EVENT_TYPE.TRACK,
      action: action,
      actionSubject: ACTION_SUBJECT.DOCUMENT,
      attributes: {
        content: ['caret']
      }
    };
  }
};
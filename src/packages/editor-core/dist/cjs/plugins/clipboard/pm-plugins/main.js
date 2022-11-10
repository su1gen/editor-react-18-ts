"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendClipboardAnalytics = exports.getAnalyticsPayload = exports.createPlugin = exports.createClipboardSerializer = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _pluginKey = require("../plugin-key");

var _utils = require("../../selection/utils");

var _enums = require("../../analytics/types/enums");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorUtils = require("prosemirror-utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createPlugin = function createPlugin(_ref) {
  var dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
      schema = _ref.schema;
  var editorView;

  var getEditorView = function getEditorView() {
    return editorView;
  };

  return new _safePlugin.SafePlugin({
    key: _pluginKey.clipboardPluginKey,
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
          return sendClipboardAnalytics(view, dispatchAnalyticsEvent, _enums.ACTION.CUT);
        },
        copy: function copy(view) {
          return sendClipboardAnalytics(view, dispatchAnalyticsEvent, _enums.ACTION.COPIED);
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


exports.createPlugin = createPlugin;

var createClipboardSerializer = function createClipboardSerializer(schema, getEditorView) {
  var oldSerializer = _prosemirrorModel.DOMSerializer.fromSchema(schema);

  var newSerializer = new _prosemirrorModel.DOMSerializer(oldSerializer.nodes, oldSerializer.marks);
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
      var parentTable = (0, _prosemirrorUtils.findParentNodeOfType)(schema.nodes.table)(selection);
      var attributes = parentTable === null || parentTable === void 0 ? void 0 : parentTable.node.attrs;
      var newTable = schema.nodes.table;
      var newTableNode = newTable.createChecked(_objectSpread({}, attributes), content);

      var newContent = _prosemirrorModel.Fragment.from(newTableNode); // Pass updated content into original ProseMirror serializeFragment function.
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

exports.createClipboardSerializer = createClipboardSerializer;

var sendClipboardAnalytics = function sendClipboardAnalytics(view, dispatchAnalyticsEvent, action) {
  var clipboardAnalyticsPayload = getAnalyticsPayload(view.state, action);

  if (clipboardAnalyticsPayload) {
    dispatchAnalyticsEvent(clipboardAnalyticsPayload);
  } // return false so we don't block any other plugins' cut or copy handlers
  // from running just because we are sending an analytics event


  return false;
};

exports.sendClipboardAnalytics = sendClipboardAnalytics;

var getAnalyticsPayload = function getAnalyticsPayload(state, action) {
  var selection = state.selection,
      doc = state.doc;
  var selectionAnalyticsPayload = (0, _utils.getNodeSelectionAnalyticsPayload)(selection) || (0, _utils.getRangeSelectionAnalyticsPayload)(selection, doc) || (0, _utils.getAllSelectionAnalyticsPayload)(selection) || (0, _utils.getCellSelectionAnalyticsPayload)(state);

  if (selectionAnalyticsPayload) {
    var selectionActionSubjectId = selectionAnalyticsPayload.actionSubjectId;
    var content = [];

    switch (selectionActionSubjectId) {
      case _enums.ACTION_SUBJECT_ID.NODE:
        content.push(selectionAnalyticsPayload.attributes.node);
        break;

      case _enums.ACTION_SUBJECT_ID.RANGE:
        content.push.apply(content, (0, _toConsumableArray2.default)(selectionAnalyticsPayload.attributes.nodes));
        break;

      case _enums.ACTION_SUBJECT_ID.ALL:
        content.push('all');
        break;

      case _enums.ACTION_SUBJECT_ID.CELL:
        {
          var _ref2 = selectionAnalyticsPayload.attributes,
              selectedCells = _ref2.selectedCells;
          content.push.apply(content, (0, _toConsumableArray2.default)(Array(selectedCells).fill('tableCell')));
          break;
        }
    }

    return {
      eventType: _enums.EVENT_TYPE.TRACK,
      action: action,
      actionSubject: _enums.ACTION_SUBJECT.DOCUMENT,
      attributes: {
        content: content
      }
    };
  }

  if (selection instanceof _prosemirrorState.TextSelection && selection.$cursor) {
    return {
      eventType: _enums.EVENT_TYPE.TRACK,
      action: action,
      actionSubject: _enums.ACTION_SUBJECT.DOCUMENT,
      attributes: {
        content: ['caret']
      }
    };
  }
};

exports.getAnalyticsPayload = getAnalyticsPayload;
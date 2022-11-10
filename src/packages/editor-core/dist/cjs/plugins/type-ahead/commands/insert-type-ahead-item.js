"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertTypeAheadItem = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _prosemirrorModel = require("prosemirror-model");

var _steps = require("@atlaskit/adf-schema/steps");

var _prosemirrorHistory = require("prosemirror-history");

var _key = require("../pm-plugins/key");

var _insertUtils = require("../insert-utils");

var _statsModifier = require("../stats-modifier");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _actions = require("../pm-plugins/actions");

var _closeTypeAhead = require("../transforms/close-type-ahead");

var _utils = require("../utils");

var validateNode = function validateNode(_ref) {
  var schema = _ref.schema,
      maybeNode = _ref.maybeNode;

  if (!maybeNode) {
    return null;
  }

  if (maybeNode instanceof _prosemirrorModel.Node || maybeNode instanceof _prosemirrorModel.Fragment) {
    return maybeNode;
  }

  if (typeof maybeNode === 'string') {
    return schema.text(maybeNode);
  }

  try {
    return _prosemirrorModel.Node.fromJSON(schema, maybeNode);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return null;
  }
};

var createInsertCallback = function createInsertCallback(_ref2) {
  var state = _ref2.editorState,
      handler = _ref2.handler,
      query = _ref2.query,
      mode = _ref2.mode,
      wasInsertedBySpace = _ref2.wasInsertedBySpace,
      selectedIndex = _ref2.selectedIndex,
      textStartPosition = _ref2.textStartPosition,
      textInserted = _ref2.textInserted;
  return function (maybeNode) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var tr = state.tr;
    var position = {
      start: textStartPosition,
      end: textStartPosition + (wasInsertedBySpace ? textInserted.length : 0)
    };
    var node = validateNode({
      schema: state.schema,
      maybeNode: maybeNode
    });

    if (!node) {
      (0, _closeTypeAhead.closeTypeAhead)(tr); // In this kind of situation we need to
      // delete the raw text query

      tr.delete(position.start, position.end);
      return tr;
    }

    node instanceof _prosemirrorModel.Node && node.isBlock ? (0, _insertUtils.insertBlockNode)({
      node: node,
      tr: tr,
      position: position
    }) : (0, _insertUtils.insertInlineNodeOrFragment)({
      maybeFragment: node,
      tr: tr,
      position: position,
      selectInlineNode: Boolean(opts.selectInlineNode)
    });
    (0, _prosemirrorHistory.closeHistory)(tr);

    if (wasInsertedBySpace) {
      return tr;
    }

    var config = {
      stage: _steps.InsertTypeAheadStages.INSERTING_ITEM,
      query: query,
      selectedIndex: selectedIndex,
      trigger: handler.trigger
    };
    tr.step(new _steps.InsertTypeAheadStep(config));
    return tr;
  };
};

var createDeleteRawTextCallback = function createDeleteRawTextCallback(_ref3) {
  var trigger = _ref3.trigger,
      selectedIndex = _ref3.selectedIndex,
      position = _ref3.position,
      query = _ref3.query,
      wasInsertedBySpace = _ref3.wasInsertedBySpace,
      insertItem = _ref3.insertItem;
  return function (newState) {
    var tr = newState.tr;
    (0, _prosemirrorHistory.closeHistory)(tr);

    if (!wasInsertedBySpace) {
      tr.delete(position.start, position.end);
      var config = {
        stage: _steps.InsertTypeAheadStages.DELETING_RAW_QUERY,
        selectedIndex: selectedIndex,
        query: query,
        trigger: trigger
      };
      tr.step(new _steps.InsertTypeAheadStep(config));
    }

    tr.setMeta(_key.pluginKey, {
      action: _actions.ACTIONS.INSERT_ITEM,
      params: insertItem
    });
    return tr;
  };
};

var insertTypeAheadItem = function insertTypeAheadItem(view) {
  return function (_ref4) {
    var item = _ref4.item,
        handler = _ref4.handler,
        mode = _ref4.mode,
        query = _ref4.query,
        sourceListItem = _ref4.sourceListItem;
    var pluginState = (0, _utils.getPluginState)(view.state);

    if (!pluginState) {
      return;
    }

    var stats = (pluginState.stats || new _statsModifier.StatsModifier()).serialize();
    var meta = {
      mode: mode,
      query: query,
      stats: stats,
      sourceListItem: sourceListItem
    };
    var tr = view.state.tr;
    var trigger = handler.trigger;
    var text = "".concat(trigger).concat(query);

    if (mode === _typeAhead.SelectItemMode.SPACE) {
      text = text.trim().concat(' ');
    }

    var selectedIndex = Math.max(sourceListItem.indexOf(item), 0);
    var wasInsertedBySpace = mode === _typeAhead.SelectItemMode.SPACE;
    var textStartPosition = tr.selection.from;

    var insertItem = function insertItem(newEditorSate) {
      var insertCallback = createInsertCallback({
        editorState: newEditorSate,
        query: query,
        mode: mode,
        handler: handler,
        wasInsertedBySpace: wasInsertedBySpace,
        selectedIndex: selectedIndex,
        textInserted: text,
        textStartPosition: textStartPosition
      });
      var wasInsertCallbackCalled = false; // Some wierd plugins doesn't call the insert item callback
      // For example, the link quick insert item
      // For those cases we need to make sure we are closing the typeahead

      var proxyHandler = {
        apply: function apply(target, _thisContext, argumentsList) {
          wasInsertCallbackCalled = true;
          return target.apply(void 0, (0, _toConsumableArray2.default)(argumentsList));
        }
      };
      var insertCallbackProxy = new Proxy(insertCallback, proxyHandler);
      var nextTr = handler.selectItem(newEditorSate, item, insertCallbackProxy, meta);

      if (!wasInsertCallbackCalled && nextTr) {
        (0, _prosemirrorHistory.closeHistory)(nextTr); // In some cases we need to re-open the typeahead
        // e.g.: addign mentions from the quick insert
        //
        // Today, the QuickInsert API doesn't have a tool
        // to help on this. So the code below will close the typeahead
        // only if there is no previous metadata about typeahead in the
        // next transaction

        if (!nextTr.getMeta(_key.pluginKey)) {
          (0, _closeTypeAhead.closeTypeAhead)(nextTr);
        }
      }

      return nextTr;
    };

    var position = {
      start: tr.selection.from,
      end: tr.selection.from + text.length
    };
    tr.setMeta(_key.pluginKey, {
      action: _actions.ACTIONS.INSERT_RAW_QUERY,
      params: createDeleteRawTextCallback({
        wasInsertedBySpace: wasInsertedBySpace,
        selectedIndex: selectedIndex,
        insertItem: insertItem,
        position: position,
        query: query,
        trigger: trigger
      })
    });
    tr.insertText(text);
    (0, _prosemirrorHistory.closeHistory)(tr);
    view.dispatch(tr);
    view.focus();
  };
};

exports.insertTypeAheadItem = insertTypeAheadItem;
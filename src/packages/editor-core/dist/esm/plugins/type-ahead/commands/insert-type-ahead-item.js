import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { Node as PMNode, Fragment } from 'prosemirror-model';
import { InsertTypeAheadStep, InsertTypeAheadStages } from '@atlaskit/adf-schema/steps';
import { closeHistory } from 'prosemirror-history';
import { pluginKey } from '../pm-plugins/key';
import { insertBlockNode, insertInlineNodeOrFragment } from '../insert-utils';
import { StatsModifier } from '../stats-modifier';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { ACTIONS } from '../pm-plugins/actions';
import { closeTypeAhead } from '../transforms/close-type-ahead';
import { getPluginState } from '../utils';

var validateNode = function validateNode(_ref) {
  var schema = _ref.schema,
      maybeNode = _ref.maybeNode;

  if (!maybeNode) {
    return null;
  }

  if (maybeNode instanceof PMNode || maybeNode instanceof Fragment) {
    return maybeNode;
  }

  if (typeof maybeNode === 'string') {
    return schema.text(maybeNode);
  }

  try {
    return PMNode.fromJSON(schema, maybeNode);
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
      closeTypeAhead(tr); // In this kind of situation we need to
      // delete the raw text query

      tr.delete(position.start, position.end);
      return tr;
    }

    node instanceof PMNode && node.isBlock ? insertBlockNode({
      node: node,
      tr: tr,
      position: position
    }) : insertInlineNodeOrFragment({
      maybeFragment: node,
      tr: tr,
      position: position,
      selectInlineNode: Boolean(opts.selectInlineNode)
    });
    closeHistory(tr);

    if (wasInsertedBySpace) {
      return tr;
    }

    var config = {
      stage: InsertTypeAheadStages.INSERTING_ITEM,
      query: query,
      selectedIndex: selectedIndex,
      trigger: handler.trigger
    };
    tr.step(new InsertTypeAheadStep(config));
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
    closeHistory(tr);

    if (!wasInsertedBySpace) {
      tr.delete(position.start, position.end);
      var config = {
        stage: InsertTypeAheadStages.DELETING_RAW_QUERY,
        selectedIndex: selectedIndex,
        query: query,
        trigger: trigger
      };
      tr.step(new InsertTypeAheadStep(config));
    }

    tr.setMeta(pluginKey, {
      action: ACTIONS.INSERT_ITEM,
      params: insertItem
    });
    return tr;
  };
};

export var insertTypeAheadItem = function insertTypeAheadItem(view) {
  return function (_ref4) {
    var item = _ref4.item,
        handler = _ref4.handler,
        mode = _ref4.mode,
        query = _ref4.query,
        sourceListItem = _ref4.sourceListItem;
    var pluginState = getPluginState(view.state);

    if (!pluginState) {
      return;
    }

    var stats = (pluginState.stats || new StatsModifier()).serialize();
    var meta = {
      mode: mode,
      query: query,
      stats: stats,
      sourceListItem: sourceListItem
    };
    var tr = view.state.tr;
    var trigger = handler.trigger;
    var text = "".concat(trigger).concat(query);

    if (mode === SelectItemMode.SPACE) {
      text = text.trim().concat(' ');
    }

    var selectedIndex = Math.max(sourceListItem.indexOf(item), 0);
    var wasInsertedBySpace = mode === SelectItemMode.SPACE;
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
          return target.apply(void 0, _toConsumableArray(argumentsList));
        }
      };
      var insertCallbackProxy = new Proxy(insertCallback, proxyHandler);
      var nextTr = handler.selectItem(newEditorSate, item, insertCallbackProxy, meta);

      if (!wasInsertCallbackCalled && nextTr) {
        closeHistory(nextTr); // In some cases we need to re-open the typeahead
        // e.g.: addign mentions from the quick insert
        //
        // Today, the QuickInsert API doesn't have a tool
        // to help on this. So the code below will close the typeahead
        // only if there is no previous metadata about typeahead in the
        // next transaction

        if (!nextTr.getMeta(pluginKey)) {
          closeTypeAhead(nextTr);
        }
      }

      return nextTr;
    };

    var position = {
      start: tr.selection.from,
      end: tr.selection.from + text.length
    };
    tr.setMeta(pluginKey, {
      action: ACTIONS.INSERT_RAW_QUERY,
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
    closeHistory(tr);
    view.dispatch(tr);
    view.focus();
  };
};
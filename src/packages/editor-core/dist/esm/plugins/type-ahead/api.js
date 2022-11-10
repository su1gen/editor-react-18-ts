import { TypeAheadAvailableNodes, SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { findHandler, findHandlerByTrigger, isTypeAheadOpen, getTypeAheadHandler, getTypeAheadQuery } from './utils';
import { INPUT_METHOD } from '../analytics/types/enums';
import { openTypeAheadAtCursor, openTypeAhead } from './transforms/open-typeahead-at-cursor';
import { closeTypeAhead } from './transforms/close-type-ahead';
import { updateQuery } from './commands/update-query';
import { insertTypeAheadItem } from './commands/insert-type-ahead-item';

var open = function open(_ref) {
  var editorView = _ref.editorView;
  return function (itemType) {
    return function (inputMethod) {
      var state = editorView.state;
      var handler = findHandler(itemType, state);

      if (!handler) {
        return false;
      }

      var tr = state.tr;
      openTypeAheadAtCursor({
        triggerHandler: handler,
        inputMethod: inputMethod
      })(tr);
      editorView.dispatch(tr);
      return true;
    };
  };
};

var defaultCloseOptions = {
  insertCurrentQueryAsRawText: false
};

var close = function close(_ref2) {
  var editorView = _ref2.editorView;
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultCloseOptions;
    var state = editorView.state;
    var currentQuery = getTypeAheadQuery(editorView.state);
    var tr = state.tr;

    if (options.attachCommand) {
      var fakeDispatch = function fakeDispatch(customTr) {
        tr = customTr;
      };

      options.attachCommand(state, fakeDispatch);
    }

    closeTypeAhead(tr);

    if (options.insertCurrentQueryAsRawText && currentQuery && currentQuery.length > 0) {
      var handler = getTypeAheadHandler(state);
      var text = handler.trigger.concat(currentQuery);
      tr.replaceSelectionWith(state.schema.text(text));
    }

    editorView.dispatch(tr);

    if (!editorView.hasFocus()) {
      editorView.focus();
    }

    return true;
  };
};

var search = function search(_ref3) {
  var editorView = _ref3.editorView;
  return function (itemType) {
    return function () {
      var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var state = editorView.state;
      var handler = findHandler(itemType, state);

      if (!handler) {
        throw new Error("Handler not found, did you load the ".concat(itemType, " plugin properly"));
      }

      open({
        editorView: editorView
      })(itemType)(INPUT_METHOD.KEYBOARD);
      updateQuery(query)(editorView.state, editorView.dispatch);
      var lastQuery = {
        current: query
      };
      var last = handler.getItems({
        query: query,
        editorState: state
      }).then(function (items) {
        if (!handler.forceSelect) {
          return items;
        }

        var forceSelectedItem = handler.forceSelect({
          items: items,
          query: query,
          editorState: state
        });

        if (!forceSelectedItem) {
          return items;
        }

        insertTypeAheadItem(editorView)({
          handler: handler,
          item: forceSelectedItem,
          query: query,
          mode: SelectItemMode.SELECTED,
          sourceListItem: items
        });
      });
      var results = {
        last: last
      };
      return {
        type: function type(appendValue) {
          if (!appendValue) {
            return;
          }

          lastQuery.current += appendValue;
          updateQuery(lastQuery.current)(editorView.state, editorView.dispatch);
          var promise = handler.getItems({
            query: lastQuery.current,
            editorState: state
          });
          results.last = promise;
          return promise;
        },
        result: function result() {
          return results.last;
        },
        close: close({
          editorView: editorView
        }),
        insert: function insert(_ref4) {
          var index = _ref4.index,
              mode = _ref4.mode;
          return results.last.then(function (result) {
            var item = result ? result[index] : null;

            if (result && item) {
              insertTypeAheadItem(editorView)({
                handler: handler,
                item: item,
                query: query,
                mode: mode || SelectItemMode.SELECTED,
                sourceListItem: result
              });
            }
          });
        }
      };
    };
  };
};

var insertItem = function insertItem(_ref5) {
  var editorView = _ref5.editorView;
  return function (itemType) {
    return function (_ref6) {
      var contentItem = _ref6.contentItem,
          query = _ref6.query,
          sourceListItem = _ref6.sourceListItem;
      var state = editorView.state;
      var handler = findHandler(itemType, state);

      if (!handler) {
        return false;
      }

      insertTypeAheadItem(editorView)({
        handler: handler,
        item: contentItem,
        mode: SelectItemMode.SELECTED,
        query: query,
        sourceListItem: sourceListItem
      });
      return true;
    };
  };
};

var isOpen = function isOpen(_ref7) {
  var editorView = _ref7.editorView;
  return function () {
    if (!isTypeAheadOpen(editorView.state)) {
      return false;
    }

    var handler = getTypeAheadHandler(editorView.state);

    if (!handler) {
      return false;
    }

    return handler;
  };
};

var currentQuery = function currentQuery(_ref8) {
  var editorView = _ref8.editorView;
  return function () {
    return getTypeAheadQuery(editorView.state);
  };
};

var find = function find(_ref9) {
  var editorView = _ref9.editorView;
  return function (trigger) {
    var editorState = editorView.state;
    var handler = findHandlerByTrigger({
      trigger: trigger,
      editorState: editorState
    });

    if (!handler) {
      return null;
    }

    return handler;
  };
}; // This is an internal tool to be used inside of others Editor Plugins
// We shouldn't public export this method.


export var createInternalTypeAheadTools = function createInternalTypeAheadTools(editorView) {
  var props = {
    editorView: editorView
  };
  return {
    findTypeAheadHandler: find(props),
    openTypeAheadHandler: openTypeAhead
  };
};
export var createTypeAheadTools = function createTypeAheadTools(editorView) {
  var props = {
    editorView: editorView
  };
  return {
    isOpen: isOpen(props),
    currentQuery: currentQuery(props),
    close: close(props),
    openMention: open(props)(TypeAheadAvailableNodes.MENTION),
    searchMention: search(props)(TypeAheadAvailableNodes.MENTION),
    openQuickInsert: open(props)(TypeAheadAvailableNodes.QUICK_INSERT),
    searchQuickInsert: search(props)(TypeAheadAvailableNodes.QUICK_INSERT),
    openEmoji: open(props)(TypeAheadAvailableNodes.EMOJI),
    searchEmoji: search(props)(TypeAheadAvailableNodes.EMOJI),
    insertItemMention: insertItem(props)(TypeAheadAvailableNodes.MENTION),
    insertItemEmoji: insertItem(props)(TypeAheadAvailableNodes.EMOJI),
    insertItemQuickInsert: insertItem(props)(TypeAheadAvailableNodes.QUICK_INSERT)
  };
};
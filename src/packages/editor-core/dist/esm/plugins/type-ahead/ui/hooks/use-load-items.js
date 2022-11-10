import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { useRef, useState, useEffect } from 'react';
import { updateListItem } from '../../commands/update-list-items';
var EMPTY_LIST_ITEM = [];
export var useLoadItems = function useLoadItems(triggerHandler, editorView, query) {
  var _useState = useState(EMPTY_LIST_ITEM),
      _useState2 = _slicedToArray(_useState, 2),
      items = _useState2[0],
      setItems = _useState2[1];

  var componentIsMounted = useRef(true);
  var editorViewRef = useRef(editorView);
  useEffect(function () {
    var getItems = triggerHandler === null || triggerHandler === void 0 ? void 0 : triggerHandler.getItems;

    if (!getItems) {
      setItems(EMPTY_LIST_ITEM);
      return;
    }

    var options = {
      query: query || '',
      editorState: editorView.state
    };
    var view = editorViewRef.current;
    getItems(options).then(function (result) {
      var list = result.length > 0 ? result : EMPTY_LIST_ITEM;

      if (componentIsMounted.current) {
        setItems(list);
      }

      queueMicrotask(function () {
        updateListItem(list)(view.state, view.dispatch);
      });
    }); // ignore because EditorView is mutable but we don't want to
    // call loadItems when it changes, only when the query changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandler, query]);
  useEffect(function () {
    return function () {
      componentIsMounted.current = false;
    };
  }, []);
  return items;
};
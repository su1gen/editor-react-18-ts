import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */
import React from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { createPlugin } from './pm-plugins/main';
import { createPlugin as createInsertItemPlugin } from './pm-plugins/insert-item-plugin';
import WithPluginState from '../../ui/WithPluginState';
import { typeAheadQuery } from '@atlaskit/adf-schema';
import { pluginKey as typeAheadPluginKey } from './pm-plugins/key';
import { inputRulePlugin } from './pm-plugins/input-rules';
import { TypeAheadPopup } from './ui/TypeAheadPopup';
import { getPluginState } from './utils';
import { useItemInsert } from './ui/hooks/use-item-insert';
import { updateSelectedIndex } from './commands/update-selected-index';
import { StatsModifier } from './stats-modifier';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, fireAnalyticsEvent } from '../analytics';
var TypeAheadMenu = /*#__PURE__*/React.memo(function (_ref) {
  var _popupMountRef$curren, _popupMountRef$curren2, _popupMountRef$curren3;

  var editorView = _ref.editorView,
      popupMountRef = _ref.popupMountRef,
      typeAheadState = _ref.typeAheadState,
      fireAnalyticsCallback = _ref.fireAnalyticsCallback;
  var isOpen = typeAheadState.decorationSet.find().length > 0;
  var triggerHandler = typeAheadState.triggerHandler,
      items = typeAheadState.items,
      selectedIndex = typeAheadState.selectedIndex,
      decorationElement = typeAheadState.decorationElement,
      decorationSet = typeAheadState.decorationSet,
      query = typeAheadState.query;

  var _useItemInsert = useItemInsert(triggerHandler, editorView, items),
      _useItemInsert2 = _slicedToArray(_useItemInsert, 3),
      onItemInsert = _useItemInsert2[0],
      onItemMatch = _useItemInsert2[2];

  var setSelectedItem = React.useCallback(function (_ref2) {
    var nextIndex = _ref2.index;
    queueMicrotask(function () {
      updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
    });
  }, [editorView]);
  var insertItem = React.useCallback(function () {
    var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SelectItemMode.SELECTED;
    var index = arguments.length > 1 ? arguments[1] : undefined;
    queueMicrotask(function () {
      onItemInsert({
        mode: mode,
        index: index,
        query: query
      });
    });
  }, [onItemInsert, query]);
  React.useEffect(function () {
    if (!isOpen || !query) {
      return;
    }

    var isLastCharSpace = query[query.length - 1] === ' ';

    if (!isLastCharSpace) {
      return;
    }

    var result = onItemMatch({
      mode: SelectItemMode.SPACE,
      query: query.trim()
    });

    if (!result) {
      return;
    }
  }, [isOpen, query, onItemMatch]);

  if (!isOpen || !triggerHandler || !(decorationElement instanceof HTMLElement) || items.length === 0) {
    return null;
  }

  return /*#__PURE__*/React.createElement(TypeAheadPopup, {
    editorView: editorView,
    popupsMountPoint: (_popupMountRef$curren = popupMountRef.current) === null || _popupMountRef$curren === void 0 ? void 0 : _popupMountRef$curren.popupsMountPoint,
    popupsBoundariesElement: (_popupMountRef$curren2 = popupMountRef.current) === null || _popupMountRef$curren2 === void 0 ? void 0 : _popupMountRef$curren2.popupsBoundariesElement,
    popupsScrollableElement: (_popupMountRef$curren3 = popupMountRef.current) === null || _popupMountRef$curren3 === void 0 ? void 0 : _popupMountRef$curren3.popupsScrollableElement,
    anchorElement: decorationElement,
    triggerHandler: triggerHandler,
    fireAnalyticsCallback: fireAnalyticsCallback,
    items: items,
    selectedIndex: selectedIndex,
    setSelectedItem: setSelectedItem,
    onItemInsert: insertItem,
    decorationSet: decorationSet,
    isEmptyQuery: !query
  });
});
/**
 *
 * Revamped typeahead using decorations instead of the `typeAheadQuery` mark
 *
 * https://product-fabric.atlassian.net/wiki/spaces/E/pages/2992177582/Technical+TypeAhead+Data+Flow
 *
 *
 */

var typeAheadPlugin = function typeAheadPlugin(options) {
  var fireAnalyticsCallback = fireAnalyticsEvent(options === null || options === void 0 ? void 0 : options.createAnalyticsEvent);
  var popupMountRef = {
    current: null
  };
  return {
    name: 'typeAhead',
    marks: function marks() {
      // We need to keep this to make sure
      // All documents with typeahead marks will be loaded normaly
      return [{
        name: 'typeAheadQuery',
        mark: typeAheadQuery
      }];
    },
    pmPlugins: function pmPlugins() {
      var typeAhead = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      return [{
        name: 'typeAhead',
        plugin: function plugin(_ref3) {
          var dispatch = _ref3.dispatch,
              getIntl = _ref3.getIntl;
          return createPlugin({
            getIntl: getIntl,
            popupMountRef: popupMountRef,
            reactDispatch: dispatch,
            typeAheadHandlers: typeAhead,
            createAnalyticsEvent: options === null || options === void 0 ? void 0 : options.createAnalyticsEvent
          });
        }
      }, {
        name: 'typeAheadInsertItem',
        plugin: createInsertItemPlugin
      }, {
        name: 'typeAheadInputRule',
        plugin: function plugin(_ref4) {
          var schema = _ref4.schema,
              featureFlags = _ref4.featureFlags;
          return inputRulePlugin(schema, typeAhead, featureFlags);
        }
      }];
    },
    contentComponent: function contentComponent(_ref5) {
      var editorView = _ref5.editorView,
          containerElement = _ref5.containerElement,
          popupsMountPoint = _ref5.popupsMountPoint,
          popupsBoundariesElement = _ref5.popupsBoundariesElement,
          popupsScrollableElement = _ref5.popupsScrollableElement,
          wrapperElement = _ref5.wrapperElement;
      popupMountRef.current = {
        popupsMountPoint: popupsMountPoint || wrapperElement || undefined,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement || containerElement || undefined
      };
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          typeAheadState: typeAheadPluginKey
        },
        render: function render(_ref6) {
          var typeAheadState = _ref6.typeAheadState;

          if (!typeAheadState) {
            return null;
          }

          return /*#__PURE__*/React.createElement(TypeAheadMenu, {
            editorView: editorView,
            popupMountRef: popupMountRef,
            typeAheadState: typeAheadState,
            fireAnalyticsCallback: fireAnalyticsCallback
          });
        }
      });
    },
    onEditorViewStateUpdated: function onEditorViewStateUpdated(_ref7) {
      var originalTransaction = _ref7.originalTransaction,
          oldEditorState = _ref7.oldEditorState,
          newEditorState = _ref7.newEditorState;
      var oldPluginState = getPluginState(oldEditorState);
      var newPluginState = getPluginState(newEditorState);

      if (!oldPluginState || !newPluginState) {
        return;
      }

      var oldTriggerHandler = oldPluginState.triggerHandler;
      var newTriggerHandler = newPluginState.triggerHandler;
      var isANewHandler = oldTriggerHandler !== newTriggerHandler;

      if (oldTriggerHandler !== null && oldTriggerHandler !== void 0 && oldTriggerHandler.dismiss && isANewHandler) {
        var typeAheadMessage = originalTransaction.getMeta(typeAheadPluginKey);
        var wasItemInserted = typeAheadMessage && typeAheadMessage.action === 'INSERT_RAW_QUERY';
        oldTriggerHandler.dismiss({
          editorState: newEditorState,
          query: oldPluginState.query,
          stats: (oldPluginState.stats || new StatsModifier()).serialize(),
          wasItemInserted: wasItemInserted
        });
      }

      if (newTriggerHandler !== null && newTriggerHandler !== void 0 && newTriggerHandler.onOpen && isANewHandler) {
        newTriggerHandler.onOpen(newEditorState);
      }

      if (newTriggerHandler && isANewHandler && options !== null && options !== void 0 && options.createAnalyticsEvent) {
        fireAnalyticsCallback({
          payload: {
            action: ACTION.INVOKED,
            actionSubject: ACTION_SUBJECT.TYPEAHEAD,
            actionSubjectId: newTriggerHandler.id || 'not_set',
            attributes: {
              inputMethod: newPluginState.inputMethod || INPUT_METHOD.KEYBOARD
            },
            eventType: EVENT_TYPE.UI
          }
        });
      }
    }
  };
};

export default typeAheadPlugin;
export { typeAheadPluginKey };
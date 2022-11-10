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
const TypeAheadMenu = /*#__PURE__*/React.memo(({
  editorView,
  popupMountRef,
  typeAheadState,
  fireAnalyticsCallback
}) => {
  var _popupMountRef$curren, _popupMountRef$curren2, _popupMountRef$curren3;

  const isOpen = typeAheadState.decorationSet.find().length > 0;
  const {
    triggerHandler,
    items,
    selectedIndex,
    decorationElement,
    decorationSet,
    query
  } = typeAheadState;
  const [onItemInsert,, onItemMatch] = useItemInsert(triggerHandler, editorView, items);
  const setSelectedItem = React.useCallback(({
    index: nextIndex
  }) => {
    queueMicrotask(() => {
      updateSelectedIndex(nextIndex)(editorView.state, editorView.dispatch);
    });
  }, [editorView]);
  const insertItem = React.useCallback((mode = SelectItemMode.SELECTED, index) => {
    queueMicrotask(() => {
      onItemInsert({
        mode,
        index,
        query
      });
    });
  }, [onItemInsert, query]);
  React.useEffect(() => {
    if (!isOpen || !query) {
      return;
    }

    const isLastCharSpace = query[query.length - 1] === ' ';

    if (!isLastCharSpace) {
      return;
    }

    const result = onItemMatch({
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

const typeAheadPlugin = options => {
  const fireAnalyticsCallback = fireAnalyticsEvent(options === null || options === void 0 ? void 0 : options.createAnalyticsEvent);
  const popupMountRef = {
    current: null
  };
  return {
    name: 'typeAhead',

    marks() {
      // We need to keep this to make sure
      // All documents with typeahead marks will be loaded normaly
      return [{
        name: 'typeAheadQuery',
        mark: typeAheadQuery
      }];
    },

    pmPlugins(typeAhead = []) {
      return [{
        name: 'typeAhead',
        plugin: ({
          dispatch,
          getIntl
        }) => createPlugin({
          getIntl,
          popupMountRef,
          reactDispatch: dispatch,
          typeAheadHandlers: typeAhead,
          createAnalyticsEvent: options === null || options === void 0 ? void 0 : options.createAnalyticsEvent
        })
      }, {
        name: 'typeAheadInsertItem',
        plugin: createInsertItemPlugin
      }, {
        name: 'typeAheadInputRule',
        plugin: ({
          schema,
          featureFlags
        }) => inputRulePlugin(schema, typeAhead, featureFlags)
      }];
    },

    contentComponent({
      editorView,
      containerElement,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      wrapperElement
    }) {
      popupMountRef.current = {
        popupsMountPoint: popupsMountPoint || wrapperElement || undefined,
        popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement || containerElement || undefined
      };
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          typeAheadState: typeAheadPluginKey
        },
        render: ({
          typeAheadState
        }) => {
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

    onEditorViewStateUpdated({
      originalTransaction,
      oldEditorState,
      newEditorState
    }) {
      const oldPluginState = getPluginState(oldEditorState);
      const newPluginState = getPluginState(newEditorState);

      if (!oldPluginState || !newPluginState) {
        return;
      }

      const {
        triggerHandler: oldTriggerHandler
      } = oldPluginState;
      const {
        triggerHandler: newTriggerHandler
      } = newPluginState;
      const isANewHandler = oldTriggerHandler !== newTriggerHandler;

      if (oldTriggerHandler !== null && oldTriggerHandler !== void 0 && oldTriggerHandler.dismiss && isANewHandler) {
        const typeAheadMessage = originalTransaction.getMeta(typeAheadPluginKey);
        const wasItemInserted = typeAheadMessage && typeAheadMessage.action === 'INSERT_RAW_QUERY';
        oldTriggerHandler.dismiss({
          editorState: newEditorState,
          query: oldPluginState.query,
          stats: (oldPluginState.stats || new StatsModifier()).serialize(),
          wasItemInserted
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
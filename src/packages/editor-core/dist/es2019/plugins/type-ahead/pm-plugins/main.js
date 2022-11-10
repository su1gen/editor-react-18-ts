import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { DecorationSet } from 'prosemirror-view';
import { InsertTypeAheadStep } from '@atlaskit/adf-schema/steps';
import { TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE } from '../constants';
import { ACTIONS } from './actions';
import { pluginKey } from './key';
import { closest } from '../../../utils/dom';
import { createReducer } from './reducer';
import { factoryDecorations } from './decorations';
import { isInsertionTransaction } from './utils';

const hasValidTypeAheadStep = tr => {
  const steps = tr.steps.filter(step => step instanceof InsertTypeAheadStep); // There are some cases, like collab rebase, where the steps are re-applied
  // We should not re open the type-ahead for those cases

  if (steps.length === 1) {
    return steps[0];
  }

  return null;
};

export function createPlugin({
  reactDispatch,
  popupMountRef,
  createAnalyticsEvent,
  typeAheadHandlers,
  getIntl
}) {
  const intl = getIntl();
  const {
    createDecorations,
    removeDecorations
  } = factoryDecorations({
    intl,
    popupMountRef,
    createAnalyticsEvent: createAnalyticsEvent
  });
  const reducer = createReducer({
    createDecorations,
    removeDecorations,
    typeAheadHandlers,
    popupMountRef
  });
  return new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        return {
          typeAheadHandlers,
          query: '',
          decorationSet: DecorationSet.empty,
          decorationElement: null,
          items: [],
          selectedIndex: -1,
          stats: null,
          inputMethod: null
        };
      },

      apply(tr, currentPluginState, oldEditorState, state) {
        const customStep = hasValidTypeAheadStep(tr);
        const nextPluginState = reducer(tr, currentPluginState, customStep);

        if (currentPluginState !== nextPluginState) {
          reactDispatch(pluginKey, nextPluginState);
        }

        return nextPluginState;
      }

    },

    appendTransaction(transactions, _oldState, newState) {
      const insertItemCallback = isInsertionTransaction(transactions, ACTIONS.INSERT_RAW_QUERY);

      if (insertItemCallback) {
        const tr = insertItemCallback(newState);

        if (tr) {
          return tr;
        }
      }
    },

    view() {
      return {
        update(editorView) {}

      };
    },

    props: {
      decorations: state => {
        var _pluginKey$getState;

        return (_pluginKey$getState = pluginKey.getState(state)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.decorationSet;
      },
      handleDOMEvents: {
        compositionend: (view, event) => {
          return false;
        },
        click: (view, event) => {
          const {
            target
          } = event; // ProseMirror view listen to any click event inside of it
          // When this event is coming from the typeahead
          // we should tell to ProseMirror to sit down and relax
          // cuz we know what we are doing (I hope)

          if (target instanceof HTMLElement && closest(target, `[data-type-ahead=${TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE}]`)) {
            return true;
          }

          return false;
        }
      }
    }
  });
}
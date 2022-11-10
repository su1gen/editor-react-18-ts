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

var hasValidTypeAheadStep = function hasValidTypeAheadStep(tr) {
  var steps = tr.steps.filter(function (step) {
    return step instanceof InsertTypeAheadStep;
  }); // There are some cases, like collab rebase, where the steps are re-applied
  // We should not re open the type-ahead for those cases

  if (steps.length === 1) {
    return steps[0];
  }

  return null;
};

export function createPlugin(_ref) {
  var reactDispatch = _ref.reactDispatch,
      popupMountRef = _ref.popupMountRef,
      createAnalyticsEvent = _ref.createAnalyticsEvent,
      typeAheadHandlers = _ref.typeAheadHandlers,
      getIntl = _ref.getIntl;
  var intl = getIntl();

  var _factoryDecorations = factoryDecorations({
    intl: intl,
    popupMountRef: popupMountRef,
    createAnalyticsEvent: createAnalyticsEvent
  }),
      createDecorations = _factoryDecorations.createDecorations,
      removeDecorations = _factoryDecorations.removeDecorations;

  var reducer = createReducer({
    createDecorations: createDecorations,
    removeDecorations: removeDecorations,
    typeAheadHandlers: typeAheadHandlers,
    popupMountRef: popupMountRef
  });
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        return {
          typeAheadHandlers: typeAheadHandlers,
          query: '',
          decorationSet: DecorationSet.empty,
          decorationElement: null,
          items: [],
          selectedIndex: -1,
          stats: null,
          inputMethod: null
        };
      },
      apply: function apply(tr, currentPluginState, oldEditorState, state) {
        var customStep = hasValidTypeAheadStep(tr);
        var nextPluginState = reducer(tr, currentPluginState, customStep);

        if (currentPluginState !== nextPluginState) {
          reactDispatch(pluginKey, nextPluginState);
        }

        return nextPluginState;
      }
    },
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var insertItemCallback = isInsertionTransaction(transactions, ACTIONS.INSERT_RAW_QUERY);

      if (insertItemCallback) {
        var tr = insertItemCallback(newState);

        if (tr) {
          return tr;
        }
      }
    },
    view: function view() {
      return {
        update: function update(editorView) {}
      };
    },
    props: {
      decorations: function decorations(state) {
        var _pluginKey$getState;

        return (_pluginKey$getState = pluginKey.getState(state)) === null || _pluginKey$getState === void 0 ? void 0 : _pluginKey$getState.decorationSet;
      },
      handleDOMEvents: {
        compositionend: function compositionend(view, event) {
          return false;
        },
        click: function click(view, event) {
          var target = event.target; // ProseMirror view listen to any click event inside of it
          // When this event is coming from the typeahead
          // we should tell to ProseMirror to sit down and relax
          // cuz we know what we are doing (I hope)

          if (target instanceof HTMLElement && closest(target, "[data-type-ahead=".concat(TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE, "]"))) {
            return true;
          }

          return false;
        }
      }
    }
  });
}
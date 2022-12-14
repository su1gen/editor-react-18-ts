import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { emoji } from '@atlaskit/adf-schema';
import { Fragment } from 'prosemirror-model';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { EmojiTypeAheadItem, SearchSort, recordSelectionSucceededSli, recordSelectionFailedSli } from '@atlaskit/emoji';
import { getInlineNodeViewProducer } from '../../nodeviews/getInlineNodeViewProducer';
import { inputRulePlugin as asciiInputRulePlugin } from './pm-plugins/ascii-input-rules';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { IconEmoji } from '../quick-insert/assets';
import { EmojiNodeView } from './nodeviews/emoji';
import { EmojiContextProvider } from './ui/EmojiContextProvider';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { openTypeAheadAtCursor } from '../type-ahead/transforms/open-typeahead-at-cursor';
export const emojiToTypeaheadItem = (emoji, emojiProvider) => ({
  title: emoji.shortName || '',
  key: emoji.id || emoji.shortName,

  render({
    isSelected,
    onClick,
    onHover
  }) {
    return (
      /*#__PURE__*/
      // It's required to pass emojiProvider through the context for custom emojis to work
      React.createElement(EmojiContextProvider, {
        emojiProvider: emojiProvider
      }, /*#__PURE__*/React.createElement(EmojiTypeAheadItem, {
        emoji: emoji,
        selected: isSelected,
        onMouseMove: onHover,
        onSelection: onClick
      }))
    );
  },

  emoji
});
export function memoize(fn) {
  // Cache results here
  const seen = new Map();

  function memoized(emoji, emojiProvider) {
    // Check cache for hits
    const hit = seen.get(emoji.id || emoji.shortName);

    if (hit) {
      return hit;
    } // Generate new result and cache it


    const result = fn(emoji, emojiProvider);
    seen.set(emoji.id || emoji.shortName, result);
    return result;
  }

  return {
    call: memoized,
    clear: seen.clear.bind(seen)
  };
}
const memoizedToItem = memoize(emojiToTypeaheadItem);
export const defaultListLimit = 50;

const isFullShortName = query => query && query.length > 1 && query.charAt(0) === ':' && query.charAt(query.length - 1) === ':';

const TRIGGER = ':';

const emojiPlugin = options => {
  const typeAhead = {
    id: TypeAheadAvailableNodes.EMOJI,
    trigger: TRIGGER,
    // Custom regex must have a capture group around trigger
    // so it's possible to use it without needing to scan through all triggers again
    customRegex: '\\(?(:)',
    headless: options ? options.headless : undefined,

    getItems({
      query,
      editorState
    }) {
      const pluginState = getEmojiPluginState(editorState);
      const emojiProvider = pluginState.emojiProvider;

      if (!emojiProvider) {
        return Promise.resolve([]);
      }

      return new Promise(resolve => {
        const emojiProviderChangeHandler = {
          result(emojiResult) {
            if (!emojiResult || !emojiResult.emojis) {
              resolve([]);
            } else {
              const emojiItems = emojiResult.emojis.map(emoji => memoizedToItem.call(emoji, emojiProvider));
              resolve(emojiItems);
            }

            emojiProvider.unsubscribe(emojiProviderChangeHandler);
          }

        };
        emojiProvider.subscribe(emojiProviderChangeHandler);
        emojiProvider.filter(TRIGGER.concat(query), {
          limit: defaultListLimit,
          skinTone: emojiProvider.getSelectedTone(),
          sort: !query.length ? SearchSort.UsageFrequency : SearchSort.Default
        });
      });
    },

    forceSelect({
      query,
      items,
      editorState
    }) {
      const {
        asciiMap
      } = emojiPluginKey.getState(editorState);
      const normalizedQuery = TRIGGER.concat(query); // if the query has space at the end
      // check the ascii map for emojis

      if (asciiMap && normalizedQuery.length >= 3 && normalizedQuery.endsWith(' ') && asciiMap.has(normalizedQuery.trim())) {
        const emoji = asciiMap.get(normalizedQuery.trim());
        return {
          title: emoji.name,
          emoji
        };
      }

      const matchedItem = isFullShortName(normalizedQuery) ? items.find(item => item.title.toLowerCase() === normalizedQuery) : undefined;
      return matchedItem;
    },

    selectItem(state, item, insert, {
      mode
    }) {
      const {
        id = '',
        fallback,
        shortName
      } = item.emoji;
      const text = fallback || shortName;
      const emojiPluginState = emojiPluginKey.getState(state);

      if (emojiPluginState.emojiProvider && emojiPluginState.emojiProvider.recordSelection && item.emoji) {
        emojiPluginState.emojiProvider.recordSelection(item.emoji).then(recordSelectionSucceededSli(options)).catch(recordSelectionFailedSli(options));
      }

      const emojiNode = state.schema.nodes.emoji.createChecked({
        shortName,
        id,
        text
      });
      const space = state.schema.text(' ');
      return addAnalytics(state, insert(Fragment.from([emojiNode, space])), {
        action: ACTION.INSERTED,
        actionSubject: ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: ACTION_SUBJECT_ID.EMOJI,
        attributes: {
          inputMethod: INPUT_METHOD.TYPEAHEAD
        },
        eventType: EVENT_TYPE.TRACK
      });
    }

  };
  return {
    name: 'emoji',

    nodes() {
      return [{
        name: 'emoji',
        node: emoji
      }];
    },

    pmPlugins() {
      return [{
        name: 'emoji',
        plugin: pmPluginFactoryParams => createEmojiPlugin(pmPluginFactoryParams)
      }, {
        name: 'emojiAsciiInputRule',
        plugin: ({
          schema,
          providerFactory,
          featureFlags
        }) => asciiInputRulePlugin(schema, providerFactory, featureFlags)
      }];
    },

    pluginsOptions: {
      quickInsert: ({
        formatMessage
      }) => [{
        id: 'emoji',
        title: formatMessage(messages.emoji),
        description: formatMessage(messages.emojiDescription),
        priority: 500,
        keyshortcut: ':',
        icon: () => /*#__PURE__*/React.createElement(IconEmoji, null),

        action(insert, state) {
          const tr = insert(undefined);
          openTypeAheadAtCursor({
            triggerHandler: typeAhead,
            inputMethod: INPUT_METHOD.QUICK_INSERT
          })(tr);
          return addAnalytics(state, tr, {
            action: ACTION.INVOKED,
            actionSubject: ACTION_SUBJECT.TYPEAHEAD,
            actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT
            },
            eventType: EVENT_TYPE.UI
          });
        }

      }],
      typeAhead
    }
  };
};

export default emojiPlugin;
/**
 * Actions
 */

export const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_RESULTS: 'SET_RESULTS',
  SET_ASCII_MAP: 'SET_ASCII_MAP'
};

const setAsciiMap = asciiMap => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(emojiPluginKey, {
      action: ACTIONS.SET_ASCII_MAP,
      params: {
        asciiMap
      }
    }));
  }

  return true;
};

export const setProvider = provider => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(emojiPluginKey, {
      action: ACTIONS.SET_PROVIDER,
      params: {
        provider
      }
    }));
  }

  return true;
};
export const emojiPluginKey = new PluginKey('emojiPlugin');
export function getEmojiPluginState(state) {
  return emojiPluginKey.getState(state) || {};
}
export function createEmojiPlugin(pmPluginFactoryParams) {
  return new SafePlugin({
    key: emojiPluginKey,
    state: {
      init() {
        return {};
      },

      apply(tr, pluginState) {
        const {
          action,
          params
        } = tr.getMeta(emojiPluginKey) || {
          action: null,
          params: null
        };
        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = { ...pluginState,
              emojiProvider: params.provider
            };
            pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_ASCII_MAP:
            newPluginState = { ...pluginState,
              asciiMap: params.asciiMap
            };
            pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      }

    },
    props: {
      nodeViews: {
        emoji: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: EmojiNodeView,
          extraComponentProps: {
            providerFactory: pmPluginFactoryParams.providerFactory
          }
        })
      }
    },

    view(editorView) {
      const providerHandler = (name, providerPromise) => {
        switch (name) {
          case 'emojiProvider':
            if (!providerPromise) {
              return setProvider(undefined)(editorView.state, editorView.dispatch);
            }

            providerPromise.then(provider => {
              setProvider(provider)(editorView.state, editorView.dispatch);
              provider.getAsciiMap().then(asciiMap => {
                setAsciiMap(asciiMap)(editorView.state, editorView.dispatch);
              });
            }).catch(() => setProvider(undefined)(editorView.state, editorView.dispatch));
            break;
        }

        return;
      };

      pmPluginFactoryParams.providerFactory.subscribe('emojiProvider', providerHandler);
      return {
        destroy() {
          if (pmPluginFactoryParams.providerFactory) {
            pmPluginFactoryParams.providerFactory.unsubscribe('emojiProvider', providerHandler);
          }
        }

      };
    }

  });
}
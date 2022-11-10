"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ACTIONS = void 0;
exports.createEmojiPlugin = createEmojiPlugin;
exports.emojiToTypeaheadItem = exports.emojiPluginKey = exports.defaultListLimit = exports.default = void 0;
exports.getEmojiPluginState = getEmojiPluginState;
exports.memoize = memoize;
exports.setProvider = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _prosemirrorModel = require("prosemirror-model");

var _typeAhead = require("@atlaskit/editor-common/type-ahead");

var _emoji2 = require("@atlaskit/emoji");

var _getInlineNodeViewProducer = require("../../nodeviews/getInlineNodeViewProducer");

var _asciiInputRules = require("./pm-plugins/ascii-input-rules");

var _analytics = require("../analytics");

var _assets = require("../quick-insert/assets");

var _emoji3 = require("./nodeviews/emoji");

var _EmojiContextProvider = require("./ui/EmojiContextProvider");

var _messages = require("../insert-block/ui/ToolbarInsertBlock/messages");

var _openTypeaheadAtCursor = require("../type-ahead/transforms/open-typeahead-at-cursor");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var emojiToTypeaheadItem = function emojiToTypeaheadItem(emoji, emojiProvider) {
  return {
    title: emoji.shortName || '',
    key: emoji.id || emoji.shortName,
    render: function render(_ref) {
      var isSelected = _ref.isSelected,
          onClick = _ref.onClick,
          onHover = _ref.onHover;
      return (
        /*#__PURE__*/
        // It's required to pass emojiProvider through the context for custom emojis to work
        _react.default.createElement(_EmojiContextProvider.EmojiContextProvider, {
          emojiProvider: emojiProvider
        }, /*#__PURE__*/_react.default.createElement(_emoji2.EmojiTypeAheadItem, {
          emoji: emoji,
          selected: isSelected,
          onMouseMove: onHover,
          onSelection: onClick
        }))
      );
    },
    emoji: emoji
  };
};

exports.emojiToTypeaheadItem = emojiToTypeaheadItem;

function memoize(fn) {
  // Cache results here
  var seen = new Map();

  function memoized(emoji, emojiProvider) {
    // Check cache for hits
    var hit = seen.get(emoji.id || emoji.shortName);

    if (hit) {
      return hit;
    } // Generate new result and cache it


    var result = fn(emoji, emojiProvider);
    seen.set(emoji.id || emoji.shortName, result);
    return result;
  }

  return {
    call: memoized,
    clear: seen.clear.bind(seen)
  };
}

var memoizedToItem = memoize(emojiToTypeaheadItem);
var defaultListLimit = 50;
exports.defaultListLimit = defaultListLimit;

var isFullShortName = function isFullShortName(query) {
  return query && query.length > 1 && query.charAt(0) === ':' && query.charAt(query.length - 1) === ':';
};

var TRIGGER = ':';

var emojiPlugin = function emojiPlugin(options) {
  var typeAhead = {
    id: _typeAhead.TypeAheadAvailableNodes.EMOJI,
    trigger: TRIGGER,
    // Custom regex must have a capture group around trigger
    // so it's possible to use it without needing to scan through all triggers again
    customRegex: '\\(?(:)',
    headless: options ? options.headless : undefined,
    getItems: function getItems(_ref2) {
      var query = _ref2.query,
          editorState = _ref2.editorState;
      var pluginState = getEmojiPluginState(editorState);
      var emojiProvider = pluginState.emojiProvider;

      if (!emojiProvider) {
        return Promise.resolve([]);
      }

      return new Promise(function (resolve) {
        var emojiProviderChangeHandler = {
          result: function result(emojiResult) {
            if (!emojiResult || !emojiResult.emojis) {
              resolve([]);
            } else {
              var emojiItems = emojiResult.emojis.map(function (emoji) {
                return memoizedToItem.call(emoji, emojiProvider);
              });
              resolve(emojiItems);
            }

            emojiProvider.unsubscribe(emojiProviderChangeHandler);
          }
        };
        emojiProvider.subscribe(emojiProviderChangeHandler);
        emojiProvider.filter(TRIGGER.concat(query), {
          limit: defaultListLimit,
          skinTone: emojiProvider.getSelectedTone(),
          sort: !query.length ? _emoji2.SearchSort.UsageFrequency : _emoji2.SearchSort.Default
        });
      });
    },
    forceSelect: function forceSelect(_ref3) {
      var query = _ref3.query,
          items = _ref3.items,
          editorState = _ref3.editorState;

      var _emojiPluginKey$getSt = emojiPluginKey.getState(editorState),
          asciiMap = _emojiPluginKey$getSt.asciiMap;

      var normalizedQuery = TRIGGER.concat(query); // if the query has space at the end
      // check the ascii map for emojis

      if (asciiMap && normalizedQuery.length >= 3 && normalizedQuery.endsWith(' ') && asciiMap.has(normalizedQuery.trim())) {
        var _emoji = asciiMap.get(normalizedQuery.trim());

        return {
          title: _emoji.name,
          emoji: _emoji
        };
      }

      var matchedItem = isFullShortName(normalizedQuery) ? items.find(function (item) {
        return item.title.toLowerCase() === normalizedQuery;
      }) : undefined;
      return matchedItem;
    },
    selectItem: function selectItem(state, item, insert, _ref4) {
      var mode = _ref4.mode;
      var _item$emoji = item.emoji,
          _item$emoji$id = _item$emoji.id,
          id = _item$emoji$id === void 0 ? '' : _item$emoji$id,
          fallback = _item$emoji.fallback,
          shortName = _item$emoji.shortName;
      var text = fallback || shortName;
      var emojiPluginState = emojiPluginKey.getState(state);

      if (emojiPluginState.emojiProvider && emojiPluginState.emojiProvider.recordSelection && item.emoji) {
        emojiPluginState.emojiProvider.recordSelection(item.emoji).then((0, _emoji2.recordSelectionSucceededSli)(options)).catch((0, _emoji2.recordSelectionFailedSli)(options));
      }

      var emojiNode = state.schema.nodes.emoji.createChecked({
        shortName: shortName,
        id: id,
        text: text
      });
      var space = state.schema.text(' ');
      return (0, _analytics.addAnalytics)(state, insert(_prosemirrorModel.Fragment.from([emojiNode, space])), {
        action: _analytics.ACTION.INSERTED,
        actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.EMOJI,
        attributes: {
          inputMethod: _analytics.INPUT_METHOD.TYPEAHEAD
        },
        eventType: _analytics.EVENT_TYPE.TRACK
      });
    }
  };
  return {
    name: 'emoji',
    nodes: function nodes() {
      return [{
        name: 'emoji',
        node: _adfSchema.emoji
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'emoji',
        plugin: function plugin(pmPluginFactoryParams) {
          return createEmojiPlugin(pmPluginFactoryParams);
        }
      }, {
        name: 'emojiAsciiInputRule',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema,
              providerFactory = _ref5.providerFactory,
              featureFlags = _ref5.featureFlags;
          return (0, _asciiInputRules.inputRulePlugin)(schema, providerFactory, featureFlags);
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref6) {
        var formatMessage = _ref6.formatMessage;
        return [{
          id: 'emoji',
          title: formatMessage(_messages.messages.emoji),
          description: formatMessage(_messages.messages.emojiDescription),
          priority: 500,
          keyshortcut: ':',
          icon: function icon() {
            return /*#__PURE__*/_react.default.createElement(_assets.IconEmoji, null);
          },
          action: function action(insert, state) {
            var tr = insert(undefined);
            (0, _openTypeaheadAtCursor.openTypeAheadAtCursor)({
              triggerHandler: typeAhead,
              inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
            })(tr);
            return (0, _analytics.addAnalytics)(state, tr, {
              action: _analytics.ACTION.INVOKED,
              actionSubject: _analytics.ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: _analytics.ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
              attributes: {
                inputMethod: _analytics.INPUT_METHOD.QUICK_INSERT
              },
              eventType: _analytics.EVENT_TYPE.UI
            });
          }
        }];
      },
      typeAhead: typeAhead
    }
  };
};

var _default = emojiPlugin;
/**
 * Actions
 */

exports.default = _default;
var ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_RESULTS: 'SET_RESULTS',
  SET_ASCII_MAP: 'SET_ASCII_MAP'
};
exports.ACTIONS = ACTIONS;

var setAsciiMap = function setAsciiMap(asciiMap) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(emojiPluginKey, {
        action: ACTIONS.SET_ASCII_MAP,
        params: {
          asciiMap: asciiMap
        }
      }));
    }

    return true;
  };
};

var setProvider = function setProvider(provider) {
  return function (state, dispatch) {
    if (dispatch) {
      dispatch(state.tr.setMeta(emojiPluginKey, {
        action: ACTIONS.SET_PROVIDER,
        params: {
          provider: provider
        }
      }));
    }

    return true;
  };
};

exports.setProvider = setProvider;
var emojiPluginKey = new _prosemirrorState.PluginKey('emojiPlugin');
exports.emojiPluginKey = emojiPluginKey;

function getEmojiPluginState(state) {
  return emojiPluginKey.getState(state) || {};
}

function createEmojiPlugin(pmPluginFactoryParams) {
  return new _safePlugin.SafePlugin({
    key: emojiPluginKey,
    state: {
      init: function init() {
        return {};
      },
      apply: function apply(tr, pluginState) {
        var _ref7 = tr.getMeta(emojiPluginKey) || {
          action: null,
          params: null
        },
            action = _ref7.action,
            params = _ref7.params;

        var newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
              emojiProvider: params.provider
            });
            pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_ASCII_MAP:
            newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
              asciiMap: params.asciiMap
            });
            pmPluginFactoryParams.dispatch(emojiPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      }
    },
    props: {
      nodeViews: {
        emoji: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: _emoji3.EmojiNodeView,
          extraComponentProps: {
            providerFactory: pmPluginFactoryParams.providerFactory
          }
        })
      }
    },
    view: function view(editorView) {
      var providerHandler = function providerHandler(name, providerPromise) {
        switch (name) {
          case 'emojiProvider':
            if (!providerPromise) {
              return setProvider(undefined)(editorView.state, editorView.dispatch);
            }

            providerPromise.then(function (provider) {
              setProvider(provider)(editorView.state, editorView.dispatch);
              provider.getAsciiMap().then(function (asciiMap) {
                setAsciiMap(asciiMap)(editorView.state, editorView.dispatch);
              });
            }).catch(function () {
              return setProvider(undefined)(editorView.state, editorView.dispatch);
            });
            break;
        }

        return;
      };

      pmPluginFactoryParams.providerFactory.subscribe('emojiProvider', providerHandler);
      return {
        destroy: function destroy() {
          if (pmPluginFactoryParams.providerFactory) {
            pmPluginFactoryParams.providerFactory.unsubscribe('emojiProvider', providerHandler);
          }
        }
      };
    }
  });
}
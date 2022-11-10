import React from 'react';
import uuid from 'uuid';
import { ELEMENTS_CHANNEL } from '@atlaskit/mention/resource';
import { mention } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { isTypeAheadAllowed } from '../type-ahead/utils';
import ToolbarMention from './ui/ToolbarMention';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { IconMention } from '../quick-insert/assets';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { openTypeAheadAtCursor } from '../type-ahead/transforms/open-typeahead-at-cursor';
import { createTypeAheadConfig } from './type-ahead';
import { mentionPluginKey } from './pm-plugins/key';
import { createMentionPlugin } from './pm-plugins/main';
export { mentionPluginKey };

var mentionsPlugin = function mentionsPlugin(options) {
  var sessionId = uuid();

  var fireEvent = function fireEvent(payload) {
    if (!(options !== null && options !== void 0 && options.createAnalyticsEvent)) {
      return;
    }

    var createAnalyticsEvent = options.createAnalyticsEvent;

    if (payload.attributes && !payload.attributes.sessionId) {
      payload.attributes.sessionId = sessionId;
    }

    createAnalyticsEvent(payload).fire(ELEMENTS_CHANNEL);
  };

  var typeAhead = createTypeAheadConfig({
    sanitizePrivateContent: options === null || options === void 0 ? void 0 : options.sanitizePrivateContent,
    mentionInsertDisplayName: options === null || options === void 0 ? void 0 : options.insertDisplayName,
    HighlightComponent: options === null || options === void 0 ? void 0 : options.HighlightComponent,
    fireEvent: fireEvent
  });
  return {
    name: 'mention',
    nodes: function nodes() {
      return [{
        name: 'mention',
        node: mention
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'mention',
        plugin: function plugin(pmPluginFactoryParams) {
          return createMentionPlugin(pmPluginFactoryParams, fireEvent, options);
        }
      }];
    },
    secondaryToolbarComponent: function secondaryToolbarComponent(_ref) {
      var editorView = _ref.editorView,
          disabled = _ref.disabled;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: editorView,
        plugins: {
          mentionState: mentionPluginKey
        },
        render: function render(_ref2) {
          var _ref2$mentionState = _ref2.mentionState,
              mentionState = _ref2$mentionState === void 0 ? {} : _ref2$mentionState;
          return !mentionState.mentionProvider ? null : /*#__PURE__*/React.createElement(ToolbarMention, {
            editorView: editorView,
            isDisabled: disabled || isTypeAheadAllowed(editorView.state)
          });
        }
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'mention',
          title: formatMessage(messages.mention),
          description: formatMessage(messages.mentionDescription),
          keywords: ['team', 'user'],
          priority: 400,
          keyshortcut: '@',
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconMention, null);
          },
          action: function action(insert, state) {
            var tr = insert(undefined);
            openTypeAheadAtCursor({
              triggerHandler: typeAhead,
              inputMethod: INPUT_METHOD.QUICK_INSERT
            })(tr);
            return addAnalytics(state, tr, {
              action: ACTION.INVOKED,
              actionSubject: ACTION_SUBJECT.TYPEAHEAD,
              actionSubjectId: ACTION_SUBJECT_ID.TYPEAHEAD_MENTION,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              },
              eventType: EVENT_TYPE.UI
            });
          }
        }];
      },
      typeAhead: typeAhead
    }
  };
};

export default mentionsPlugin;
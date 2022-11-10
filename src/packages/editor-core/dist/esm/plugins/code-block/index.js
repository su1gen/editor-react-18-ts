import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { codeBlock } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import { getToolbarConfig } from './toolbar';
import keymap from './pm-plugins/keymaps';
import ideUX from './pm-plugins/ide-ux';
import { codeBlockCopySelectionPlugin } from './pm-plugins/codeBlockCopySelectionPlugin';
import { addAnalytics, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, INPUT_METHOD, EVENT_TYPE } from '../analytics';
import { IconCode } from '../quick-insert/assets';
import { messages } from '../block-type/messages';
import refreshBrowserSelectionOnChange from './refresh-browser-selection';

var codeBlockPlugin = function codeBlockPlugin(options) {
  return {
    name: 'codeBlock',
    nodes: function nodes() {
      return [{
        name: 'codeBlock',
        node: codeBlock
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'codeBlock',
        plugin: function plugin(_ref) {
          var getIntl = _ref.getIntl;
          return createPlugin(_objectSpread(_objectSpread({}, options), {}, {
            getIntl: getIntl,
            appearance: options.appearance
          }));
        }
      }, {
        name: 'codeBlockIDEKeyBindings',
        plugin: function plugin() {
          return ideUX;
        }
      }, {
        name: 'codeBlockKeyMap',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema;
          return keymap(schema);
        }
      }, {
        name: 'codeBlockCopySelection',
        plugin: function plugin() {
          return codeBlockCopySelectionPlugin();
        }
      }];
    },
    // Workaround for a firefox issue where dom selection is off sync
    // https://product-fabric.atlassian.net/browse/ED-12442
    onEditorViewStateUpdated: function onEditorViewStateUpdated(props) {
      refreshBrowserSelectionOnChange(props.originalTransaction, props.newEditorState);
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref3) {
        var formatMessage = _ref3.formatMessage;
        return [{
          id: 'codeblock',
          title: formatMessage(messages.codeblock),
          description: formatMessage(messages.codeblockDescription),
          keywords: ['code block'],
          priority: 700,
          keyshortcut: '```',
          icon: function icon() {
            return /*#__PURE__*/React.createElement(IconCode, null);
          },
          action: function action(insert, state) {
            var schema = state.schema;
            var tr = insert(schema.nodes.codeBlock.createChecked());
            return addAnalytics(state, tr, {
              action: ACTION.INSERTED,
              actionSubject: ACTION_SUBJECT.DOCUMENT,
              actionSubjectId: ACTION_SUBJECT_ID.CODE_BLOCK,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              },
              eventType: EVENT_TYPE.TRACK
            });
          }
        }];
      },
      floatingToolbar: getToolbarConfig(options.allowCopyToClipboard)
    }
  };
};

export default codeBlockPlugin;
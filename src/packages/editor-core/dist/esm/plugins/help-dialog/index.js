import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { keymap } from 'prosemirror-keymap';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import * as keymaps from '../../keymaps';
import { openHelp, tooltip } from '../../keymaps';
import WithPluginState from '../../ui/WithPluginState';
import { HelpDialogLoader } from './ui/HelpDialogLoader';
import { pluginKey as quickInsertPluginKey } from '../quick-insert';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../../plugins/analytics';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { openHelpCommand } from './commands';
import { pluginKey } from './plugin-key';
export function createPlugin(dispatch, imageEnabled) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init() {
        return {
          isVisible: false,
          imageEnabled: imageEnabled
        };
      },
      apply: function apply(tr, _value, state) {
        var isVisible = tr.getMeta(pluginKey);
        var currentState = pluginKey.getState(state);

        if (isVisible !== undefined && isVisible !== currentState.isVisible) {
          var newState = _objectSpread(_objectSpread({}, currentState), {}, {
            isVisible: isVisible
          });

          dispatch(pluginKey, newState);
          return newState;
        }

        return currentState;
      }
    }
  });
}

var helpDialog = function helpDialog(legacyImageUploadProvider) {
  return {
    name: 'helpDialog',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'helpDialog',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, !!legacyImageUploadProvider);
        }
      }, {
        name: 'helpDialogKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    },
    pluginsOptions: {
      quickInsert: function quickInsert(_ref2) {
        var formatMessage = _ref2.formatMessage;
        return [{
          id: 'helpdialog',
          title: formatMessage(messages.help),
          description: formatMessage(messages.helpDescription),
          keywords: ['?'],
          priority: 4000,
          keyshortcut: tooltip(openHelp),
          icon: function icon() {
            return /*#__PURE__*/React.createElement(QuestionCircleIcon, {
              label: ""
            });
          },
          action: function action(insert, state) {
            var tr = insert('');
            openHelpCommand(tr);
            return addAnalytics(state, tr, {
              action: ACTION.HELP_OPENED,
              actionSubject: ACTION_SUBJECT.HELP,
              actionSubjectId: ACTION_SUBJECT_ID.HELP_QUICK_INSERT,
              attributes: {
                inputMethod: INPUT_METHOD.QUICK_INSERT
              },
              eventType: EVENT_TYPE.UI
            });
          }
        }];
      }
    },
    contentComponent: function contentComponent(_ref3) {
      var editorView = _ref3.editorView;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          helpDialog: pluginKey,
          quickInsert: quickInsertPluginKey
        },
        render: function render(_ref4) {
          var _ref4$helpDialog = _ref4.helpDialog,
              helpDialog = _ref4$helpDialog === void 0 ? {} : _ref4$helpDialog,
              quickInsert = _ref4.quickInsert;
          return /*#__PURE__*/React.createElement(HelpDialogLoader, {
            editorView: editorView,
            isVisible: helpDialog.isVisible,
            quickInsertEnabled: !!quickInsert,
            imageEnabled: helpDialog.imageEnabled
          });
        }
      });
    }
  };
};

var keymapPlugin = function keymapPlugin() {
  var list = {};
  keymaps.bindKeymapWithCommand(keymaps.openHelp.common, function (state, dispatch) {
    var tr = state.tr;
    var isVisible = tr.getMeta(pluginKey);

    if (!isVisible) {
      tr = addAnalytics(state, tr, {
        action: ACTION.CLICKED,
        actionSubject: ACTION_SUBJECT.BUTTON,
        actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
        attributes: {
          inputMethod: INPUT_METHOD.SHORTCUT
        },
        eventType: EVENT_TYPE.UI
      });
      openHelpCommand(tr, dispatch);
    }

    return true;
  }, list);
  return keymap(list);
};

export default helpDialog;
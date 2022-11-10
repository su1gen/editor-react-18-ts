import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import { status } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { messages } from '../insert-block/ui/ToolbarInsertBlock/messages';
import { IconStatus } from '../quick-insert/assets';
import { commitStatusPicker, createStatus, updateStatus } from './actions';
import { keymapPlugin } from './keymap';
import createStatusPlugin from './plugin';
import { pluginKey } from './plugin-key';
import StatusPicker from './ui/statusPicker';

var baseStatusPlugin = function baseStatusPlugin(options) {
  return {
    name: 'status',
    nodes: function nodes() {
      return [{
        name: 'status',
        node: status
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'status',
        plugin: function plugin(pmPluginFactoryParams) {
          return createStatusPlugin(pmPluginFactoryParams, options);
        }
      }, {
        name: 'statusKeymap',
        plugin: keymapPlugin
      }];
    },
    contentComponent: function contentComponent(_ref) {
      var editorView = _ref.editorView;
      var domAtPos = editorView.domAtPos.bind(editorView);
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          statusState: pluginKey
        },
        render: function render(_ref2) {
          var _ref2$statusState = _ref2.statusState,
              statusState = _ref2$statusState === void 0 ? {} : _ref2$statusState;
          var showStatusPickerAt = statusState.showStatusPickerAt;

          if (typeof showStatusPickerAt !== 'number') {
            return null;
          }

          var target = findDomRefAtPos(showStatusPickerAt, domAtPos);
          var statusNode = editorView.state.doc.nodeAt(showStatusPickerAt);

          if (!statusNode || statusNode.type.name !== 'status') {
            return null;
          }

          var _statusNode$attrs = statusNode.attrs,
              text = _statusNode$attrs.text,
              color = _statusNode$attrs.color,
              localId = _statusNode$attrs.localId;
          return /*#__PURE__*/React.createElement(StatusPicker, {
            isNew: statusState.isNew,
            target: target,
            defaultText: text,
            defaultColor: color,
            defaultLocalId: localId,
            onSelect: function onSelect(status) {
              updateStatus(status)(editorView.state, editorView.dispatch);
            },
            onTextChanged: function onTextChanged(status) {
              updateStatus(status)(editorView.state, editorView.dispatch);
            },
            closeStatusPicker: function closeStatusPicker() {
              commitStatusPicker()(editorView);
            },
            onEnter: function onEnter() {
              commitStatusPicker()(editorView);
            }
          });
        }
      });
    }
  };
};

var decorateWithPluginOptions = function decorateWithPluginOptions(plugin, options) {
  if (options.menuDisabled === true) {
    return plugin;
  }

  plugin.pluginsOptions = {
    quickInsert: function quickInsert(_ref3) {
      var formatMessage = _ref3.formatMessage;
      return [{
        id: 'status',
        title: formatMessage(messages.status),
        description: formatMessage(messages.statusDescription),
        priority: 700,
        keywords: ['lozenge'],
        icon: function icon() {
          return /*#__PURE__*/React.createElement(IconStatus, null);
        },
        action: function action(insert, state) {
          return addAnalytics(state, createStatus()(insert, state), {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.STATUS,
            attributes: {
              inputMethod: INPUT_METHOD.QUICK_INSERT
            },
            eventType: EVENT_TYPE.TRACK
          });
        }
      }];
    }
  };
  return plugin;
};

var statusPlugin = function statusPlugin(options) {
  return decorateWithPluginOptions(baseStatusPlugin(options), options);
};

export default statusPlugin;
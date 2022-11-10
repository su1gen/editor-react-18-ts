import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import React from 'react';
import { blockquote, hardBreak, heading } from '@atlaskit/adf-schema';
import { createPlugin, pluginKey } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import inputRulePlugin from './pm-plugins/input-rule';
import ToolbarBlockType from './ui/ToolbarBlockType';
import WithPluginState from '../../ui/WithPluginState';
import { setBlockTypeWithAnalytics } from './commands';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, addAnalytics, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import * as keymaps from '../../keymaps';
import { IconHeading, IconQuote } from '../quick-insert/assets';
import { messages } from './messages';
import { ToolbarSize } from '../../ui/Toolbar/types';

var headingPluginOptions = function headingPluginOptions(_ref, isAllowed) {
  var formatMessage = _ref.formatMessage;

  if (!isAllowed) {
    return [];
  }

  return Array.from({
    length: 6
  }, function (_v, idx) {
    var level = idx + 1;
    var descriptionDescriptor = messages["heading".concat(level, "Description")];
    var keyshortcut = keymaps.tooltip(keymaps["toggleHeading".concat(level)]);
    var id = "heading".concat(level);
    return {
      id: id,
      title: formatMessage(messages[id]),
      description: formatMessage(descriptionDescriptor),
      priority: 1300,
      keywords: ["h".concat(level)],
      keyshortcut: keyshortcut,
      icon: function icon() {
        return /*#__PURE__*/React.createElement(IconHeading, {
          level: level
        });
      },
      action: function action(insert, state) {
        var tr = insert(state.schema.nodes.heading.createChecked({
          level: level
        }));
        return addAnalytics(state, tr, {
          action: ACTION.FORMATTED,
          actionSubject: ACTION_SUBJECT.TEXT,
          eventType: EVENT_TYPE.TRACK,
          actionSubjectId: ACTION_SUBJECT_ID.FORMAT_HEADING,
          attributes: {
            inputMethod: INPUT_METHOD.QUICK_INSERT,
            newHeadingLevel: level
          }
        });
      }
    };
  });
};

var blockquotePluginOptions = function blockquotePluginOptions(_ref2, isAllowed) {
  var formatMessage = _ref2.formatMessage;

  if (!isAllowed) {
    return [];
  }

  return [{
    id: 'blockquote',
    title: formatMessage(messages.blockquote),
    description: formatMessage(messages.blockquoteDescription),
    priority: 1300,
    keyshortcut: keymaps.tooltip(keymaps.toggleBlockQuote),
    icon: function icon() {
      return /*#__PURE__*/React.createElement(IconQuote, null);
    },
    action: function action(insert, state) {
      var tr = insert(state.schema.nodes.blockquote.createChecked({}, state.schema.nodes.paragraph.createChecked()));
      return addAnalytics(state, tr, {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        eventType: EVENT_TYPE.TRACK,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_BLOCK_QUOTE,
        attributes: {
          inputMethod: INPUT_METHOD.QUICK_INSERT
        }
      });
    }
  }];
};

var blockTypePlugin = function blockTypePlugin(options) {
  return {
    name: 'blockType',
    nodes: function nodes() {
      var nodes = [{
        name: 'heading',
        node: heading
      }, {
        name: 'blockquote',
        node: blockquote
      }, {
        name: 'hardBreak',
        node: hardBreak
      }];

      if (options && options.allowBlockType) {
        var exclude = options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
        return nodes.filter(function (node) {
          return exclude.indexOf(node.name) === -1;
        });
      }

      return nodes;
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'blockType',
        plugin: function plugin(_ref3) {
          var dispatch = _ref3.dispatch;
          return createPlugin(dispatch, options && options.lastNodeMustBeParagraph);
        }
      }, {
        name: 'blockTypeInputRule',
        plugin: function plugin(_ref4) {
          var schema = _ref4.schema,
              featureFlags = _ref4.featureFlags;
          return inputRulePlugin(schema, featureFlags);
        }
      }, // Needs to be lower priority than editor-tables.tableEditing
      // plugin as it is currently swallowing right/down arrow events inside tables
      {
        name: 'blockTypeKeyMap',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema,
              featureFlags = _ref5.featureFlags;
          return keymapPlugin(schema, featureFlags);
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref6) {
      var editorView = _ref6.editorView,
          popupsMountPoint = _ref6.popupsMountPoint,
          popupsBoundariesElement = _ref6.popupsBoundariesElement,
          popupsScrollableElement = _ref6.popupsScrollableElement,
          toolbarSize = _ref6.toolbarSize,
          disabled = _ref6.disabled,
          isToolbarReducedSpacing = _ref6.isToolbarReducedSpacing,
          eventDispatcher = _ref6.eventDispatcher;
      var isSmall = options && options.isUndoRedoButtonsEnabled ? toolbarSize < ToolbarSize.XXL : toolbarSize < ToolbarSize.XL;

      var boundSetBlockType = function boundSetBlockType(name) {
        return setBlockTypeWithAnalytics(name, INPUT_METHOD.TOOLBAR)(editorView.state, editorView.dispatch);
      };

      return /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: editorView,
        eventDispatcher: eventDispatcher,
        plugins: {
          pluginState: pluginKey
        },
        render: function render(_ref7) {
          var pluginState = _ref7.pluginState;
          return /*#__PURE__*/React.createElement(ToolbarBlockType, {
            isSmall: isSmall,
            isDisabled: disabled,
            isReducedSpacing: isToolbarReducedSpacing,
            setBlockType: boundSetBlockType,
            pluginState: pluginState,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement
          });
        }
      });
    },
    pluginsOptions: {
      quickInsert: function quickInsert(intl) {
        var exclude = options && options.allowBlockType && options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
        return [].concat(_toConsumableArray(blockquotePluginOptions(intl, exclude.indexOf('blockquote') === -1)), _toConsumableArray(headingPluginOptions(intl, exclude.indexOf('heading') === -1)));
      }
    }
  };
};

export default blockTypePlugin;
export { pluginKey } from './pm-plugins/main';
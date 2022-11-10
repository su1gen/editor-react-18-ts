import React from 'react';
import { code, em, strike, strong, subsup, underline } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { plugin as textFormattingPlugin, pluginKey as textFormattingPluginKey } from './pm-plugins/main';
import { plugin as clearFormattingPlugin, pluginKey as clearFormattingPluginKey } from './pm-plugins/clear-formatting';
import clearFormattingKeymapPlugin from './pm-plugins/clear-formatting-keymap';
import textFormattingCursorPlugin from './pm-plugins/cursor';
import textFormattingInputRulePlugin from './pm-plugins/input-rule';
import keymapPlugin from './pm-plugins/keymap';
import textFormattingSmartInputRulePlugin from './pm-plugins/smart-input-rule';
import Toolbar from './ui/Toolbar';

var textFormatting = function textFormatting() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'textFormatting',
    marks: function marks() {
      return [{
        name: 'em',
        mark: em
      }, {
        name: 'strong',
        mark: strong
      }, {
        name: 'strike',
        mark: strike
      }].concat(options.disableCode ? [] : {
        name: 'code',
        mark: code
      }).concat(options.disableSuperscriptAndSubscript ? [] : {
        name: 'subsup',
        mark: subsup
      }).concat(options.disableUnderline ? [] : {
        name: 'underline',
        mark: underline
      });
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'textFormatting',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return textFormattingPlugin(dispatch);
        }
      }, {
        name: 'textFormattingCursor',
        plugin: function plugin() {
          return textFormattingCursorPlugin;
        }
      }, {
        name: 'textFormattingInputRule',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              featureFlags = _ref2.featureFlags;
          return textFormattingInputRulePlugin(schema, featureFlags);
        }
      }, {
        name: 'textFormattingSmartRule',
        plugin: function plugin(_ref3) {
          var featureFlags = _ref3.featureFlags;
          return !options.disableSmartTextCompletion ? textFormattingSmartInputRulePlugin(featureFlags) : undefined;
        }
      }, {
        name: 'textFormattingClear',
        plugin: function plugin(_ref4) {
          var dispatch = _ref4.dispatch;
          return clearFormattingPlugin(dispatch);
        }
      }, {
        name: 'textFormattingClearKeymap',
        plugin: function plugin() {
          return clearFormattingKeymapPlugin();
        }
      }, {
        name: 'textFormattingKeymap',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema;
          return keymapPlugin(schema);
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref6) {
      var editorView = _ref6.editorView,
          popupsMountPoint = _ref6.popupsMountPoint,
          popupsScrollableElement = _ref6.popupsScrollableElement,
          isToolbarReducedSpacing = _ref6.isToolbarReducedSpacing,
          toolbarSize = _ref6.toolbarSize,
          disabled = _ref6.disabled;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          textFormattingState: textFormattingPluginKey,
          clearFormattingPluginState: clearFormattingPluginKey
        },
        render: function render() {
          return /*#__PURE__*/React.createElement(Toolbar, {
            editorState: editorView.state,
            popupsMountPoint: popupsMountPoint,
            popupsScrollableElement: popupsScrollableElement,
            toolbarSize: toolbarSize,
            isReducedSpacing: isToolbarReducedSpacing,
            editorView: editorView,
            isToolbarDisabled: disabled,
            shouldUseResponsiveToolbar: Boolean(options.responsiveToolbarMenu)
          });
        }
      });
    }
  };
};

export default textFormatting;
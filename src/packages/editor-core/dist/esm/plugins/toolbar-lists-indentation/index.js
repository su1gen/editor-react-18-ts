import React from 'react';
import ToolbarListsIndentation from './ui';
import WithPluginState from '../../ui/WithPluginState';
import { ToolbarSize } from '../../ui/Toolbar/types';
import { pluginKey as listPluginKey } from '../list/pm-plugins/main';
import { pluginKey as indentationButtonsPluginKey, createPlugin as indentationButtonsPlugin } from './pm-plugins/indentation-buttons';

var toolbarListsIndentationPlugin = function toolbarListsIndentationPlugin(_ref) {
  var showIndentationButtons = _ref.showIndentationButtons,
      allowHeadingAndParagraphIndentation = _ref.allowHeadingAndParagraphIndentation;
  return {
    name: 'toolbarListsIndentation',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'indentationButtons',
        plugin: function plugin(_ref2) {
          var dispatch = _ref2.dispatch;
          return indentationButtonsPlugin({
            dispatch: dispatch,
            showIndentationButtons: showIndentationButtons,
            allowHeadingAndParagraphIndentation: allowHeadingAndParagraphIndentation
          });
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref3) {
      var editorView = _ref3.editorView,
          popupsMountPoint = _ref3.popupsMountPoint,
          popupsBoundariesElement = _ref3.popupsBoundariesElement,
          popupsScrollableElement = _ref3.popupsScrollableElement,
          toolbarSize = _ref3.toolbarSize,
          disabled = _ref3.disabled,
          isToolbarReducedSpacing = _ref3.isToolbarReducedSpacing;
      var isSmall = toolbarSize < ToolbarSize.L;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          listState: listPluginKey,
          indentationState: indentationButtonsPluginKey
        },
        render: function render(_ref4) {
          var listState = _ref4.listState,
              indentationState = _ref4.indentationState;

          if (!listState) {
            return null;
          }

          return /*#__PURE__*/React.createElement(ToolbarListsIndentation, {
            isSmall: isSmall,
            isReducedSpacing: isToolbarReducedSpacing,
            disabled: disabled,
            editorView: editorView,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement,
            bulletListActive: listState.bulletListActive,
            bulletListDisabled: listState.bulletListDisabled,
            orderedListActive: listState.orderedListActive,
            orderedListDisabled: listState.orderedListDisabled,
            showIndentationButtons: !!showIndentationButtons,
            indentDisabled: indentationState.indentDisabled,
            outdentDisabled: indentationState.outdentDisabled
          });
        }
      });
    }
  };
};

export default toolbarListsIndentationPlugin;
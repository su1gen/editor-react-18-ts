import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
// #region Imports
import React from 'react';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { panelPlugin, listPlugin, textColorPlugin, breakoutPlugin, jiraIssuePlugin, extensionPlugin, rulePlugin, datePlugin, layoutPlugin, indentationPlugin, cardPlugin, statusPlugin, mediaPlugin, mentionsPlugin, tasksAndDecisionsPlugin, insertBlockPlugin, basePlugin, placeholderPlugin } from '../../../plugins';
import { PresetProvider } from '../Editor';
import { useDefaultPreset } from './default'; // #endregion

export function useCXHTMLPreset(_ref) {
  var mentionProvider = _ref.mentionProvider,
      mediaProvider = _ref.mediaProvider,
      placeholder = _ref.placeholder,
      featureFlags = _ref.featureFlags;

  var _useDefaultPreset = useDefaultPreset({
    featureFlags: featureFlags,
    paste: {
      plainTextPasteLinkification: featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.plainTextPasteLinkification
    }
  }),
      _useDefaultPreset2 = _slicedToArray(_useDefaultPreset, 1),
      preset = _useDefaultPreset2[0];

  preset.add([basePlugin, {
    allowInlineCursorTarget: true,
    allowScrollGutter: {
      getScrollElement: function getScrollElement(_view) {
        return document.querySelector('.fabric-editor-popup-scroll-parent') || null;
      }
    }
  }]);
  preset.add([tablesPlugin, {
    tableOptions: {
      advanced: true
    }
  }]);
  preset.add([panelPlugin, {
    allowCustomPanel: true
  }]);
  preset.add(listPlugin);
  preset.add(textColorPlugin);
  preset.add(breakoutPlugin);
  preset.add(jiraIssuePlugin);
  preset.add(extensionPlugin);
  preset.add(rulePlugin);
  preset.add(datePlugin);
  preset.add(layoutPlugin);
  preset.add(indentationPlugin);
  preset.add([cardPlugin, {
    allowBlockCards: true,
    platform: 'web'
  }]);
  preset.add([statusPlugin, {
    menuDisabled: false
  }]);
  preset.add(tasksAndDecisionsPlugin);
  preset.add(insertBlockPlugin);
  preset.add([placeholderPlugin, {
    placeholder: placeholder
  }]);

  if (mentionProvider) {
    preset.add(mentionsPlugin);
  }

  if (mediaProvider) {
    preset.add([mediaPlugin, {
      provider: mediaProvider,
      allowMediaSingle: true,
      allowMediaGroup: true,
      allowResizing: true,
      allowLinking: true,
      allowResizingInTables: true,
      allowAltTextOnImages: true
    }]);
  }

  return [preset];
}
export function EditorPresetCXHTML(props) {
  var children = props.children,
      excludes = props.excludes;

  var _useCXHTMLPreset = useCXHTMLPreset(props),
      _useCXHTMLPreset2 = _slicedToArray(_useCXHTMLPreset, 1),
      preset = _useCXHTMLPreset2[0];

  var plugins = preset.getEditorPlugins(excludes);
  return /*#__PURE__*/React.createElement(PresetProvider, {
    value: plugins
  }, children);
}
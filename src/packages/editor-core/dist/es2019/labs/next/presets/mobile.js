// #region Imports
import React from 'react';
import { useProvider, useProviderFactory } from '@atlaskit/editor-common/provider-factory';
import analyticsPlugin from '../../../plugins/analytics';
import basePlugin from '../../../plugins/base';
import cardPlugin from '../../../plugins/card';
import datePlugin from '../../../plugins/date';
import emojiPlugin from '../../../plugins/emoji';
import extensionPlugin from '../../../plugins/extension';
import layoutPlugin from '../../../plugins/layout';
import listPlugin from '../../../plugins/list';
import mediaPlugin from '../../../plugins/media';
import mentionsPlugin from '../../../plugins/mentions';
import mobileDimensionsPlugin from '../../../plugins/mobile-dimensions';
import panelPlugin from '../../../plugins/panel';
import placeholderPlugin from '../../../plugins/placeholder';
import rulePlugin from '../../../plugins/rule';
import statusPlugin from '../../../plugins/status';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import tasksAndDecisionsPlugin from '../../../plugins/tasks-and-decisions';
import textColorPlugin from '../../../plugins/text-color';
import maxContentSizePlugin from '../../../plugins/max-content-size';
import expandPlugin from '../../../plugins/expand';
import selectionPlugin from '../../../plugins/selection';
import { PresetProvider } from '../Editor';
import { useDefaultPreset } from './default';
import { addExcludesFromProviderFactory } from './utils';
import { quickInsertPlugin } from '../../../plugins'; // #endregion

export function useMobilePreset({
  media,
  placeholder,
  maxContentSize,
  createAnalyticsEvent,
  featureFlags
}) {
  const mediaProvider = useProvider('mediaProvider');
  const [preset] = useDefaultPreset({
    featureFlags,
    paste: {
      plainTextPasteLinkification: featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags.plainTextPasteLinkification
    }
  });
  preset.add([basePlugin, {
    allowScrollGutter: {
      getScrollElement: () => document.body,
      allowCustomScrollHandler: false
    }
  }]);
  preset.add([analyticsPlugin, createAnalyticsEvent]);
  preset.add([tablesPlugin, {
    tableOptions: {
      allowControls: false
    }
  }]);
  preset.add(panelPlugin);
  preset.add(listPlugin);
  preset.add(textColorPlugin);
  preset.add(extensionPlugin);
  preset.add(rulePlugin);
  preset.add(datePlugin);
  preset.add(layoutPlugin);
  preset.add([quickInsertPlugin, {
    headless: true,
    disableDefaultItems: true
  }]);
  preset.add([statusPlugin, {
    menuDisabled: false
  }]);
  preset.add([placeholderPlugin, {
    placeholder
  }]);
  preset.add(mobileDimensionsPlugin);
  preset.add(expandPlugin);
  preset.add([selectionPlugin, {
    useLongPressSelection: false
  }]); // Begin -> This would be exclude if the provider doesnt exist in the factory

  preset.add(tasksAndDecisionsPlugin);
  preset.add([cardPlugin, {
    allowBlockCards: true,
    platform: 'mobile'
  }]);
  preset.add([mentionsPlugin]);
  preset.add([emojiPlugin]); // End

  if (maxContentSize) {
    preset.add([maxContentSizePlugin, maxContentSize]);
  }

  if (media) {
    preset.add([mediaPlugin, {
      provider: mediaProvider,
      customMediaPicker: media.picker,
      fullWidthEnabled: false,
      allowMediaSingle: true,
      allowLazyLoading: false,
      allowMediaSingleEditable: false,
      allowRemoteDimensionsFetch: false,
      allowMarkingUploadsAsIncomplete: true,
      allowAltTextOnImages: true,
      allowTemplatePlaceholders: {
        allowInserting: true
      }
    }]);
  }

  return [preset];
}
export function EditorPresetMobile(props) {
  const {
    children,
    excludes
  } = props;
  const [preset] = useMobilePreset(props);
  const providerFactory = useProviderFactory();
  const plugins = preset.getEditorPlugins(addExcludesFromProviderFactory(providerFactory, excludes));
  return /*#__PURE__*/React.createElement(PresetProvider, {
    value: plugins
  }, children);
}
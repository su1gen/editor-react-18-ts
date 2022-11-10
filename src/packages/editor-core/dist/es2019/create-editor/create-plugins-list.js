import { breakoutPlugin, collabEditPlugin, dataConsumerMarkPlugin, datePlugin, emojiPlugin, extensionPlugin, fragmentMarkPlugin, helpDialogPlugin, imageUploadPlugin, insertBlockPlugin, jiraIssuePlugin, layoutPlugin, listPlugin, toolbarListsIndentationPlugin, macroPlugin, maxContentSizePlugin, mediaPlugin, mentionsPlugin, panelPlugin, placeholderTextPlugin, rulePlugin, saveOnEnterPlugin, tasksAndDecisionsPlugin, textColorPlugin, cardPlugin, gridPlugin, statusPlugin, alignmentPlugin, indentationPlugin, analyticsPlugin, customAutoformatPlugin, feedbackDialogPlugin, historyPlugin, expandPlugin, isExpandInsertionEnabled, scrollIntoViewPlugin, mobileDimensionsPlugin, findReplacePlugin, contextPanelPlugin, mobileSelectionPlugin, annotationPlugin, captionPlugin, avatarGroupPlugin, viewUpdateSubscriptionPlugin, beforePrimaryToolbarPlugin, codeBidiWarningPlugin, copyButtonPlugin } from '../plugins';
import { tablesPlugin } from '@atlaskit/editor-plugin-table';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';
import { GUTTER_SIZE_MOBILE_IN_PX } from '../plugins/base/pm-plugins/scroll-gutter';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { createDefaultPreset } from '../labs/next/presets/default';
import { shouldForceTracking } from '@atlaskit/editor-common/utils';

const isCodeBlockAllowed = options => {
  const exclude = options && options.allowBlockType && options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
  return exclude.indexOf('codeBlock') === -1;
};

export function getScrollGutterOptions(props) {
  const {
    appearance,
    persistScrollGutter
  } = props;

  if (fullPageCheck(appearance)) {
    // Full Page appearance uses a scrollable div wrapper
    return {
      getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent')
    };
  }

  if (appearance === 'mobile') {
    // Mobile appearance uses body scrolling for improved performance on low powered devices.
    return {
      getScrollElement: () => document.body,
      allowCustomScrollHandler: false,
      persistScrollGutter,
      gutterSize: GUTTER_SIZE_MOBILE_IN_PX
    };
  }

  return undefined;
}
export function getDefaultPresetOptionsFromEditorProps(props, createAnalyticsEvent) {
  var _props$performanceTra, _props$linking, _props$featureFlags, _props$performanceTra2, _props$textFormatting, _props$linking2;

  const appearance = props.appearance;
  const isMobile = appearance === 'mobile';
  const inputTracking = (_props$performanceTra = props.performanceTracking) === null || _props$performanceTra === void 0 ? void 0 : _props$performanceTra.inputTracking;
  const cardOptions = ((_props$linking = props.linking) === null || _props$linking === void 0 ? void 0 : _props$linking.smartLinks) || props.smartLinks || props.UNSAFE_cards;
  return {
    createAnalyticsEvent,
    typeAhead: {
      createAnalyticsEvent,
      isMobile
    },
    featureFlags: createFeatureFlagsFromProps(props),
    paste: {
      cardOptions,
      sanitizePrivateContent: props.sanitizePrivateContent,
      plainTextPasteLinkification: ((_props$featureFlags = props.featureFlags) === null || _props$featureFlags === void 0 ? void 0 : _props$featureFlags.plainTextPasteLinkification) === true
    },
    base: {
      allowInlineCursorTarget: !isMobile,
      allowScrollGutter: getScrollGutterOptions(props),
      inputTracking,
      browserFreezeTracking: (_props$performanceTra2 = props.performanceTracking) === null || _props$performanceTra2 === void 0 ? void 0 : _props$performanceTra2.bFreezeTracking,
      ufo: createFeatureFlagsFromProps(props).ufo
    },
    blockType: {
      lastNodeMustBeParagraph: appearance === 'comment' || appearance === 'chromeless',
      allowBlockType: props.allowBlockType,
      isUndoRedoButtonsEnabled: props.allowUndoRedoButtons
    },
    placeholder: {
      placeholder: props.placeholder,
      placeholderHints: props.placeholderHints,
      placeholderBracketHint: props.placeholderBracketHint
    },
    textFormatting: { ...(props.textFormatting || {}),
      responsiveToolbarMenu: ((_props$textFormatting = props.textFormatting) === null || _props$textFormatting === void 0 ? void 0 : _props$textFormatting.responsiveToolbarMenu) != null ? props.textFormatting.responsiveToolbarMenu : props.allowUndoRedoButtons
    },
    annotationProviders: props.annotationProviders,
    submitEditor: props.onSave,
    quickInsert: {
      enableElementBrowser: props.elementBrowser && props.elementBrowser.showModal,
      elementBrowserHelpUrl: props.elementBrowser && props.elementBrowser.helpUrl,
      disableDefaultItems: isMobile,
      headless: isMobile,
      emptyStateHandler: props.elementBrowser && props.elementBrowser.emptyStateHandler
    },
    selection: {
      useLongPressSelection: false
    },
    cardOptions,
    hyperlinkOptions: {
      linkPicker: (_props$linking2 = props.linking) === null || _props$linking2 === void 0 ? void 0 : _props$linking2.linkPicker,
      cardOptions,
      platform: isMobile ? 'mobile' : 'web'
    },
    codeBlock: { ...props.codeBlock,
      useLongPressSelection: false,
      appearance: props.appearance,
      allowCompositionInputOverride: isMobile
    }
  };
}
/**
 * Maps EditorProps to EditorPlugins
 *
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */

export default function createPluginsList(props, prevProps, createAnalyticsEvent, insertNodeAPI, editorAnalyticsAPI, editorSelectionAPI, getEditorContainerWidth) {
  var _props$linking3;

  const appearance = props.appearance;
  const isMobile = appearance === 'mobile';
  const isComment = appearance === 'comment';
  const isFullPage = fullPageCheck(appearance);
  const preset = createDefaultPreset(getDefaultPresetOptionsFromEditorProps(props, createAnalyticsEvent));
  const featureFlags = createFeatureFlagsFromProps(props);

  const getEditorFeatureFlags = () => featureFlags;

  if (props.allowAnalyticsGASV3) {
    const {
      performanceTracking
    } = props;
    preset.add([analyticsPlugin, {
      createAnalyticsEvent,
      performanceTracking
    }]);
  }

  if (props.allowBreakout && isFullPage) {
    preset.add([breakoutPlugin, {
      allowBreakoutButton: props.appearance === 'full-page'
    }]);
  }

  if (props.allowTextAlignment) {
    preset.add(alignmentPlugin);
  }

  preset.add(dataConsumerMarkPlugin);

  if (props.allowTextColor) {
    preset.add([textColorPlugin, props.allowTextColor]);
  } // Needs to be after allowTextColor as order of buttons in toolbar depends on it


  preset.add(listPlugin);

  if (props.allowRule) {
    preset.add(rulePlugin);
  }

  if (props.allowExpand) {
    preset.add([expandPlugin, {
      allowInsertion: isExpandInsertionEnabled(props),
      useLongPressSelection: false,
      appearance: props.appearance
    }]);
  }

  if (props.media) {
    preset.add([gridPlugin, {
      shouldCalcBreakoutGridLines: isFullPage
    }]);
    const alignLeftOnInsert = typeof props.media.alignLeftOnInsert !== 'undefined' ? props.media.alignLeftOnInsert : isComment;
    const showMediaLayoutOptions = typeof props.media.allowAdvancedToolBarOptions !== 'undefined' ? props.media.allowAdvancedToolBarOptions : isFullPage || isComment;
    preset.add([mediaPlugin, { ...props.media,
      allowLazyLoading: !isMobile,
      allowBreakoutSnapPoints: isFullPage,
      allowAdvancedToolBarOptions: showMediaLayoutOptions,
      allowDropzoneDropLine: isFullPage,
      allowMediaSingleEditable: !isMobile,
      allowRemoteDimensionsFetch: !isMobile,
      // This is a wild one. I didnt quite understand what the code was doing
      // so a bit of guess for now.
      allowMarkingUploadsAsIncomplete: isMobile,
      fullWidthEnabled: props.appearance === 'full-width',
      uploadErrorHandler: props.uploadErrorHandler,
      waitForMediaUpload: props.waitForMediaUpload,
      isCopyPasteEnabled: !isMobile,
      alignLeftOnInsert
    }]); // EDM-799: inside caption plugin we do the feature flag in enabling the plugin

    if (getMediaFeatureFlag('captions', props.media.featureFlags)) {
      preset.add(captionPlugin);
    }
  }

  if (props.mentionProvider) {
    var _props$mention$insert, _props$mention, _props$mention2;

    preset.add([mentionsPlugin, {
      createAnalyticsEvent,
      sanitizePrivateContent: props.sanitizePrivateContent,
      insertDisplayName: (_props$mention$insert = (_props$mention = props.mention) === null || _props$mention === void 0 ? void 0 : _props$mention.insertDisplayName) !== null && _props$mention$insert !== void 0 ? _props$mention$insert : props.mentionInsertDisplayName,
      allowZeroWidthSpaceAfter: !isMobile,
      HighlightComponent: (_props$mention2 = props.mention) === null || _props$mention2 === void 0 ? void 0 : _props$mention2.HighlightComponent
    }]);
  }

  if (props.emojiProvider) {
    preset.add([emojiPlugin, {
      createAnalyticsEvent
    }]);
  }

  if (props.allowTables) {
    const tableOptions = !props.allowTables || typeof props.allowTables === 'boolean' ? {} : props.allowTables;
    preset.add([tablesPlugin, {
      tableOptions,
      breakoutEnabled: props.appearance === 'full-page',
      allowContextualMenu: !isMobile,
      fullWidthEnabled: props.appearance === 'full-width',
      wasFullWidthEnabled: prevProps && prevProps.appearance === 'full-width',
      editorAnalyticsAPI,
      editorSelectionAPI,
      getEditorFeatureFlags
    }]);
  }

  if (props.allowTasksAndDecisions || props.taskDecisionProvider) {
    preset.add([tasksAndDecisionsPlugin, {
      allowNestedTasks: props.allowNestedTasks,
      consumeTabs: isFullPage,
      useLongPressSelection: false
    }]);
  }

  if (props.feedbackInfo) {
    preset.add([feedbackDialogPlugin, props.feedbackInfo]);
  }

  if (props.allowHelpDialog) {
    preset.add([helpDialogPlugin, props.legacyImageUploadProvider]);
  }

  if (props.saveOnEnter) {
    preset.add([saveOnEnterPlugin, props.onSave]);
  }

  if (props.legacyImageUploadProvider) {
    preset.add(imageUploadPlugin);

    if (!props.media) {
      preset.add([mediaPlugin, {
        allowMediaSingle: {
          disableLayout: true
        },
        allowMediaGroup: false,
        isCopyPasteEnabled: true
      }]);
    }
  }

  if (props.collabEdit || props.collabEditProvider) {
    var _collabEditOptions$EX;

    let collabEditOptions = {
      sanitizePrivateContent: props.sanitizePrivateContent,
      createAnalyticsEvent
    };

    if (props.collabEdit) {
      collabEditOptions = { ...props.collabEdit,
        ...collabEditOptions
      };
    }

    preset.add([collabEditPlugin, { ...collabEditOptions,
      EXPERIMENTAL_allowInternalErrorAnalytics: (_collabEditOptions$EX = collabEditOptions.EXPERIMENTAL_allowInternalErrorAnalytics) !== null && _collabEditOptions$EX !== void 0 ? _collabEditOptions$EX : shouldForceTracking()
    }]);
  }

  if (props.maxContentSize) {
    preset.add([maxContentSizePlugin, props.maxContentSize]);
  }

  if (props.allowJiraIssue) {
    preset.add(jiraIssuePlugin);
  }

  if (props.allowPanel) {
    preset.add([panelPlugin, {
      useLongPressSelection: false,
      allowCustomPanel: props.allowPanel.allowCustomPanel,
      allowCustomPanelEdit: props.allowPanel.allowCustomPanelEdit
    }]);
  }

  if (props.allowExtension) {
    const extensionConfig = typeof props.allowExtension === 'object' ? props.allowExtension : {};
    preset.add([extensionPlugin, {
      breakoutEnabled: props.appearance === 'full-page' && extensionConfig.allowBreakout !== false,
      stickToolbarToBottom: extensionConfig.stickToolbarToBottom,
      allowAutoSave: extensionConfig.allowAutoSave,
      extensionHandlers: props.extensionHandlers,
      useLongPressSelection: false,
      appearance
    }]);
  }

  if (props.macroProvider) {
    preset.add(macroPlugin);
  } // See default list for when adding annotations with a provider


  if (!props.annotationProviders && props.allowConfluenceInlineComment) {
    preset.add(annotationPlugin);
  }

  if (props.allowDate) {
    preset.add(datePlugin);
  }

  if (props.allowTemplatePlaceholders) {
    const options = props.allowTemplatePlaceholders !== true ? props.allowTemplatePlaceholders : {};
    preset.add([placeholderTextPlugin, options]);
  }

  if (props.allowLayouts) {
    preset.add([layoutPlugin, { ...(typeof props.allowLayouts === 'boolean' ? {} : props.allowLayouts),
      useLongPressSelection: false,
      UNSAFE_allowSingleColumnLayout: props.allowLayouts.UNSAFE_allowSingleColumnLayout
    }]);
  }

  if ((_props$linking3 = props.linking) !== null && _props$linking3 !== void 0 && _props$linking3.smartLinks || props.smartLinks || props.UNSAFE_cards) {
    var _props$linking4, _props$linking5;

    const fullWidthMode = props.appearance === 'full-width';
    preset.add([cardPlugin, { ...props.UNSAFE_cards,
      ...props.smartLinks,
      ...((_props$linking4 = props.linking) === null || _props$linking4 === void 0 ? void 0 : _props$linking4.smartLinks),
      platform: isMobile ? 'mobile' : 'web',
      fullWidthMode,
      createAnalyticsEvent,
      linkPicker: (_props$linking5 = props.linking) === null || _props$linking5 === void 0 ? void 0 : _props$linking5.linkPicker
    }]);
  }

  if (props.autoformattingProvider) {
    preset.add(customAutoformatPlugin);
  }

  let statusMenuDisabled = true;

  if (props.allowStatus) {
    statusMenuDisabled = typeof props.allowStatus === 'object' ? props.allowStatus.menuDisabled : false;
    preset.add([statusPlugin, {
      menuDisabled: statusMenuDisabled,
      allowZeroWidthSpaceAfter: !isMobile
    }]);
  }

  if (props.allowIndentation) {
    preset.add(indentationPlugin);
  }

  if (isFullPage) {
    preset.add(contextPanelPlugin);
  }

  if (props.autoScrollIntoView !== false) {
    preset.add(scrollIntoViewPlugin);
  }

  if (isMobile || props.allowUndoRedoButtons) {
    preset.add(historyPlugin);
  }

  if (isMobile) {
    preset.add(mobileDimensionsPlugin);
    preset.add(mobileSelectionPlugin);
  } // UI only plugins


  preset.add([toolbarListsIndentationPlugin, {
    showIndentationButtons: !!featureFlags.indentationButtonsInTheToolbar,
    allowHeadingAndParagraphIndentation: !!props.allowIndentation
  }]);
  preset.add([insertBlockPlugin, {
    allowTables: !!props.allowTables,
    allowExpand: isExpandInsertionEnabled(props),
    insertMenuItems: props.insertMenuItems,
    horizontalRuleEnabled: props.allowRule,
    nativeStatusSupported: !statusMenuDisabled,
    showElementBrowserLink: props.elementBrowser && props.elementBrowser.showModal || false,
    replacePlusMenuWithElementBrowser: props.elementBrowser && props.elementBrowser.replacePlusMenu || false,
    insertNodeAPI
  }]);

  const hasBeforePrimaryToolbar = components => {
    if (components && 'before' in components) {
      return !!components.before;
    }

    return false;
  };

  if (hasBeforePrimaryToolbar(props.primaryToolbarComponents) && !featureFlags.twoLineEditorToolbar) {
    preset.add([beforePrimaryToolbarPlugin, {
      beforePrimaryToolbarComponents: props.primaryToolbarComponents.before
    }]);
  }

  if (featureFlags.showAvatarGroupAsPlugin === true && !featureFlags.twoLineEditorToolbar) {
    preset.add([avatarGroupPlugin, {
      collabEdit: props.collabEdit,
      takeFullWidth: !hasBeforePrimaryToolbar(props.primaryToolbarComponents)
    }]);
  }

  if (props.allowFindReplace) {
    preset.add([findReplacePlugin, {
      takeFullWidth: !!featureFlags.showAvatarGroupAsPlugin === false && !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
      twoLineEditorToolbar: !!featureFlags.twoLineEditorToolbar
    }]);
  }

  if (props.allowFragmentMark) {
    preset.add(fragmentMarkPlugin);
  }

  if (featureFlags.enableViewUpdateSubscription) {
    preset.add([viewUpdateSubscriptionPlugin]);
  }

  preset.add([codeBidiWarningPlugin, {
    appearance: props.appearance
  }]);

  if (featureFlags.floatingToolbarCopyButton) {
    preset.add(copyButtonPlugin);
  }

  const excludes = new Set();

  if (!isCodeBlockAllowed({
    allowBlockType: props.allowBlockType
  })) {
    excludes.add('codeBlock');
  }

  return preset.getEditorPlugins(excludes);
}
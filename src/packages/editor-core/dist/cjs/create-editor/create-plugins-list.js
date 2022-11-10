"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createPluginsList;
exports.getDefaultPresetOptionsFromEditorProps = getDefaultPresetOptionsFromEditorProps;
exports.getScrollGutterOptions = getScrollGutterOptions;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _plugins = require("../plugins");

var _editorPluginTable = require("@atlaskit/editor-plugin-table");

var _isFullPage = require("../utils/is-full-page");

var _scrollGutter = require("../plugins/base/pm-plugins/scroll-gutter");

var _featureFlagsFromProps = require("../plugins/feature-flags-context/feature-flags-from-props");

var _mediaCommon = require("@atlaskit/media-common");

var _default = require("../labs/next/presets/default");

var _utils = require("@atlaskit/editor-common/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var isCodeBlockAllowed = function isCodeBlockAllowed(options) {
  var exclude = options && options.allowBlockType && options.allowBlockType.exclude ? options.allowBlockType.exclude : [];
  return exclude.indexOf('codeBlock') === -1;
};

function getScrollGutterOptions(props) {
  var appearance = props.appearance,
      persistScrollGutter = props.persistScrollGutter;

  if ((0, _isFullPage.isFullPage)(appearance)) {
    // Full Page appearance uses a scrollable div wrapper
    return {
      getScrollElement: function getScrollElement() {
        return document.querySelector('.fabric-editor-popup-scroll-parent');
      }
    };
  }

  if (appearance === 'mobile') {
    // Mobile appearance uses body scrolling for improved performance on low powered devices.
    return {
      getScrollElement: function getScrollElement() {
        return document.body;
      },
      allowCustomScrollHandler: false,
      persistScrollGutter: persistScrollGutter,
      gutterSize: _scrollGutter.GUTTER_SIZE_MOBILE_IN_PX
    };
  }

  return undefined;
}

function getDefaultPresetOptionsFromEditorProps(props, createAnalyticsEvent) {
  var _props$performanceTra, _props$linking, _props$featureFlags, _props$performanceTra2, _props$textFormatting, _props$linking2;

  var appearance = props.appearance;
  var isMobile = appearance === 'mobile';
  var inputTracking = (_props$performanceTra = props.performanceTracking) === null || _props$performanceTra === void 0 ? void 0 : _props$performanceTra.inputTracking;
  var cardOptions = ((_props$linking = props.linking) === null || _props$linking === void 0 ? void 0 : _props$linking.smartLinks) || props.smartLinks || props.UNSAFE_cards;
  return {
    createAnalyticsEvent: createAnalyticsEvent,
    typeAhead: {
      createAnalyticsEvent: createAnalyticsEvent,
      isMobile: isMobile
    },
    featureFlags: (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(props),
    paste: {
      cardOptions: cardOptions,
      sanitizePrivateContent: props.sanitizePrivateContent,
      plainTextPasteLinkification: ((_props$featureFlags = props.featureFlags) === null || _props$featureFlags === void 0 ? void 0 : _props$featureFlags.plainTextPasteLinkification) === true
    },
    base: {
      allowInlineCursorTarget: !isMobile,
      allowScrollGutter: getScrollGutterOptions(props),
      inputTracking: inputTracking,
      browserFreezeTracking: (_props$performanceTra2 = props.performanceTracking) === null || _props$performanceTra2 === void 0 ? void 0 : _props$performanceTra2.bFreezeTracking,
      ufo: (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(props).ufo
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
    textFormatting: _objectSpread(_objectSpread({}, props.textFormatting || {}), {}, {
      responsiveToolbarMenu: ((_props$textFormatting = props.textFormatting) === null || _props$textFormatting === void 0 ? void 0 : _props$textFormatting.responsiveToolbarMenu) != null ? props.textFormatting.responsiveToolbarMenu : props.allowUndoRedoButtons
    }),
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
    cardOptions: cardOptions,
    hyperlinkOptions: {
      linkPicker: (_props$linking2 = props.linking) === null || _props$linking2 === void 0 ? void 0 : _props$linking2.linkPicker,
      cardOptions: cardOptions,
      platform: isMobile ? 'mobile' : 'web'
    },
    codeBlock: _objectSpread(_objectSpread({}, props.codeBlock), {}, {
      useLongPressSelection: false,
      appearance: props.appearance,
      allowCompositionInputOverride: isMobile
    })
  };
}
/**
 * Maps EditorProps to EditorPlugins
 *
 * Note: The order that presets are added determines
 * their placement in the editor toolbar
 */


function createPluginsList(props, prevProps, createAnalyticsEvent, insertNodeAPI, editorAnalyticsAPI, editorSelectionAPI, getEditorContainerWidth) {
  var _props$linking3;

  var appearance = props.appearance;
  var isMobile = appearance === 'mobile';
  var isComment = appearance === 'comment';
  var isFullPage = (0, _isFullPage.isFullPage)(appearance);
  var preset = (0, _default.createDefaultPreset)(getDefaultPresetOptionsFromEditorProps(props, createAnalyticsEvent));
  var featureFlags = (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(props);

  var getEditorFeatureFlags = function getEditorFeatureFlags() {
    return featureFlags;
  };

  if (props.allowAnalyticsGASV3) {
    var performanceTracking = props.performanceTracking;
    preset.add([_plugins.analyticsPlugin, {
      createAnalyticsEvent: createAnalyticsEvent,
      performanceTracking: performanceTracking
    }]);
  }

  if (props.allowBreakout && isFullPage) {
    preset.add([_plugins.breakoutPlugin, {
      allowBreakoutButton: props.appearance === 'full-page'
    }]);
  }

  if (props.allowTextAlignment) {
    preset.add(_plugins.alignmentPlugin);
  }

  preset.add(_plugins.dataConsumerMarkPlugin);

  if (props.allowTextColor) {
    preset.add([_plugins.textColorPlugin, props.allowTextColor]);
  } // Needs to be after allowTextColor as order of buttons in toolbar depends on it


  preset.add(_plugins.listPlugin);

  if (props.allowRule) {
    preset.add(_plugins.rulePlugin);
  }

  if (props.allowExpand) {
    preset.add([_plugins.expandPlugin, {
      allowInsertion: (0, _plugins.isExpandInsertionEnabled)(props),
      useLongPressSelection: false,
      appearance: props.appearance
    }]);
  }

  if (props.media) {
    preset.add([_plugins.gridPlugin, {
      shouldCalcBreakoutGridLines: isFullPage
    }]);
    var alignLeftOnInsert = typeof props.media.alignLeftOnInsert !== 'undefined' ? props.media.alignLeftOnInsert : isComment;
    var showMediaLayoutOptions = typeof props.media.allowAdvancedToolBarOptions !== 'undefined' ? props.media.allowAdvancedToolBarOptions : isFullPage || isComment;
    preset.add([_plugins.mediaPlugin, _objectSpread(_objectSpread({}, props.media), {}, {
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
      alignLeftOnInsert: alignLeftOnInsert
    })]); // EDM-799: inside caption plugin we do the feature flag in enabling the plugin

    if ((0, _mediaCommon.getMediaFeatureFlag)('captions', props.media.featureFlags)) {
      preset.add(_plugins.captionPlugin);
    }
  }

  if (props.mentionProvider) {
    var _props$mention$insert, _props$mention, _props$mention2;

    preset.add([_plugins.mentionsPlugin, {
      createAnalyticsEvent: createAnalyticsEvent,
      sanitizePrivateContent: props.sanitizePrivateContent,
      insertDisplayName: (_props$mention$insert = (_props$mention = props.mention) === null || _props$mention === void 0 ? void 0 : _props$mention.insertDisplayName) !== null && _props$mention$insert !== void 0 ? _props$mention$insert : props.mentionInsertDisplayName,
      allowZeroWidthSpaceAfter: !isMobile,
      HighlightComponent: (_props$mention2 = props.mention) === null || _props$mention2 === void 0 ? void 0 : _props$mention2.HighlightComponent
    }]);
  }

  if (props.emojiProvider) {
    preset.add([_plugins.emojiPlugin, {
      createAnalyticsEvent: createAnalyticsEvent
    }]);
  }

  if (props.allowTables) {
    var tableOptions = !props.allowTables || typeof props.allowTables === 'boolean' ? {} : props.allowTables;
    preset.add([_editorPluginTable.tablesPlugin, {
      tableOptions: tableOptions,
      breakoutEnabled: props.appearance === 'full-page',
      allowContextualMenu: !isMobile,
      fullWidthEnabled: props.appearance === 'full-width',
      wasFullWidthEnabled: prevProps && prevProps.appearance === 'full-width',
      editorAnalyticsAPI: editorAnalyticsAPI,
      editorSelectionAPI: editorSelectionAPI,
      getEditorFeatureFlags: getEditorFeatureFlags
    }]);
  }

  if (props.allowTasksAndDecisions || props.taskDecisionProvider) {
    preset.add([_plugins.tasksAndDecisionsPlugin, {
      allowNestedTasks: props.allowNestedTasks,
      consumeTabs: isFullPage,
      useLongPressSelection: false
    }]);
  }

  if (props.feedbackInfo) {
    preset.add([_plugins.feedbackDialogPlugin, props.feedbackInfo]);
  }

  if (props.allowHelpDialog) {
    preset.add([_plugins.helpDialogPlugin, props.legacyImageUploadProvider]);
  }

  if (props.saveOnEnter) {
    preset.add([_plugins.saveOnEnterPlugin, props.onSave]);
  }

  if (props.legacyImageUploadProvider) {
    preset.add(_plugins.imageUploadPlugin);

    if (!props.media) {
      preset.add([_plugins.mediaPlugin, {
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

    var collabEditOptions = {
      sanitizePrivateContent: props.sanitizePrivateContent,
      createAnalyticsEvent: createAnalyticsEvent
    };

    if (props.collabEdit) {
      collabEditOptions = _objectSpread(_objectSpread({}, props.collabEdit), collabEditOptions);
    }

    preset.add([_plugins.collabEditPlugin, _objectSpread(_objectSpread({}, collabEditOptions), {}, {
      EXPERIMENTAL_allowInternalErrorAnalytics: (_collabEditOptions$EX = collabEditOptions.EXPERIMENTAL_allowInternalErrorAnalytics) !== null && _collabEditOptions$EX !== void 0 ? _collabEditOptions$EX : (0, _utils.shouldForceTracking)()
    })]);
  }

  if (props.maxContentSize) {
    preset.add([_plugins.maxContentSizePlugin, props.maxContentSize]);
  }

  if (props.allowJiraIssue) {
    preset.add(_plugins.jiraIssuePlugin);
  }

  if (props.allowPanel) {
    preset.add([_plugins.panelPlugin, {
      useLongPressSelection: false,
      allowCustomPanel: props.allowPanel.allowCustomPanel,
      allowCustomPanelEdit: props.allowPanel.allowCustomPanelEdit
    }]);
  }

  if (props.allowExtension) {
    var extensionConfig = (0, _typeof2.default)(props.allowExtension) === 'object' ? props.allowExtension : {};
    preset.add([_plugins.extensionPlugin, {
      breakoutEnabled: props.appearance === 'full-page' && extensionConfig.allowBreakout !== false,
      stickToolbarToBottom: extensionConfig.stickToolbarToBottom,
      allowAutoSave: extensionConfig.allowAutoSave,
      extensionHandlers: props.extensionHandlers,
      useLongPressSelection: false,
      appearance: appearance
    }]);
  }

  if (props.macroProvider) {
    preset.add(_plugins.macroPlugin);
  } // See default list for when adding annotations with a provider


  if (!props.annotationProviders && props.allowConfluenceInlineComment) {
    preset.add(_plugins.annotationPlugin);
  }

  if (props.allowDate) {
    preset.add(_plugins.datePlugin);
  }

  if (props.allowTemplatePlaceholders) {
    var options = props.allowTemplatePlaceholders !== true ? props.allowTemplatePlaceholders : {};
    preset.add([_plugins.placeholderTextPlugin, options]);
  }

  if (props.allowLayouts) {
    preset.add([_plugins.layoutPlugin, _objectSpread(_objectSpread({}, typeof props.allowLayouts === 'boolean' ? {} : props.allowLayouts), {}, {
      useLongPressSelection: false,
      UNSAFE_allowSingleColumnLayout: props.allowLayouts.UNSAFE_allowSingleColumnLayout
    })]);
  }

  if ((_props$linking3 = props.linking) !== null && _props$linking3 !== void 0 && _props$linking3.smartLinks || props.smartLinks || props.UNSAFE_cards) {
    var _props$linking4, _props$linking5;

    var fullWidthMode = props.appearance === 'full-width';
    preset.add([_plugins.cardPlugin, _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, props.UNSAFE_cards), props.smartLinks), (_props$linking4 = props.linking) === null || _props$linking4 === void 0 ? void 0 : _props$linking4.smartLinks), {}, {
      platform: isMobile ? 'mobile' : 'web',
      fullWidthMode: fullWidthMode,
      createAnalyticsEvent: createAnalyticsEvent,
      linkPicker: (_props$linking5 = props.linking) === null || _props$linking5 === void 0 ? void 0 : _props$linking5.linkPicker
    })]);
  }

  if (props.autoformattingProvider) {
    preset.add(_plugins.customAutoformatPlugin);
  }

  var statusMenuDisabled = true;

  if (props.allowStatus) {
    statusMenuDisabled = (0, _typeof2.default)(props.allowStatus) === 'object' ? props.allowStatus.menuDisabled : false;
    preset.add([_plugins.statusPlugin, {
      menuDisabled: statusMenuDisabled,
      allowZeroWidthSpaceAfter: !isMobile
    }]);
  }

  if (props.allowIndentation) {
    preset.add(_plugins.indentationPlugin);
  }

  if (isFullPage) {
    preset.add(_plugins.contextPanelPlugin);
  }

  if (props.autoScrollIntoView !== false) {
    preset.add(_plugins.scrollIntoViewPlugin);
  }

  if (isMobile || props.allowUndoRedoButtons) {
    preset.add(_plugins.historyPlugin);
  }

  if (isMobile) {
    preset.add(_plugins.mobileDimensionsPlugin);
    preset.add(_plugins.mobileSelectionPlugin);
  } // UI only plugins


  preset.add([_plugins.toolbarListsIndentationPlugin, {
    showIndentationButtons: !!featureFlags.indentationButtonsInTheToolbar,
    allowHeadingAndParagraphIndentation: !!props.allowIndentation
  }]);
  preset.add([_plugins.insertBlockPlugin, {
    allowTables: !!props.allowTables,
    allowExpand: (0, _plugins.isExpandInsertionEnabled)(props),
    insertMenuItems: props.insertMenuItems,
    horizontalRuleEnabled: props.allowRule,
    nativeStatusSupported: !statusMenuDisabled,
    showElementBrowserLink: props.elementBrowser && props.elementBrowser.showModal || false,
    replacePlusMenuWithElementBrowser: props.elementBrowser && props.elementBrowser.replacePlusMenu || false,
    insertNodeAPI: insertNodeAPI
  }]);

  var hasBeforePrimaryToolbar = function hasBeforePrimaryToolbar(components) {
    if (components && 'before' in components) {
      return !!components.before;
    }

    return false;
  };

  if (hasBeforePrimaryToolbar(props.primaryToolbarComponents) && !featureFlags.twoLineEditorToolbar) {
    preset.add([_plugins.beforePrimaryToolbarPlugin, {
      beforePrimaryToolbarComponents: props.primaryToolbarComponents.before
    }]);
  }

  if (featureFlags.showAvatarGroupAsPlugin === true && !featureFlags.twoLineEditorToolbar) {
    preset.add([_plugins.avatarGroupPlugin, {
      collabEdit: props.collabEdit,
      takeFullWidth: !hasBeforePrimaryToolbar(props.primaryToolbarComponents)
    }]);
  }

  if (props.allowFindReplace) {
    preset.add([_plugins.findReplacePlugin, {
      takeFullWidth: !!featureFlags.showAvatarGroupAsPlugin === false && !hasBeforePrimaryToolbar(props.primaryToolbarComponents),
      twoLineEditorToolbar: !!featureFlags.twoLineEditorToolbar
    }]);
  }

  if (props.allowFragmentMark) {
    preset.add(_plugins.fragmentMarkPlugin);
  }

  if (featureFlags.enableViewUpdateSubscription) {
    preset.add([_plugins.viewUpdateSubscriptionPlugin]);
  }

  preset.add([_plugins.codeBidiWarningPlugin, {
    appearance: props.appearance
  }]);

  if (featureFlags.floatingToolbarCopyButton) {
    preset.add(_plugins.copyButtonPlugin);
  }

  var excludes = new Set();

  if (!isCodeBlockAllowed({
    allowBlockType: props.allowBlockType
  })) {
    excludes.add('codeBlock');
  }

  return preset.getEditorPlugins(excludes);
}
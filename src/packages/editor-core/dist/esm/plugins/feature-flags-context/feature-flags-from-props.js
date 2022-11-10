import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _typeof from "@babel/runtime/helpers/typeof";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { normalizeFeatureFlags } from '@atlaskit/editor-common/normalize-feature-flags';

function verifyJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return undefined;
  }
}

function getSpellCheck(featureFlags) {
  if (!!(featureFlags !== null && featureFlags !== void 0 && featureFlags['disableSpellcheckByBrowser'])) {
    return _typeof(featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disableSpellcheckByBrowser']) === 'object' ? featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disableSpellcheckByBrowser'] : typeof (featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disableSpellcheckByBrowser']) === 'string' ? verifyJSON(featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disableSpellcheckByBrowser']) : undefined;
  }

  if (!!(featureFlags !== null && featureFlags !== void 0 && featureFlags['disable-spellcheck-by-browser'])) {
    return _typeof(featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disable-spellcheck-by-browser']) === 'object' ? featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disable-spellcheck-by-browser'] : typeof (featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disable-spellcheck-by-browser']) === 'string' ? verifyJSON(featureFlags === null || featureFlags === void 0 ? void 0 : featureFlags['disable-spellcheck-by-browser']) : undefined;
  }

  return undefined;
}
/**
 * Transforms EditorProps to an FeatureFlags object,
 * which is used by both current and archv3 editors.
 */


export function createFeatureFlagsFromProps(props) {
  var _props$featureFlags, _props$allowTextColor, _props$allowLayouts, _props$performanceTra, _props$performanceTra2, _props$featureFlags2, _props$featureFlags3, _props$allowTables, _props$featureFlags4, _props$featureFlags5, _props$allowTables2, _props$featureFlags6, _props$featureFlags7, _props$allowTables3, _props$featureFlags8, _props$featureFlags9, _props$allowTables4, _props$allowTables5, _props$featureFlags10, _props$featureFlags11, _props$allowTables6, _props$allowExtension, _props$featureFlags12, _props$featureFlags13, _props$featureFlags14, _props$featureFlags15, _props$featureFlags16, _props$featureFlags17, _props$featureFlags18, _props$featureFlags19, _props$featureFlags20, _props$featureFlags21, _props$featureFlags22, _props$featureFlags23, _props$featureFlags24, _props$featureFlags25, _props$featureFlags26, _props$featureFlags27, _props$featureFlags28, _props$featureFlags29, _props$collabEdit, _props$collabEdit2, _props$featureFlags30, _props$featureFlags31, _props$featureFlags32, _props$featureFlags33, _props$featureFlags34, _props$featureFlags35, _props$featureFlags36, _props$featureFlags37, _props$featureFlags38;

  var normalizedFeatureFlags = normalizeFeatureFlags(props.featureFlags);
  var tableCellOptionsInFloatingToolbar = normalizedFeatureFlags.tableCellOptionsInFloatingToolbar || ((_props$featureFlags = props.featureFlags) === null || _props$featureFlags === void 0 ? void 0 : _props$featureFlags.tableCellOptionsInFloatingToolbar) || undefined;
  return _objectSpread(_objectSpread({}, normalizedFeatureFlags), {}, {
    newInsertionBehaviour: props.allowNewInsertionBehaviour,
    interactiveExpand: typeof props.allowExpand === 'boolean' ? props.allowExpand : Boolean(props.allowExpand && props.allowExpand.allowInteractiveExpand !== false),
    placeholderBracketHint: !!props.placeholderBracketHint,
    placeholderHints: Array.isArray(props.placeholderHints) && props.placeholderHints.length > 0,
    moreTextColors: typeof props.allowTextColor === 'boolean' ? false : Boolean(((_props$allowTextColor = props.allowTextColor) === null || _props$allowTextColor === void 0 ? void 0 : _props$allowTextColor.allowMoreTextColors) === true),
    findReplace: !!props.allowFindReplace,
    findReplaceMatchCase: _typeof(props.allowFindReplace) === 'object' && Boolean(props.allowFindReplace.allowMatchCase),
    keyboardAccessibleDatepicker: typeof props.allowKeyboardAccessibleDatepicker === 'boolean' ? props.allowKeyboardAccessibleDatepicker : false,
    addColumnWithCustomStep: !props.allowTables || typeof props.allowTables === 'boolean' ? false : Boolean(props.allowTables.allowAddColumnWithCustomStep),
    singleLayout: _typeof(props.allowLayouts) === 'object' && !!((_props$allowLayouts = props.allowLayouts) !== null && _props$allowLayouts !== void 0 && _props$allowLayouts.UNSAFE_allowSingleColumnLayout),
    undoRedoButtons: props.allowUndoRedoButtons,
    catchAllTracking: (_props$performanceTra = props.performanceTracking) === null || _props$performanceTra === void 0 ? void 0 : (_props$performanceTra2 = _props$performanceTra.catchAllTracking) === null || _props$performanceTra2 === void 0 ? void 0 : _props$performanceTra2.enabled,
    stickyHeadersOptimization: typeof ((_props$featureFlags2 = props.featureFlags) === null || _props$featureFlags2 === void 0 ? void 0 : _props$featureFlags2.stickyHeadersOptimization) === 'boolean' ? !!((_props$featureFlags3 = props.featureFlags) !== null && _props$featureFlags3 !== void 0 && _props$featureFlags3.stickyHeadersOptimization) : _typeof(props.allowTables) === 'object' && !!((_props$allowTables = props.allowTables) !== null && _props$allowTables !== void 0 && _props$allowTables.stickyHeadersOptimization),
    initialRenderOptimization: typeof ((_props$featureFlags4 = props.featureFlags) === null || _props$featureFlags4 === void 0 ? void 0 : _props$featureFlags4.initialRenderOptimization) === 'boolean' ? !!((_props$featureFlags5 = props.featureFlags) !== null && _props$featureFlags5 !== void 0 && _props$featureFlags5.initialRenderOptimization) : _typeof(props.allowTables) === 'object' && !!((_props$allowTables2 = props.allowTables) !== null && _props$allowTables2 !== void 0 && _props$allowTables2.initialRenderOptimization),
    mouseMoveOptimization: typeof ((_props$featureFlags6 = props.featureFlags) === null || _props$featureFlags6 === void 0 ? void 0 : _props$featureFlags6.mouseMoveOptimization) === 'boolean' ? !!((_props$featureFlags7 = props.featureFlags) !== null && _props$featureFlags7 !== void 0 && _props$featureFlags7.mouseMoveOptimization) : _typeof(props.allowTables) === 'object' && !!((_props$allowTables3 = props.allowTables) !== null && _props$allowTables3 !== void 0 && _props$allowTables3.mouseMoveOptimization),
    tableRenderOptimization: typeof ((_props$featureFlags8 = props.featureFlags) === null || _props$featureFlags8 === void 0 ? void 0 : _props$featureFlags8.tableRenderOptimization) === 'boolean' ? !!((_props$featureFlags9 = props.featureFlags) !== null && _props$featureFlags9 !== void 0 && _props$featureFlags9.tableRenderOptimization) : _typeof(props.allowTables) === 'object' && typeof ((_props$allowTables4 = props.allowTables) === null || _props$allowTables4 === void 0 ? void 0 : _props$allowTables4.tableRenderOptimization) === 'boolean' ? (_props$allowTables5 = props.allowTables) === null || _props$allowTables5 === void 0 ? void 0 : _props$allowTables5.tableRenderOptimization : true,
    tableOverflowShadowsOptimization: typeof ((_props$featureFlags10 = props.featureFlags) === null || _props$featureFlags10 === void 0 ? void 0 : _props$featureFlags10.tableOverflowShadowsOptimization) === 'boolean' ? !!((_props$featureFlags11 = props.featureFlags) !== null && _props$featureFlags11 !== void 0 && _props$featureFlags11.tableOverflowShadowsOptimization) : _typeof(props.allowTables) === 'object' && !!((_props$allowTables6 = props.allowTables) !== null && _props$allowTables6 !== void 0 && _props$allowTables6.tableOverflowShadowsOptimization),
    extendFloatingToolbar: Boolean(_typeof(props.allowExtension) === 'object' && ((_props$allowExtension = props.allowExtension) === null || _props$allowExtension === void 0 ? void 0 : _props$allowExtension.allowExtendFloatingToolbars)),
    showAvatarGroupAsPlugin: Boolean(typeof ((_props$featureFlags12 = props.featureFlags) === null || _props$featureFlags12 === void 0 ? void 0 : _props$featureFlags12.showAvatarGroupAsPlugin) === 'boolean' ? !!((_props$featureFlags13 = props.featureFlags) !== null && _props$featureFlags13 !== void 0 && _props$featureFlags13.showAvatarGroupAsPlugin) : false),
    errorBoundaryDocStructure: Boolean(typeof ((_props$featureFlags14 = props.featureFlags) === null || _props$featureFlags14 === void 0 ? void 0 : _props$featureFlags14.useErrorBoundaryDocStructure) === 'boolean' ? !!((_props$featureFlags15 = props.featureFlags) !== null && _props$featureFlags15 !== void 0 && _props$featureFlags15.useErrorBoundaryDocStructure) : false),
    synchronyErrorDocStructure: Boolean(typeof ((_props$featureFlags16 = props.featureFlags) === null || _props$featureFlags16 === void 0 ? void 0 : _props$featureFlags16.synchronyErrorDocStructure) === 'boolean' ? !!((_props$featureFlags17 = props.featureFlags) !== null && _props$featureFlags17 !== void 0 && _props$featureFlags17.synchronyErrorDocStructure) : false),
    enableViewUpdateSubscription: Boolean(typeof ((_props$featureFlags18 = props.featureFlags) === null || _props$featureFlags18 === void 0 ? void 0 : _props$featureFlags18.enableViewUpdateSubscription) === 'boolean' ? !!((_props$featureFlags19 = props.featureFlags) !== null && _props$featureFlags19 !== void 0 && _props$featureFlags19.enableViewUpdateSubscription) : false),
    plainTextPasteLinkification: Boolean(typeof ((_props$featureFlags20 = props.featureFlags) === null || _props$featureFlags20 === void 0 ? void 0 : _props$featureFlags20.plainTextPasteLinkification) === 'boolean' ? !!((_props$featureFlags21 = props.featureFlags) !== null && _props$featureFlags21 !== void 0 && _props$featureFlags21.plainTextPasteLinkification) : false),
    collabAvatarScroll: Boolean(typeof ((_props$featureFlags22 = props.featureFlags) === null || _props$featureFlags22 === void 0 ? void 0 : _props$featureFlags22.collabAvatarScroll) === 'boolean' ? !!((_props$featureFlags23 = props.featureFlags) !== null && _props$featureFlags23 !== void 0 && _props$featureFlags23.collabAvatarScroll) : false),
    ufo: Boolean(typeof ((_props$featureFlags24 = props.featureFlags) === null || _props$featureFlags24 === void 0 ? void 0 : _props$featureFlags24.ufo) === 'boolean' ? !!((_props$featureFlags25 = props.featureFlags) !== null && _props$featureFlags25 !== void 0 && _props$featureFlags25.ufo) : false),
    twoLineEditorToolbar: Boolean(typeof ((_props$featureFlags26 = props.featureFlags) === null || _props$featureFlags26 === void 0 ? void 0 : _props$featureFlags26.twoLineEditorToolbar) === 'boolean' ? !!((_props$featureFlags27 = props.featureFlags) !== null && _props$featureFlags27 !== void 0 && _props$featureFlags27.twoLineEditorToolbar) : false),
    saferDispatchedTransactions: Boolean(typeof normalizedFeatureFlags.saferDispatchedTransactions === 'boolean' && !!normalizedFeatureFlags.saferDispatchedTransactions || (typeof ((_props$featureFlags28 = props.featureFlags) === null || _props$featureFlags28 === void 0 ? void 0 : _props$featureFlags28.saferDispatchedTransactions) === 'boolean' ? !!((_props$featureFlags29 = props.featureFlags) !== null && _props$featureFlags29 !== void 0 && _props$featureFlags29.saferDispatchedTransactions) : false)),
    useNativeCollabPlugin: Boolean(typeof ((_props$collabEdit = props.collabEdit) === null || _props$collabEdit === void 0 ? void 0 : _props$collabEdit.useNativePlugin) === 'boolean' ? !!((_props$collabEdit2 = props.collabEdit) !== null && _props$collabEdit2 !== void 0 && _props$collabEdit2.useNativePlugin) : false),
    chromeCursorHandlerFixedVersion: typeof ((_props$featureFlags30 = props.featureFlags) === null || _props$featureFlags30 === void 0 ? void 0 : _props$featureFlags30.chromeCursorHandlerFixedVersion) === 'string' ? Number(props.featureFlags.chromeCursorHandlerFixedVersion) || undefined : undefined,
    viewChangingExperimentToolbarStyle: typeof ((_props$featureFlags31 = props.featureFlags) === null || _props$featureFlags31 === void 0 ? void 0 : _props$featureFlags31['view-changing-experiment-toolbar-style']) === 'string' ? props.featureFlags['view-changing-experiment-toolbar-style'] || undefined : undefined,
    tableCellOptionsInFloatingToolbar: typeof tableCellOptionsInFloatingToolbar === 'boolean' ? tableCellOptionsInFloatingToolbar : false,
    showHoverPreview: Boolean(typeof ((_props$featureFlags32 = props.featureFlags) === null || _props$featureFlags32 === void 0 ? void 0 : _props$featureFlags32.showHoverPreview) === 'boolean' ? !!((_props$featureFlags33 = props.featureFlags) !== null && _props$featureFlags33 !== void 0 && _props$featureFlags33.showHoverPreview) : false),
    indentationButtonsInTheToolbar: Boolean(typeof normalizedFeatureFlags.indentationButtonsInTheToolbar === 'boolean' && !!normalizedFeatureFlags.indentationButtonsInTheToolbar || (typeof ((_props$featureFlags34 = props.featureFlags) === null || _props$featureFlags34 === void 0 ? void 0 : _props$featureFlags34.indentationButtonsInTheToolbar) === 'boolean' ? !!((_props$featureFlags35 = props.featureFlags) !== null && _props$featureFlags35 !== void 0 && _props$featureFlags35.indentationButtonsInTheToolbar) : false)),
    floatingToolbarCopyButton: Boolean(typeof normalizedFeatureFlags.floatingToolbarCopyButton === 'boolean' && !!normalizedFeatureFlags.floatingToolbarCopyButton || (typeof ((_props$featureFlags36 = props.featureFlags) === null || _props$featureFlags36 === void 0 ? void 0 : _props$featureFlags36.floatingToolbarCopyButton) === 'boolean' ? !!((_props$featureFlags37 = props.featureFlags) !== null && _props$featureFlags37 !== void 0 && _props$featureFlags37.floatingToolbarCopyButton) : false)),
    floatingToolbarLinkSettingsButton: typeof ((_props$featureFlags38 = props.featureFlags) === null || _props$featureFlags38 === void 0 ? void 0 : _props$featureFlags38['floating-toolbar-link-settings-button']) === 'string' ? props.featureFlags['floating-toolbar-link-settings-button'] || undefined : undefined,
    disableSpellcheckByBrowser: getSpellCheck(props.featureFlags)
  });
}
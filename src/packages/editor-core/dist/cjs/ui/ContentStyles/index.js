"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createEditorContentStyle = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _styles2 = require("../../plugins/unsupported-content/styles");

var _styles3 = require("../../plugins/collab-edit/styles");

var _styles4 = require("../../plugins/selection/gap-cursor/styles");

var _commonStyles = require("@atlaskit/editor-plugin-table/ui/common-styles");

var _styles5 = require("../../plugins/placeholder/styles");

var _styles6 = require("../../plugins/block-type/styles");

var _styles7 = require("../../plugins/code-block/styles");

var _styles8 = require("../../plugins/list/styles");

var _styles9 = require("../../plugins/rule/styles");

var _styles10 = require("../../plugins/media/styles");

var _styles11 = require("../../plugins/layout/styles");

var _styles12 = require("../../plugins/panel/styles");

var _styles13 = require("../../plugins/fake-text-cursor/styles");

var _styles14 = require("../../plugins/mentions/styles");

var _styles15 = require("../../plugins/emoji/styles");

var _styles16 = require("../../plugins/text-formatting/styles");

var _styles17 = require("../../plugins/placeholder-text/styles");

var _styles18 = require("../../plugins/grid/styles");

var _styles19 = require("../../plugins/hyperlink/styles");

var _styles20 = require("../../plugins/extension/ui/styles");

var _styles21 = require("../../plugins/expand/ui/styles");

var _style = require("../../plugins/media/pm-plugins/alt-text/style");

var _styles22 = require("../../plugins/find-replace/styles");

var _styles23 = require("../../plugins/tasks-and-decisions/styles");

var _styles24 = require("../../plugins/status/styles");

var _styles25 = require("../../plugins/card/styles");

var _styles26 = require("../../plugins/date/styles");

var _styled = require("../../plugins/card/ui/styled");

var _featureFlagsContext = require("../../plugins/feature-flags-context");

var _getInlineNodeViewProducer = require("../../nodeviews/getInlineNodeViewProducer.styles");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var contentStyles = function contentStyles(props) {
  return (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    outline: none;\n    font-size: ", "px;\n    ", ";\n    ", ";\n    ", ";\n    ", ";\n    ", ";\n    ", ";\n  }\n\n  .ProseMirror[contenteditable='false'] .taskItemView-content-wrap {\n    pointer-events: none;\n    opacity: 0.7;\n  }\n\n  .ProseMirror-hideselection *::selection {\n    background: transparent;\n  }\n\n  .ProseMirror-hideselection *::-moz-selection {\n    background: transparent;\n  }\n\n  .ProseMirror-selectednode {\n    outline: none;\n  }\n\n  .ProseMirror-selectednode:empty {\n    outline: 2px solid ", ";\n  }\n\n  ", "\n  ", "\n  ", "\n\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", ";\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n\n  .panelView-content-wrap {\n    box-sizing: border-box;\n  }\n\n  .mediaGroupView-content-wrap ul {\n    padding: 0;\n  }\n\n  /** Needed to override any cleared floats, e.g. image wrapping */\n\n  div.fabric-editor-block-mark[class^='fabric-editor-align'] {\n    clear: none !important;\n  }\n\n  .fabric-editor-align-end {\n    text-align: right;\n  }\n\n  .fabric-editor-align-start {\n    text-align: left;\n  }\n\n  .fabric-editor-align-center {\n    text-align: center;\n  }\n\n  .pm-table-header-content-wrap,\n  .pm-table-cell-content-wrap div.fabric-editor-block-mark {\n    p:first-of-type {\n      margin-top: 0;\n    }\n  }\n\n  .hyperlink-floating-toolbar,\n  .", " {\n    padding: 0;\n  }\n\n  /* Link icon in the Atlaskit package\n     is bigger than the others\n  */\n  .hyperlink-open-link {\n    svg {\n      max-width: 18px;\n    }\n    &[href] {\n      padding: 0 4px;\n    }\n  }\n"])), (0, _editorSharedStyles.editorFontSize)({
    theme: props.theme
  }), _styles.whitespaceSharedStyles, _styles.paragraphSharedStyles, _styles.listsSharedStyles, _styles.indentationSharedStyles, _styles.shadowSharedStyle, _getInlineNodeViewProducer.InlineNodeViewSharedStyles, (0, _tokens.token)('color.border.focused', '#8cf'), _styles17.placeholderTextStyles, _styles5.placeholderStyles, (0, _styles7.codeBlockStyles)(props), (0, _styles6.blocktypeStyles)(props), (0, _styles16.textFormattingStyles)(props), _styles.textColorStyles, _styles8.listsStyles, (0, _styles9.ruleStyles)(props), _styles10.mediaStyles, _styles11.layoutStyles, _styles3.telepointerStyle, _styles4.gapCursorStyles, (0, _commonStyles.tableStyles)(props), (0, _styles12.panelStyles)(props), _styles13.fakeCursorStyles, _styles14.mentionsStyles, _styles15.emojiStyles, _styles.tasksAndDecisionsStyles, _styles18.gridStyles, _styles19.linkStyles, _styles.blockMarksSharedStyles, _styles.dateSharedStyle, _styles20.extensionStyles, (0, _styles21.expandStyles)(props), _styles22.findReplaceStyles, _styles23.taskDecisionStyles, _styles24.statusStyles, (0, _styles.annotationSharedStyles)(props), _styles25.smartCardStyles, _styles.smartCardSharedStyles, _styles26.dateStyles, _styled.embedCardStyles, _styles2.unsupportedStyles, _style.ClassNames.FLOATING_TOOLBAR_COMPONENT);
};

var createEditorContentStyle = function createEditorContentStyle(styles) {
  return /*#__PURE__*/_react.default.forwardRef(function (props, ref) {
    var featureFlags = (0, _featureFlagsContext.useFeatureFlags)();
    var className = props.className,
        children = props.children;
    var theme = (0, _react2.useTheme)();
    var memoizedStyle = (0, _react.useMemo)(function () {
      return contentStyles({
        theme: theme,
        featureFlags: featureFlags
      });
    }, [theme, featureFlags]);
    return (0, _react2.jsx)("div", {
      className: className,
      ref: ref,
      css: [memoizedStyle, styles]
    }, children);
  });
};

exports.createEditorContentStyle = createEditorContentStyle;

var _default = createEditorContentStyle();

exports.default = _default;
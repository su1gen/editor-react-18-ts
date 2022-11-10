import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/** @jsx jsx */
import React, { useMemo } from 'react';
import { jsx, css, useTheme } from '@emotion/react';
import { whitespaceSharedStyles, paragraphSharedStyles, listsSharedStyles, indentationSharedStyles, blockMarksSharedStyles, shadowSharedStyle, dateSharedStyle, tasksAndDecisionsStyles, annotationSharedStyles, smartCardSharedStyles, textColorStyles } from '@atlaskit/editor-common/styles';
import { editorFontSize } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';
import { unsupportedStyles } from '../../plugins/unsupported-content/styles';
import { telepointerStyle } from '../../plugins/collab-edit/styles';
import { gapCursorStyles } from '../../plugins/selection/gap-cursor/styles';
import { tableStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import { placeholderStyles } from '../../plugins/placeholder/styles';
import { blocktypeStyles } from '../../plugins/block-type/styles';
import { codeBlockStyles } from '../../plugins/code-block/styles';
import { listsStyles } from '../../plugins/list/styles';
import { ruleStyles } from '../../plugins/rule/styles';
import { mediaStyles } from '../../plugins/media/styles';
import { layoutStyles } from '../../plugins/layout/styles';
import { panelStyles } from '../../plugins/panel/styles';
import { fakeCursorStyles } from '../../plugins/fake-text-cursor/styles';
import { mentionsStyles } from '../../plugins/mentions/styles';
import { emojiStyles } from '../../plugins/emoji/styles';
import { textFormattingStyles } from '../../plugins/text-formatting/styles';
import { placeholderTextStyles } from '../../plugins/placeholder-text/styles';
import { gridStyles } from '../../plugins/grid/styles';
import { linkStyles } from '../../plugins/hyperlink/styles';
import { extensionStyles } from '../../plugins/extension/ui/styles';
import { expandStyles } from '../../plugins/expand/ui/styles';
import { ClassNames } from '../../plugins/media/pm-plugins/alt-text/style';
import { findReplaceStyles } from '../../plugins/find-replace/styles';
import { taskDecisionStyles } from '../../plugins/tasks-and-decisions/styles';
import { statusStyles } from '../../plugins/status/styles';
import { smartCardStyles } from '../../plugins/card/styles';
import { dateStyles } from '../../plugins/date/styles';
import { embedCardStyles } from '../../plugins/card/ui/styled';
import { useFeatureFlags } from '../../plugins/feature-flags-context';
import { InlineNodeViewSharedStyles } from '../../nodeviews/getInlineNodeViewProducer.styles';

var contentStyles = function contentStyles(props) {
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .ProseMirror {\n    outline: none;\n    font-size: ", "px;\n    ", ";\n    ", ";\n    ", ";\n    ", ";\n    ", ";\n    ", ";\n  }\n\n  .ProseMirror[contenteditable='false'] .taskItemView-content-wrap {\n    pointer-events: none;\n    opacity: 0.7;\n  }\n\n  .ProseMirror-hideselection *::selection {\n    background: transparent;\n  }\n\n  .ProseMirror-hideselection *::-moz-selection {\n    background: transparent;\n  }\n\n  .ProseMirror-selectednode {\n    outline: none;\n  }\n\n  .ProseMirror-selectednode:empty {\n    outline: 2px solid ", ";\n  }\n\n  ", "\n  ", "\n  ", "\n\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", ";\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n  ", "\n\n  .panelView-content-wrap {\n    box-sizing: border-box;\n  }\n\n  .mediaGroupView-content-wrap ul {\n    padding: 0;\n  }\n\n  /** Needed to override any cleared floats, e.g. image wrapping */\n\n  div.fabric-editor-block-mark[class^='fabric-editor-align'] {\n    clear: none !important;\n  }\n\n  .fabric-editor-align-end {\n    text-align: right;\n  }\n\n  .fabric-editor-align-start {\n    text-align: left;\n  }\n\n  .fabric-editor-align-center {\n    text-align: center;\n  }\n\n  .pm-table-header-content-wrap,\n  .pm-table-cell-content-wrap div.fabric-editor-block-mark {\n    p:first-of-type {\n      margin-top: 0;\n    }\n  }\n\n  .hyperlink-floating-toolbar,\n  .", " {\n    padding: 0;\n  }\n\n  /* Link icon in the Atlaskit package\n     is bigger than the others\n  */\n  .hyperlink-open-link {\n    svg {\n      max-width: 18px;\n    }\n    &[href] {\n      padding: 0 4px;\n    }\n  }\n"])), editorFontSize({
    theme: props.theme
  }), whitespaceSharedStyles, paragraphSharedStyles, listsSharedStyles, indentationSharedStyles, shadowSharedStyle, InlineNodeViewSharedStyles, token('color.border.focused', '#8cf'), placeholderTextStyles, placeholderStyles, codeBlockStyles(props), blocktypeStyles(props), textFormattingStyles(props), textColorStyles, listsStyles, ruleStyles(props), mediaStyles, layoutStyles, telepointerStyle, gapCursorStyles, tableStyles(props), panelStyles(props), fakeCursorStyles, mentionsStyles, emojiStyles, tasksAndDecisionsStyles, gridStyles, linkStyles, blockMarksSharedStyles, dateSharedStyle, extensionStyles, expandStyles(props), findReplaceStyles, taskDecisionStyles, statusStyles, annotationSharedStyles(props), smartCardStyles, smartCardSharedStyles, dateStyles, embedCardStyles, unsupportedStyles, ClassNames.FLOATING_TOOLBAR_COMPONENT);
};

export var createEditorContentStyle = function createEditorContentStyle(styles) {
  return /*#__PURE__*/React.forwardRef(function (props, ref) {
    var featureFlags = useFeatureFlags();
    var className = props.className,
        children = props.children;
    var theme = useTheme();
    var memoizedStyle = useMemo(function () {
      return contentStyles({
        theme: theme,
        featureFlags: featureFlags
      });
    }, [theme, featureFlags]);
    return jsx("div", {
      className: className,
      ref: ref,
      css: [memoizedStyle, styles]
    }, children);
  });
};
export default createEditorContentStyle();
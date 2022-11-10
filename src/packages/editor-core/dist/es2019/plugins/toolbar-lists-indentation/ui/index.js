/** @jsx jsx */
import { jsx } from '@emotion/react';
import { onItemActivated } from './onItemActivated';
import { ToolbarDropdown } from './ToolbarDropdown';
import { Toolbar } from './Toolbar';
export default function ToolbarListsIndentation(props) {
  const {
    disabled,
    isSmall,
    isReducedSpacing,
    bulletListActive,
    bulletListDisabled,
    orderedListActive,
    orderedListDisabled,
    showIndentationButtons,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    indentDisabled,
    outdentDisabled
  } = props;

  if (isSmall) {
    return jsx(ToolbarDropdown, {
      editorView: props.editorView,
      isReducedSpacing: isReducedSpacing,
      popupsMountPoint: popupsMountPoint,
      popupsBoundariesElement: popupsBoundariesElement,
      popupsScrollableElement: popupsScrollableElement,
      bulletListActive: bulletListActive,
      bulletListDisabled: bulletListDisabled,
      showIndentationButtons: showIndentationButtons,
      orderedListActive: orderedListActive,
      orderedListDisabled: orderedListDisabled,
      indentDisabled: indentDisabled,
      outdentDisabled: outdentDisabled,
      disabled: disabled,
      onItemActivated: onItemActivated
    });
  }

  return jsx(Toolbar, {
    editorView: props.editorView,
    isReducedSpacing: isReducedSpacing,
    bulletListActive: bulletListActive,
    bulletListDisabled: bulletListDisabled,
    showIndentationButtons: showIndentationButtons,
    orderedListActive: orderedListActive,
    orderedListDisabled: orderedListDisabled,
    indentDisabled: indentDisabled,
    outdentDisabled: outdentDisabled,
    disabled: disabled,
    onItemActivated: onItemActivated
  });
}
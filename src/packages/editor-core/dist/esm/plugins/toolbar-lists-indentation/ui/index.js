/** @jsx jsx */
import { jsx } from '@emotion/react';
import { onItemActivated } from './onItemActivated';
import { ToolbarDropdown } from './ToolbarDropdown';
import { Toolbar } from './Toolbar';
export default function ToolbarListsIndentation(props) {
  var disabled = props.disabled,
      isSmall = props.isSmall,
      isReducedSpacing = props.isReducedSpacing,
      bulletListActive = props.bulletListActive,
      bulletListDisabled = props.bulletListDisabled,
      orderedListActive = props.orderedListActive,
      orderedListDisabled = props.orderedListDisabled,
      showIndentationButtons = props.showIndentationButtons,
      popupsMountPoint = props.popupsMountPoint,
      popupsBoundariesElement = props.popupsBoundariesElement,
      popupsScrollableElement = props.popupsScrollableElement,
      indentDisabled = props.indentDisabled,
      outdentDisabled = props.outdentDisabled;

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
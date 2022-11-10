/** @jsx jsx */
import { jsx } from '@emotion/react';
import { useIntl } from 'react-intl-next';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import IndentIcon from '@atlaskit/icon/glyph/editor/indent';
import OutdentIcon from '@atlaskit/icon/glyph/editor/outdent';
import { toggleBulletList as toggleBulletListKeymap, toggleOrderedList as toggleOrderedListKeymap, indent as toggleIndentKeymap, outdent as toggleOutdentKeymap, ToolTipContent } from '../../../keymaps';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../ui/ToolbarButton';
import { messages } from '../../list/messages';
import { messages as indentationMessages } from '../../indentation/messages';
import { buttonGroupStyle, separatorStyles } from '../../../ui/styles';
export function Toolbar(props) {
  var _useIntl = useIntl(),
      formatMessage = _useIntl.formatMessage;

  var disabled = props.disabled,
      isReducedSpacing = props.isReducedSpacing,
      bulletListActive = props.bulletListActive,
      bulletListDisabled = props.bulletListDisabled,
      orderedListActive = props.orderedListActive,
      orderedListDisabled = props.orderedListDisabled,
      showIndentationButtons = props.showIndentationButtons,
      indentDisabled = props.indentDisabled,
      outdentDisabled = props.outdentDisabled,
      onItemActivated = props.onItemActivated;
  var labelUnorderedList = formatMessage(messages.unorderedList);
  var labelOrderedList = formatMessage(messages.orderedList);

  var handleOnItemActivated = function handleOnItemActivated(buttonName) {
    return function (event) {
      return onItemActivated({
        editorView: props.editorView,
        buttonName: buttonName
      });
    };
  };

  return jsx("span", {
    css: buttonGroupStyle
  }, jsx(ToolbarButton, {
    buttonId: TOOLBAR_BUTTON.BULLET_LIST,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('bullet_list'),
    selected: bulletListActive,
    "aria-pressed": bulletListActive,
    "aria-label": labelUnorderedList,
    disabled: bulletListDisabled || disabled,
    title: jsx(ToolTipContent, {
      description: labelUnorderedList,
      keymap: toggleBulletListKeymap
    }),
    iconBefore: jsx(BulletListIcon, {
      label: ""
    })
  }), jsx(ToolbarButton, {
    buttonId: TOOLBAR_BUTTON.ORDERED_LIST,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('ordered_list'),
    selected: orderedListActive,
    "aria-pressed": orderedListActive,
    "aria-label": labelOrderedList,
    disabled: orderedListDisabled || disabled,
    title: jsx(ToolTipContent, {
      description: labelOrderedList,
      keymap: toggleOrderedListKeymap
    }),
    iconBefore: jsx(NumberListIcon, {
      label: ""
    })
  }), showIndentationButtons && jsx(ToolbarButton, {
    buttonId: TOOLBAR_BUTTON.OUTDENT,
    testId: TOOLBAR_BUTTON.OUTDENT,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('outdent'),
    iconBefore: jsx(OutdentIcon, {
      label: ""
    }),
    disabled: outdentDisabled || disabled,
    "aria-label": formatMessage(indentationMessages.outdent),
    title: jsx(ToolTipContent, {
      description: formatMessage(indentationMessages.outdent),
      keymap: toggleOutdentKeymap
    })
  }), showIndentationButtons && jsx(ToolbarButton, {
    buttonId: TOOLBAR_BUTTON.INDENT,
    testId: TOOLBAR_BUTTON.INDENT,
    spacing: isReducedSpacing ? 'none' : 'default',
    onClick: handleOnItemActivated('indent'),
    iconBefore: jsx(IndentIcon, {
      label: ""
    }),
    disabled: indentDisabled || disabled,
    "aria-label": formatMessage(indentationMessages.indent),
    title: jsx(ToolTipContent, {
      description: formatMessage(indentationMessages.indent),
      keymap: toggleIndentKeymap
    })
  }), jsx("span", {
    css: separatorStyles
  }));
}
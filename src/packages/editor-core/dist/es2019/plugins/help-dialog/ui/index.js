import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl-next';
import { browser } from '@atlaskit/editor-common/utils';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import AkModalDialog, { ModalTransition, useModal } from '@atlaskit/modal-dialog';
import { header, footer, contentWrapper, line, content, row, codeSm, codeMd, codeLg, title, column, dialogHeader } from './styles';
import * as keymaps from '../../../keymaps';
import ToolbarButton from '../../../ui/ToolbarButton';
import { toolbarMessages } from '../../text-formatting/ui/Toolbar/toolbar-messages';
import { messages as listMessages } from '../../list/messages';
import { messages as insertBlockMessages } from '../../insert-block/ui/ToolbarInsertBlock/messages';
import { messages as blockTypeMessages } from '../../block-type/messages';
import { messages as undoRedoMessages } from '../../undo-redo/messages';
import { alignmentMessages } from '../../../ui/Alignment/messages';
import { closeHelpCommand } from '../commands';
import { annotationMessages } from '../../annotation/toolbar';
const messages = defineMessages({
  editorHelp: {
    id: 'fabric.editor.editorHelp',
    defaultMessage: 'Editor help',
    description: 'Title of editor help dialog.'
  },
  helpDialogTips: {
    id: 'fabric.editor.helpDialogTips',
    defaultMessage: 'Press {keyMap} to quickly open this dialog at any time',
    description: 'Hint about how to open a dialog quickly using a shortcut.'
  },
  keyboardShortcuts: {
    id: 'fabric.editor.keyboardShortcuts',
    defaultMessage: 'Keyboard shortcuts',
    description: ''
  },
  markdown: {
    id: 'fabric.editor.markdown',
    defaultMessage: 'Markdown',
    description: 'It is a name of popular markup language.'
  },
  pastePlainText: {
    id: 'fabric.editor.pastePlainText',
    defaultMessage: 'Paste plain text',
    description: ''
  },
  altText: {
    id: 'fabric.editor.altText',
    defaultMessage: 'Alt text',
    description: 'Alternative text for image.'
  },
  closeHelpDialog: {
    id: 'fabric.editor.closeHelpDialog',
    defaultMessage: 'Close help dialog',
    description: ''
  },
  // TODO: Move it inside quick insert plugin
  quickInsert: {
    id: 'fabric.editor.quickInsert',
    defaultMessage: 'Quick insert',
    description: 'Name of a feature, which let you insert items quickly.'
  }
});
export const formatting = ({
  formatMessage
}) => [{
  name: formatMessage(toolbarMessages.bold),
  type: 'strong',
  keymap: () => keymaps.toggleBold,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "**", jsx(FormattedMessage, toolbarMessages.bold), "**"))
}, {
  name: formatMessage(toolbarMessages.italic),
  type: 'em',
  keymap: () => keymaps.toggleItalic,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "*", jsx(FormattedMessage, toolbarMessages.italic), "*"))
}, {
  name: formatMessage(toolbarMessages.underline),
  type: 'underline',
  keymap: () => keymaps.toggleUnderline
}, {
  name: formatMessage(toolbarMessages.strike),
  type: 'strike',
  keymap: () => keymaps.toggleStrikethrough,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "~~", jsx(FormattedMessage, toolbarMessages.strike), "~~"))
}, {
  name: formatMessage(toolbarMessages.subscript),
  type: 'subsup',
  keymap: () => keymaps.toggleSubscript
}, {
  name: formatMessage(toolbarMessages.superscript),
  type: 'subsup',
  keymap: () => keymaps.toggleSuperscript
}, {
  name: formatMessage(blockTypeMessages.heading1),
  type: 'heading',
  keymap: () => keymaps.toggleHeading1,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeSm
  }, "#"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.heading2),
  type: 'heading',
  keymap: () => keymaps.toggleHeading2,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "##"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.heading3),
  type: 'heading',
  keymap: () => keymaps.toggleHeading3,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "###"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.heading4),
  type: 'heading',
  keymap: () => keymaps.toggleHeading4,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "####"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.heading5),
  type: 'heading',
  keymap: () => keymaps.toggleHeading5,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "#####"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.heading6),
  type: 'heading',
  keymap: () => keymaps.toggleHeading6,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "######"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.normal),
  type: 'paragraph',
  keymap: () => keymaps.setNormalText
}, {
  name: formatMessage(listMessages.orderedList),
  type: 'orderedList',
  keymap: () => keymaps.toggleOrderedList,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeSm
  }, "1."), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(listMessages.unorderedList),
  type: 'bulletList',
  keymap: () => keymaps.toggleBulletList,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeSm
  }, "*"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.blockquote),
  type: 'blockquote',
  keymap: () => keymaps.toggleBlockQuote,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, '>'), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(blockTypeMessages.codeblock),
  type: 'codeBlock',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "```"))
}, {
  name: formatMessage(insertBlockMessages.horizontalRule),
  type: 'rule',
  keymap: () => keymaps.insertRule,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "---"))
}, {
  name: formatMessage(insertBlockMessages.link),
  type: 'link',
  keymap: () => keymaps.addLink,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "[", jsx(FormattedMessage, insertBlockMessages.link), "](http://a.com)"))
}, {
  name: formatMessage(toolbarMessages.code),
  type: 'code',
  keymap: () => keymaps.toggleCode,
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "`", jsx(FormattedMessage, toolbarMessages.code), "`"))
}, {
  name: formatMessage(insertBlockMessages.action),
  type: 'taskItem',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeSm
  }, "[]"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(insertBlockMessages.decision),
  type: 'decisionItem',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeSm
  }, "<>"), " ", jsx("span", {
    css: codeLg
  }, "Space"))
}, {
  name: formatMessage(insertBlockMessages.emoji),
  type: 'emoji',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, ":"))
}, {
  name: formatMessage(insertBlockMessages.mention),
  type: 'mention',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "@"))
}, {
  name: formatMessage(alignmentMessages.alignLeft),
  type: 'alignment',
  keymap: () => keymaps.alignLeft
}, {
  name: formatMessage(alignmentMessages.alignRight),
  type: 'alignment',
  keymap: () => keymaps.alignRight
}];
const shortcutNamesWithoutKeymap = ['emoji', 'mention', 'quickInsert'];

const otherFormatting = ({
  formatMessage
}) => [{
  name: formatMessage(toolbarMessages.clearFormatting),
  type: 'clearFormatting',
  keymap: () => keymaps.clearFormatting
}, {
  name: formatMessage(undoRedoMessages.undo),
  type: 'undo',
  keymap: () => keymaps.undo
}, {
  name: formatMessage(undoRedoMessages.redo),
  type: 'redo',
  keymap: () => keymaps.redo
}, {
  name: formatMessage(messages.pastePlainText),
  type: 'paste',
  keymap: () => keymaps.pastePlainText
}, {
  name: formatMessage(annotationMessages.createComment),
  type: 'annotation',
  keymap: () => keymaps.addInlineComment
}];

const imageAutoFormat = {
  name: 'Image',
  type: 'image',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "![", jsx(FormattedMessage, messages.altText), "](http://www.image.com)"))
};

const quickInsertAutoFormat = ({
  formatMessage
}) => ({
  name: formatMessage(messages.quickInsert),
  type: 'quickInsert',
  autoFormatting: () => jsx("span", null, jsx("span", {
    css: codeLg
  }, "/"))
});

const getKeyParts = keymap => {
  let shortcut = keymap[browser.mac ? 'mac' : 'windows'];

  if (browser.mac) {
    shortcut = shortcut.replace('Alt', 'Opt');
  }

  return shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
};

export const getSupportedFormatting = (schema, intl, imageEnabled, quickInsertEnabled) => {
  const supportedBySchema = formatting(intl).filter(format => schema.nodes[format.type] || schema.marks[format.type]);
  return [...supportedBySchema, ...(imageEnabled ? [imageAutoFormat] : []), ...(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []), ...otherFormatting(intl)];
};
export const getComponentFromKeymap = keymap => {
  const keyParts = getKeyParts(keymap);
  return jsx("span", null, keyParts.map((part, index) => {
    if (part === '+') {
      return jsx("span", {
        key: `${keyParts}-${index}`
      }, ' + ');
    } else if (part === 'Cmd') {
      return jsx("span", {
        css: codeSm,
        key: `${keyParts}-${index}`
      }, "\u2318");
    } else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
      return jsx("span", {
        css: codeMd,
        key: `${keyParts}-${index}`
      }, part);
    }

    return jsx("span", {
      css: codeSm,
      key: `${keyParts}-${index}`
    }, part.toUpperCase());
  }));
};
const ModalHeader = injectIntl(({
  intl: {
    formatMessage
  }
}) => {
  const {
    onClose
  } = useModal();
  return jsx("div", {
    css: header
  }, jsx("h1", {
    css: dialogHeader
  }, jsx(FormattedMessage, messages.editorHelp)), jsx("div", null, jsx(ToolbarButton // @ts-ignore
  , {
    onClick: onClose,
    title: formatMessage(messages.closeHelpDialog),
    spacing: "compact",
    iconBefore: jsx(CrossIcon, {
      label: formatMessage(messages.closeHelpDialog),
      size: "medium"
    })
  })));
});

const ModalFooter = () => jsx("div", {
  css: footer
}, jsx(FormattedMessage, _extends({}, messages.helpDialogTips, {
  values: {
    keyMap: getComponentFromKeymap(keymaps.openHelp)
  }
})));

class HelpDialog extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "formatting", []);

    _defineProperty(this, "closeDialog", () => {
      const {
        state: {
          tr
        },
        dispatch
      } = this.props.editorView;
      closeHelpCommand(tr, dispatch);
    });

    _defineProperty(this, "handleEsc", e => {
      if (e.key === 'Escape' && this.props.isVisible) {
        this.closeDialog();
      }
    });
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEsc);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEsc);
  }

  render() {
    const {
      editorView,
      intl,
      imageEnabled,
      quickInsertEnabled
    } = this.props;
    this.formatting = getSupportedFormatting(editorView.state.schema, intl, imageEnabled, quickInsertEnabled);
    return jsx(ModalTransition, null, this.props.isVisible ? jsx(AkModalDialog, {
      width: "large",
      onClose: this.closeDialog,
      testId: "help-modal-dialog"
    }, jsx(ModalHeader, null), jsx("div", {
      css: contentWrapper
    }, jsx("div", {
      css: line
    }), jsx("div", {
      css: content
    }, jsx("div", {
      css: column
    }, jsx("h2", {
      css: title
    }, jsx(FormattedMessage, messages.keyboardShortcuts)), jsx("ul", null, this.formatting.filter(form => {
      const keymap = form.keymap && form.keymap(this.props);
      return keymap && keymap[browser.mac ? 'mac' : 'windows'];
    }).map(form => jsx("li", {
      css: row,
      key: `textFormatting-${form.name}`
    }, jsx("span", null, form.name), getComponentFromKeymap(form.keymap()))), this.formatting.filter(form => shortcutNamesWithoutKeymap.indexOf(form.type) !== -1).filter(form => form.autoFormatting).map(form => jsx("li", {
      css: row,
      key: `autoFormatting-${form.name}`
    }, jsx("span", null, form.name), form.autoFormatting())))), jsx("div", {
      css: line
    }), jsx("div", {
      css: column
    }, jsx("h2", {
      css: title
    }, jsx(FormattedMessage, messages.markdown)), jsx("ul", null, this.formatting.filter(form => shortcutNamesWithoutKeymap.indexOf(form.type) === -1).map(form => form.autoFormatting && jsx("li", {
      key: `autoFormatting-${form.name}`,
      css: row
    }, jsx("span", null, form.name), form.autoFormatting())))))), jsx(ModalFooter, null)) : null);
  }

}

_defineProperty(HelpDialog, "displayName", 'HelpDialog');

export default injectIntl(HelpDialog);
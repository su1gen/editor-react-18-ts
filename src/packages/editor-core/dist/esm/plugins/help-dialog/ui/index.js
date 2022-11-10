import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
var messages = defineMessages({
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
export var formatting = function formatting(_ref) {
  var formatMessage = _ref.formatMessage;
  return [{
    name: formatMessage(toolbarMessages.bold),
    type: 'strong',
    keymap: function keymap() {
      return keymaps.toggleBold;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "**", jsx(FormattedMessage, toolbarMessages.bold), "**"));
    }
  }, {
    name: formatMessage(toolbarMessages.italic),
    type: 'em',
    keymap: function keymap() {
      return keymaps.toggleItalic;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "*", jsx(FormattedMessage, toolbarMessages.italic), "*"));
    }
  }, {
    name: formatMessage(toolbarMessages.underline),
    type: 'underline',
    keymap: function keymap() {
      return keymaps.toggleUnderline;
    }
  }, {
    name: formatMessage(toolbarMessages.strike),
    type: 'strike',
    keymap: function keymap() {
      return keymaps.toggleStrikethrough;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "~~", jsx(FormattedMessage, toolbarMessages.strike), "~~"));
    }
  }, {
    name: formatMessage(toolbarMessages.subscript),
    type: 'subsup',
    keymap: function keymap() {
      return keymaps.toggleSubscript;
    }
  }, {
    name: formatMessage(toolbarMessages.superscript),
    type: 'subsup',
    keymap: function keymap() {
      return keymaps.toggleSuperscript;
    }
  }, {
    name: formatMessage(blockTypeMessages.heading1),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading1;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeSm
      }, "#"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.heading2),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading2;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "##"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.heading3),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading3;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "###"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.heading4),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading4;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "####"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.heading5),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading5;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "#####"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.heading6),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading6;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "######"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.normal),
    type: 'paragraph',
    keymap: function keymap() {
      return keymaps.setNormalText;
    }
  }, {
    name: formatMessage(listMessages.orderedList),
    type: 'orderedList',
    keymap: function keymap() {
      return keymaps.toggleOrderedList;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeSm
      }, "1."), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(listMessages.unorderedList),
    type: 'bulletList',
    keymap: function keymap() {
      return keymaps.toggleBulletList;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeSm
      }, "*"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.blockquote),
    type: 'blockquote',
    keymap: function keymap() {
      return keymaps.toggleBlockQuote;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, '>'), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(blockTypeMessages.codeblock),
    type: 'codeBlock',
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "```"));
    }
  }, {
    name: formatMessage(insertBlockMessages.horizontalRule),
    type: 'rule',
    keymap: function keymap() {
      return keymaps.insertRule;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "---"));
    }
  }, {
    name: formatMessage(insertBlockMessages.link),
    type: 'link',
    keymap: function keymap() {
      return keymaps.addLink;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "[", jsx(FormattedMessage, insertBlockMessages.link), "](http://a.com)"));
    }
  }, {
    name: formatMessage(toolbarMessages.code),
    type: 'code',
    keymap: function keymap() {
      return keymaps.toggleCode;
    },
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "`", jsx(FormattedMessage, toolbarMessages.code), "`"));
    }
  }, {
    name: formatMessage(insertBlockMessages.action),
    type: 'taskItem',
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeSm
      }, "[]"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(insertBlockMessages.decision),
    type: 'decisionItem',
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeSm
      }, "<>"), " ", jsx("span", {
        css: codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(insertBlockMessages.emoji),
    type: 'emoji',
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, ":"));
    }
  }, {
    name: formatMessage(insertBlockMessages.mention),
    type: 'mention',
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "@"));
    }
  }, {
    name: formatMessage(alignmentMessages.alignLeft),
    type: 'alignment',
    keymap: function keymap() {
      return keymaps.alignLeft;
    }
  }, {
    name: formatMessage(alignmentMessages.alignRight),
    type: 'alignment',
    keymap: function keymap() {
      return keymaps.alignRight;
    }
  }];
};
var shortcutNamesWithoutKeymap = ['emoji', 'mention', 'quickInsert'];

var otherFormatting = function otherFormatting(_ref2) {
  var formatMessage = _ref2.formatMessage;
  return [{
    name: formatMessage(toolbarMessages.clearFormatting),
    type: 'clearFormatting',
    keymap: function keymap() {
      return keymaps.clearFormatting;
    }
  }, {
    name: formatMessage(undoRedoMessages.undo),
    type: 'undo',
    keymap: function keymap() {
      return keymaps.undo;
    }
  }, {
    name: formatMessage(undoRedoMessages.redo),
    type: 'redo',
    keymap: function keymap() {
      return keymaps.redo;
    }
  }, {
    name: formatMessage(messages.pastePlainText),
    type: 'paste',
    keymap: function keymap() {
      return keymaps.pastePlainText;
    }
  }, {
    name: formatMessage(annotationMessages.createComment),
    type: 'annotation',
    keymap: function keymap() {
      return keymaps.addInlineComment;
    }
  }];
};

var imageAutoFormat = {
  name: 'Image',
  type: 'image',
  autoFormatting: function autoFormatting() {
    return jsx("span", null, jsx("span", {
      css: codeLg
    }, "![", jsx(FormattedMessage, messages.altText), "](http://www.image.com)"));
  }
};

var quickInsertAutoFormat = function quickInsertAutoFormat(_ref3) {
  var formatMessage = _ref3.formatMessage;
  return {
    name: formatMessage(messages.quickInsert),
    type: 'quickInsert',
    autoFormatting: function autoFormatting() {
      return jsx("span", null, jsx("span", {
        css: codeLg
      }, "/"));
    }
  };
};

var getKeyParts = function getKeyParts(keymap) {
  var shortcut = keymap[browser.mac ? 'mac' : 'windows'];

  if (browser.mac) {
    shortcut = shortcut.replace('Alt', 'Opt');
  }

  return shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
};

export var getSupportedFormatting = function getSupportedFormatting(schema, intl, imageEnabled, quickInsertEnabled) {
  var supportedBySchema = formatting(intl).filter(function (format) {
    return schema.nodes[format.type] || schema.marks[format.type];
  });
  return [].concat(_toConsumableArray(supportedBySchema), _toConsumableArray(imageEnabled ? [imageAutoFormat] : []), _toConsumableArray(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []), _toConsumableArray(otherFormatting(intl)));
};
export var getComponentFromKeymap = function getComponentFromKeymap(keymap) {
  var keyParts = getKeyParts(keymap);
  return jsx("span", null, keyParts.map(function (part, index) {
    if (part === '+') {
      return jsx("span", {
        key: "".concat(keyParts, "-").concat(index)
      }, ' + ');
    } else if (part === 'Cmd') {
      return jsx("span", {
        css: codeSm,
        key: "".concat(keyParts, "-").concat(index)
      }, "\u2318");
    } else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
      return jsx("span", {
        css: codeMd,
        key: "".concat(keyParts, "-").concat(index)
      }, part);
    }

    return jsx("span", {
      css: codeSm,
      key: "".concat(keyParts, "-").concat(index)
    }, part.toUpperCase());
  }));
};
var ModalHeader = injectIntl(function (_ref4) {
  var formatMessage = _ref4.intl.formatMessage;

  var _useModal = useModal(),
      onClose = _useModal.onClose;

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

var ModalFooter = function ModalFooter() {
  return jsx("div", {
    css: footer
  }, jsx(FormattedMessage, _extends({}, messages.helpDialogTips, {
    values: {
      keyMap: getComponentFromKeymap(keymaps.openHelp)
    }
  })));
};

var HelpDialog = /*#__PURE__*/function (_React$Component) {
  _inherits(HelpDialog, _React$Component);

  var _super = _createSuper(HelpDialog);

  function HelpDialog() {
    var _this;

    _classCallCheck(this, HelpDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "formatting", []);

    _defineProperty(_assertThisInitialized(_this), "closeDialog", function () {
      var _this$props$editorVie = _this.props.editorView,
          tr = _this$props$editorVie.state.tr,
          dispatch = _this$props$editorVie.dispatch;
      closeHelpCommand(tr, dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "handleEsc", function (e) {
      if (e.key === 'Escape' && _this.props.isVisible) {
        _this.closeDialog();
      }
    });

    return _this;
  }

  _createClass(HelpDialog, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      document.addEventListener('keydown', this.handleEsc);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      document.removeEventListener('keydown', this.handleEsc);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          editorView = _this$props.editorView,
          intl = _this$props.intl,
          imageEnabled = _this$props.imageEnabled,
          quickInsertEnabled = _this$props.quickInsertEnabled;
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
      }, jsx(FormattedMessage, messages.keyboardShortcuts)), jsx("ul", null, this.formatting.filter(function (form) {
        var keymap = form.keymap && form.keymap(_this2.props);
        return keymap && keymap[browser.mac ? 'mac' : 'windows'];
      }).map(function (form) {
        return jsx("li", {
          css: row,
          key: "textFormatting-".concat(form.name)
        }, jsx("span", null, form.name), getComponentFromKeymap(form.keymap()));
      }), this.formatting.filter(function (form) {
        return shortcutNamesWithoutKeymap.indexOf(form.type) !== -1;
      }).filter(function (form) {
        return form.autoFormatting;
      }).map(function (form) {
        return jsx("li", {
          css: row,
          key: "autoFormatting-".concat(form.name)
        }, jsx("span", null, form.name), form.autoFormatting());
      }))), jsx("div", {
        css: line
      }), jsx("div", {
        css: column
      }, jsx("h2", {
        css: title
      }, jsx(FormattedMessage, messages.markdown)), jsx("ul", null, this.formatting.filter(function (form) {
        return shortcutNamesWithoutKeymap.indexOf(form.type) === -1;
      }).map(function (form) {
        return form.autoFormatting && jsx("li", {
          key: "autoFormatting-".concat(form.name),
          css: row
        }, jsx("span", null, form.name), form.autoFormatting());
      }))))), jsx(ModalFooter, null)) : null);
    }
  }]);

  return HelpDialog;
}(React.Component);

_defineProperty(HelpDialog, "displayName", 'HelpDialog');

export default injectIntl(HelpDialog);
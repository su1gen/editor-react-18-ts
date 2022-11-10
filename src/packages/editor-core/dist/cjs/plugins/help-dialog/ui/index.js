"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSupportedFormatting = exports.getComponentFromKeymap = exports.formatting = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _utils = require("@atlaskit/editor-common/utils");

var _cross = _interopRequireDefault(require("@atlaskit/icon/glyph/cross"));

var _modalDialog = _interopRequireWildcard(require("@atlaskit/modal-dialog"));

var _styles = require("./styles");

var keymaps = _interopRequireWildcard(require("../../../keymaps"));

var _ToolbarButton = _interopRequireDefault(require("../../../ui/ToolbarButton"));

var _toolbarMessages = require("../../text-formatting/ui/Toolbar/toolbar-messages");

var _messages = require("../../list/messages");

var _messages2 = require("../../insert-block/ui/ToolbarInsertBlock/messages");

var _messages3 = require("../../block-type/messages");

var _messages4 = require("../../undo-redo/messages");

var _messages5 = require("../../../ui/Alignment/messages");

var _commands = require("../commands");

var _toolbar = require("../../annotation/toolbar");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var messages = (0, _reactIntlNext.defineMessages)({
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

var formatting = function formatting(_ref) {
  var formatMessage = _ref.formatMessage;
  return [{
    name: formatMessage(_toolbarMessages.toolbarMessages.bold),
    type: 'strong',
    keymap: function keymap() {
      return keymaps.toggleBold;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "**", (0, _react2.jsx)(_reactIntlNext.FormattedMessage, _toolbarMessages.toolbarMessages.bold), "**"));
    }
  }, {
    name: formatMessage(_toolbarMessages.toolbarMessages.italic),
    type: 'em',
    keymap: function keymap() {
      return keymaps.toggleItalic;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "*", (0, _react2.jsx)(_reactIntlNext.FormattedMessage, _toolbarMessages.toolbarMessages.italic), "*"));
    }
  }, {
    name: formatMessage(_toolbarMessages.toolbarMessages.underline),
    type: 'underline',
    keymap: function keymap() {
      return keymaps.toggleUnderline;
    }
  }, {
    name: formatMessage(_toolbarMessages.toolbarMessages.strike),
    type: 'strike',
    keymap: function keymap() {
      return keymaps.toggleStrikethrough;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "~~", (0, _react2.jsx)(_reactIntlNext.FormattedMessage, _toolbarMessages.toolbarMessages.strike), "~~"));
    }
  }, {
    name: formatMessage(_toolbarMessages.toolbarMessages.subscript),
    type: 'subsup',
    keymap: function keymap() {
      return keymaps.toggleSubscript;
    }
  }, {
    name: formatMessage(_toolbarMessages.toolbarMessages.superscript),
    type: 'subsup',
    keymap: function keymap() {
      return keymaps.toggleSuperscript;
    }
  }, {
    name: formatMessage(_messages3.messages.heading1),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading1;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeSm
      }, "#"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.heading2),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading2;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "##"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.heading3),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading3;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "###"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.heading4),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading4;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "####"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.heading5),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading5;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "#####"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.heading6),
    type: 'heading',
    keymap: function keymap() {
      return keymaps.toggleHeading6;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "######"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.normal),
    type: 'paragraph',
    keymap: function keymap() {
      return keymaps.setNormalText;
    }
  }, {
    name: formatMessage(_messages.messages.orderedList),
    type: 'orderedList',
    keymap: function keymap() {
      return keymaps.toggleOrderedList;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeSm
      }, "1."), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages.messages.unorderedList),
    type: 'bulletList',
    keymap: function keymap() {
      return keymaps.toggleBulletList;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeSm
      }, "*"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.blockquote),
    type: 'blockquote',
    keymap: function keymap() {
      return keymaps.toggleBlockQuote;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, '>'), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages3.messages.codeblock),
    type: 'codeBlock',
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "```"));
    }
  }, {
    name: formatMessage(_messages2.messages.horizontalRule),
    type: 'rule',
    keymap: function keymap() {
      return keymaps.insertRule;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "---"));
    }
  }, {
    name: formatMessage(_messages2.messages.link),
    type: 'link',
    keymap: function keymap() {
      return keymaps.addLink;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "[", (0, _react2.jsx)(_reactIntlNext.FormattedMessage, _messages2.messages.link), "](http://a.com)"));
    }
  }, {
    name: formatMessage(_toolbarMessages.toolbarMessages.code),
    type: 'code',
    keymap: function keymap() {
      return keymaps.toggleCode;
    },
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "`", (0, _react2.jsx)(_reactIntlNext.FormattedMessage, _toolbarMessages.toolbarMessages.code), "`"));
    }
  }, {
    name: formatMessage(_messages2.messages.action),
    type: 'taskItem',
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeSm
      }, "[]"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages2.messages.decision),
    type: 'decisionItem',
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeSm
      }, "<>"), " ", (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "Space"));
    }
  }, {
    name: formatMessage(_messages2.messages.emoji),
    type: 'emoji',
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, ":"));
    }
  }, {
    name: formatMessage(_messages2.messages.mention),
    type: 'mention',
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "@"));
    }
  }, {
    name: formatMessage(_messages5.alignmentMessages.alignLeft),
    type: 'alignment',
    keymap: function keymap() {
      return keymaps.alignLeft;
    }
  }, {
    name: formatMessage(_messages5.alignmentMessages.alignRight),
    type: 'alignment',
    keymap: function keymap() {
      return keymaps.alignRight;
    }
  }];
};

exports.formatting = formatting;
var shortcutNamesWithoutKeymap = ['emoji', 'mention', 'quickInsert'];

var otherFormatting = function otherFormatting(_ref2) {
  var formatMessage = _ref2.formatMessage;
  return [{
    name: formatMessage(_toolbarMessages.toolbarMessages.clearFormatting),
    type: 'clearFormatting',
    keymap: function keymap() {
      return keymaps.clearFormatting;
    }
  }, {
    name: formatMessage(_messages4.messages.undo),
    type: 'undo',
    keymap: function keymap() {
      return keymaps.undo;
    }
  }, {
    name: formatMessage(_messages4.messages.redo),
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
    name: formatMessage(_toolbar.annotationMessages.createComment),
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
    return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
      css: _styles.codeLg
    }, "![", (0, _react2.jsx)(_reactIntlNext.FormattedMessage, messages.altText), "](http://www.image.com)"));
  }
};

var quickInsertAutoFormat = function quickInsertAutoFormat(_ref3) {
  var formatMessage = _ref3.formatMessage;
  return {
    name: formatMessage(messages.quickInsert),
    type: 'quickInsert',
    autoFormatting: function autoFormatting() {
      return (0, _react2.jsx)("span", null, (0, _react2.jsx)("span", {
        css: _styles.codeLg
      }, "/"));
    }
  };
};

var getKeyParts = function getKeyParts(keymap) {
  var shortcut = keymap[_utils.browser.mac ? 'mac' : 'windows'];

  if (_utils.browser.mac) {
    shortcut = shortcut.replace('Alt', 'Opt');
  }

  return shortcut.replace(/\-(?=.)/g, ' + ').split(' ');
};

var getSupportedFormatting = function getSupportedFormatting(schema, intl, imageEnabled, quickInsertEnabled) {
  var supportedBySchema = formatting(intl).filter(function (format) {
    return schema.nodes[format.type] || schema.marks[format.type];
  });
  return [].concat((0, _toConsumableArray2.default)(supportedBySchema), (0, _toConsumableArray2.default)(imageEnabled ? [imageAutoFormat] : []), (0, _toConsumableArray2.default)(quickInsertEnabled ? [quickInsertAutoFormat(intl)] : []), (0, _toConsumableArray2.default)(otherFormatting(intl)));
};

exports.getSupportedFormatting = getSupportedFormatting;

var getComponentFromKeymap = function getComponentFromKeymap(keymap) {
  var keyParts = getKeyParts(keymap);
  return (0, _react2.jsx)("span", null, keyParts.map(function (part, index) {
    if (part === '+') {
      return (0, _react2.jsx)("span", {
        key: "".concat(keyParts, "-").concat(index)
      }, ' + ');
    } else if (part === 'Cmd') {
      return (0, _react2.jsx)("span", {
        css: _styles.codeSm,
        key: "".concat(keyParts, "-").concat(index)
      }, "\u2318");
    } else if (['ctrl', 'alt', 'opt', 'shift'].indexOf(part.toLowerCase()) >= 0) {
      return (0, _react2.jsx)("span", {
        css: _styles.codeMd,
        key: "".concat(keyParts, "-").concat(index)
      }, part);
    }

    return (0, _react2.jsx)("span", {
      css: _styles.codeSm,
      key: "".concat(keyParts, "-").concat(index)
    }, part.toUpperCase());
  }));
};

exports.getComponentFromKeymap = getComponentFromKeymap;
var ModalHeader = (0, _reactIntlNext.injectIntl)(function (_ref4) {
  var formatMessage = _ref4.intl.formatMessage;

  var _useModal = (0, _modalDialog.useModal)(),
      onClose = _useModal.onClose;

  return (0, _react2.jsx)("div", {
    css: _styles.header
  }, (0, _react2.jsx)("h1", {
    css: _styles.dialogHeader
  }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, messages.editorHelp)), (0, _react2.jsx)("div", null, (0, _react2.jsx)(_ToolbarButton.default // @ts-ignore
  , {
    onClick: onClose,
    title: formatMessage(messages.closeHelpDialog),
    spacing: "compact",
    iconBefore: (0, _react2.jsx)(_cross.default, {
      label: formatMessage(messages.closeHelpDialog),
      size: "medium"
    })
  })));
});

var ModalFooter = function ModalFooter() {
  return (0, _react2.jsx)("div", {
    css: _styles.footer
  }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, (0, _extends2.default)({}, messages.helpDialogTips, {
    values: {
      keyMap: getComponentFromKeymap(keymaps.openHelp)
    }
  })));
};

var HelpDialog = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(HelpDialog, _React$Component);

  var _super = _createSuper(HelpDialog);

  function HelpDialog() {
    var _this;

    (0, _classCallCheck2.default)(this, HelpDialog);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "formatting", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "closeDialog", function () {
      var _this$props$editorVie = _this.props.editorView,
          tr = _this$props$editorVie.state.tr,
          dispatch = _this$props$editorVie.dispatch;
      (0, _commands.closeHelpCommand)(tr, dispatch);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleEsc", function (e) {
      if (e.key === 'Escape' && _this.props.isVisible) {
        _this.closeDialog();
      }
    });
    return _this;
  }

  (0, _createClass2.default)(HelpDialog, [{
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
      return (0, _react2.jsx)(_modalDialog.ModalTransition, null, this.props.isVisible ? (0, _react2.jsx)(_modalDialog.default, {
        width: "large",
        onClose: this.closeDialog,
        testId: "help-modal-dialog"
      }, (0, _react2.jsx)(ModalHeader, null), (0, _react2.jsx)("div", {
        css: _styles.contentWrapper
      }, (0, _react2.jsx)("div", {
        css: _styles.line
      }), (0, _react2.jsx)("div", {
        css: _styles.content
      }, (0, _react2.jsx)("div", {
        css: _styles.column
      }, (0, _react2.jsx)("h2", {
        css: _styles.title
      }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, messages.keyboardShortcuts)), (0, _react2.jsx)("ul", null, this.formatting.filter(function (form) {
        var keymap = form.keymap && form.keymap(_this2.props);
        return keymap && keymap[_utils.browser.mac ? 'mac' : 'windows'];
      }).map(function (form) {
        return (0, _react2.jsx)("li", {
          css: _styles.row,
          key: "textFormatting-".concat(form.name)
        }, (0, _react2.jsx)("span", null, form.name), getComponentFromKeymap(form.keymap()));
      }), this.formatting.filter(function (form) {
        return shortcutNamesWithoutKeymap.indexOf(form.type) !== -1;
      }).filter(function (form) {
        return form.autoFormatting;
      }).map(function (form) {
        return (0, _react2.jsx)("li", {
          css: _styles.row,
          key: "autoFormatting-".concat(form.name)
        }, (0, _react2.jsx)("span", null, form.name), form.autoFormatting());
      }))), (0, _react2.jsx)("div", {
        css: _styles.line
      }), (0, _react2.jsx)("div", {
        css: _styles.column
      }, (0, _react2.jsx)("h2", {
        css: _styles.title
      }, (0, _react2.jsx)(_reactIntlNext.FormattedMessage, messages.markdown)), (0, _react2.jsx)("ul", null, this.formatting.filter(function (form) {
        return shortcutNamesWithoutKeymap.indexOf(form.type) === -1;
      }).map(function (form) {
        return form.autoFormatting && (0, _react2.jsx)("li", {
          key: "autoFormatting-".concat(form.name),
          css: _styles.row
        }, (0, _react2.jsx)("span", null, form.name), form.autoFormatting());
      }))))), (0, _react2.jsx)(ModalFooter, null)) : null);
    }
  }]);
  return HelpDialog;
}(_react.default.Component);

(0, _defineProperty2.default)(HelpDialog, "displayName", 'HelpDialog');

var _default = (0, _reactIntlNext.injectIntl)(HelpDialog);

exports.default = _default;
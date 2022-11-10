"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ToolbarUndoRedo = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _undo = _interopRequireDefault(require("@atlaskit/icon/glyph/undo"));

var _redo = _interopRequireDefault(require("@atlaskit/icon/glyph/redo"));

var _keymaps = require("../../../../keymaps");

var _styles = require("../../../../ui/styles");

var _ToolbarButton = _interopRequireWildcard(require("../../../../ui/ToolbarButton"));

var _messages = require("../../messages");

var _api = require("../../../type-ahead/api");

var _commands = require("../../commands");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var closeTypeAheadAndRunCommand = function closeTypeAheadAndRunCommand(editorView) {
  return function (command) {
    if (!editorView) {
      return;
    }

    var tool = (0, _api.createTypeAheadTools)(editorView);

    if (tool.isOpen()) {
      tool.close({
        attachCommand: command,
        insertCurrentQueryAsRawText: false
      });
    } else {
      command(editorView.state, editorView.dispatch);
    }
  };
};

var forceFocus = function forceFocus(editorView) {
  return function (command) {
    closeTypeAheadAndRunCommand(editorView)(command);

    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  };
};

var ToolbarUndoRedo = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(ToolbarUndoRedo, _PureComponent);

  var _super = _createSuper(ToolbarUndoRedo);

  function ToolbarUndoRedo() {
    (0, _classCallCheck2.default)(this, ToolbarUndoRedo);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ToolbarUndoRedo, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          disabled = _this$props.disabled,
          isReducedSpacing = _this$props.isReducedSpacing,
          historyState = _this$props.historyState,
          editorView = _this$props.editorView,
          formatMessage = _this$props.intl.formatMessage;

      var handleUndo = function handleUndo() {
        forceFocus(editorView)(_commands.undoFromToolbar);
      };

      var handleRedo = function handleRedo() {
        forceFocus(editorView)(_commands.redoFromToolbar);
      };

      var labelUndo = formatMessage(_messages.messages.undo);
      var labelRedo = formatMessage(_messages.messages.redo);
      var canUndo = historyState.canUndo,
          canRedo = historyState.canRedo;
      return (0, _react2.jsx)("span", {
        css: _styles.buttonGroupStyle
      }, (0, _react2.jsx)(_ToolbarButton.default, {
        buttonId: _ToolbarButton.TOOLBAR_BUTTON.UNDO,
        spacing: isReducedSpacing ? 'none' : 'default',
        onClick: handleUndo,
        disabled: !canUndo || disabled,
        "aria-label": labelUndo,
        title: (0, _react2.jsx)(_keymaps.ToolTipContent, {
          description: labelUndo,
          keymap: _keymaps.undo
        }),
        iconBefore: (0, _react2.jsx)(_undo.default, {
          label: ""
        }),
        testId: "ak-editor-toolbar-button-undo"
      }), (0, _react2.jsx)(_ToolbarButton.default, {
        spacing: isReducedSpacing ? 'none' : 'default',
        buttonId: _ToolbarButton.TOOLBAR_BUTTON.REDO,
        onClick: handleRedo,
        disabled: !canRedo || disabled,
        title: (0, _react2.jsx)(_keymaps.ToolTipContent, {
          description: labelRedo,
          keymap: _keymaps.redo
        }),
        iconBefore: (0, _react2.jsx)(_redo.default, {
          label: ""
        }),
        testId: "ak-editor-toolbar-button-redo",
        "aria-label": labelRedo
      }), (0, _react2.jsx)("span", {
        css: _styles.separatorStyles
      }));
    }
  }]);
  return ToolbarUndoRedo;
}(_react.PureComponent);

exports.ToolbarUndoRedo = ToolbarUndoRedo;

var _default = (0, _reactIntlNext.injectIntl)(ToolbarUndoRedo);

exports.default = _default;
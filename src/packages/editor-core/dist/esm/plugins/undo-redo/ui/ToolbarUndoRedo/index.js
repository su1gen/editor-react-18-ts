import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import UndoIcon from '@atlaskit/icon/glyph/undo';
import RedoIcon from '@atlaskit/icon/glyph/redo';
import { undo as undoKeymap, redo as redoKeymap, ToolTipContent } from '../../../../keymaps';
import { buttonGroupStyle, separatorStyles } from '../../../../ui/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { messages } from '../../messages';
import { createTypeAheadTools } from '../../../type-ahead/api';
import { undoFromToolbar, redoFromToolbar } from '../../commands';

var closeTypeAheadAndRunCommand = function closeTypeAheadAndRunCommand(editorView) {
  return function (command) {
    if (!editorView) {
      return;
    }

    var tool = createTypeAheadTools(editorView);

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

export var ToolbarUndoRedo = /*#__PURE__*/function (_PureComponent) {
  _inherits(ToolbarUndoRedo, _PureComponent);

  var _super = _createSuper(ToolbarUndoRedo);

  function ToolbarUndoRedo() {
    _classCallCheck(this, ToolbarUndoRedo);

    return _super.apply(this, arguments);
  }

  _createClass(ToolbarUndoRedo, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          disabled = _this$props.disabled,
          isReducedSpacing = _this$props.isReducedSpacing,
          historyState = _this$props.historyState,
          editorView = _this$props.editorView,
          formatMessage = _this$props.intl.formatMessage;

      var handleUndo = function handleUndo() {
        forceFocus(editorView)(undoFromToolbar);
      };

      var handleRedo = function handleRedo() {
        forceFocus(editorView)(redoFromToolbar);
      };

      var labelUndo = formatMessage(messages.undo);
      var labelRedo = formatMessage(messages.redo);
      var canUndo = historyState.canUndo,
          canRedo = historyState.canRedo;
      return jsx("span", {
        css: buttonGroupStyle
      }, jsx(ToolbarButton, {
        buttonId: TOOLBAR_BUTTON.UNDO,
        spacing: isReducedSpacing ? 'none' : 'default',
        onClick: handleUndo,
        disabled: !canUndo || disabled,
        "aria-label": labelUndo,
        title: jsx(ToolTipContent, {
          description: labelUndo,
          keymap: undoKeymap
        }),
        iconBefore: jsx(UndoIcon, {
          label: ""
        }),
        testId: "ak-editor-toolbar-button-undo"
      }), jsx(ToolbarButton, {
        spacing: isReducedSpacing ? 'none' : 'default',
        buttonId: TOOLBAR_BUTTON.REDO,
        onClick: handleRedo,
        disabled: !canRedo || disabled,
        title: jsx(ToolTipContent, {
          description: labelRedo,
          keymap: redoKeymap
        }),
        iconBefore: jsx(RedoIcon, {
          label: ""
        }),
        testId: "ak-editor-toolbar-button-redo",
        "aria-label": labelRedo
      }), jsx("span", {
        css: separatorStyles
      }));
    }
  }]);

  return ToolbarUndoRedo;
}(PureComponent);
export default injectIntl(ToolbarUndoRedo);
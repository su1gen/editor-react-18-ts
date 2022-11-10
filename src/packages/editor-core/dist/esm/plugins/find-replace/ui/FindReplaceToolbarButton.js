import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { defineMessages, injectIntl } from 'react-intl-next';
import EditorSearchIcon from '@atlaskit/icon/glyph/editor/search';
import { akEditorFloatingPanelZIndex, akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../ui/ToolbarButton';
import Dropdown from '../../../ui/Dropdown';
import FindReplace from './FindReplace';
import { TRIGGER_METHOD } from '../../analytics/types';
import { ToolTipContent, findKeymapByDescription } from '../../../keymaps';
var toolbarButtonWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex: 1 1 auto;\n  flex-grow: 0;\n  justify-content: flex-end;\n  align-items: center;\n  padding: 0 8px;\n  @media (max-width: ", "px) {\n    justify-content: center;\n    padding: 0;\n  }\n"])), akEditorMobileMaxWidth);
var toolbarButtonWrapperFullWith = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex-grow: 1;\n"])));
var wrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n"])));
var messages = defineMessages({
  findReplaceToolbarButton: {
    id: 'fabric.editor.findReplaceToolbarButton',
    defaultMessage: 'Find and replace',
    description: '"Find" highlights all instances of a word or phrase on the document, and "Replace" changes one or all of those instances to something else'
  }
});

var FindReplaceToolbarButton = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FindReplaceToolbarButton, _React$PureComponent);

  var _super = _createSuper(FindReplaceToolbarButton);

  function FindReplaceToolbarButton() {
    var _this;

    _classCallCheck(this, FindReplaceToolbarButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "toggleOpen", function () {
      if (_this.props.isActive) {
        _this.props.onCancel({
          triggerMethod: TRIGGER_METHOD.TOOLBAR
        });
      } else {
        _this.props.onActivate();
      }
    });

    return _this;
  }

  _createClass(FindReplaceToolbarButton, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isReducedSpacing = _this$props.isReducedSpacing,
          findText = _this$props.findText,
          replaceText = _this$props.replaceText,
          isActive = _this$props.isActive,
          index = _this$props.index,
          numMatches = _this$props.numMatches,
          formatMessage = _this$props.intl.formatMessage,
          takeFullWidth = _this$props.takeFullWidth;
      var title = formatMessage(messages.findReplaceToolbarButton);
      var stackBelowOtherEditorFloatingPanels = akEditorFloatingPanelZIndex - 1;
      return jsx("div", {
        css: [toolbarButtonWrapper, takeFullWidth && toolbarButtonWrapperFullWith]
      }, jsx(Dropdown, {
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        isOpen: isActive,
        handleEscapeKeydown: function handleEscapeKeydown() {
          if (isActive) {
            _this2.props.onCancel({
              triggerMethod: TRIGGER_METHOD.KEYBOARD
            });
          }
        },
        fitWidth: 352,
        zIndex: stackBelowOtherEditorFloatingPanels,
        trigger: jsx(ToolbarButton, {
          buttonId: TOOLBAR_BUTTON.FIND_REPLACE,
          spacing: isReducedSpacing ? 'none' : 'default',
          selected: isActive,
          title: jsx(ToolTipContent, {
            description: title,
            keymap: findKeymapByDescription('Find')
          }),
          iconBefore: jsx(EditorSearchIcon, {
            label: title
          }),
          onClick: this.toggleOpen,
          "aria-expanded": isActive,
          "aria-haspopup": true
        })
      }, jsx("div", {
        css: wrapper
      }, jsx(FindReplace, _extends({
        findText: findText,
        replaceText: replaceText,
        count: {
          index: index,
          total: numMatches
        }
      }, this.props)))));
    }
  }]);

  return FindReplaceToolbarButton;
}(React.PureComponent);

export default injectIntl(FindReplaceToolbarButton);
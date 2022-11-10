import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import DropdownMenu from '../../../../ui/DropdownMenu';
import { separatorStyles, wrapperStyle } from '../../../../ui/styles';
import { NORMAL_TEXT } from '../../types';
import { blockTypeMenuItemStyle, keyboardShortcut, keyboardShortcutSelect } from './styled';
import { tooltip, findKeymapByDescription } from '../../../../keymaps';
import { BlockTypeButton } from './blocktype-button';

var ToolbarBlockType = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ToolbarBlockType, _React$PureComponent);

  var _super = _createSuper(ToolbarBlockType);

  function ToolbarBlockType() {
    var _this;

    _classCallCheck(this, ToolbarBlockType);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      active: false
    });

    _defineProperty(_assertThisInitialized(_this), "onOpenChange", function (attrs) {
      _this.setState({
        active: attrs.isOpen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleTriggerClick", function () {
      _this.onOpenChange({
        isOpen: !_this.state.active
      });
    });

    _defineProperty(_assertThisInitialized(_this), "createItems", function () {
      var formatMessage = _this.props.intl.formatMessage;
      var _this$props$pluginSta = _this.props.pluginState,
          currentBlockType = _this$props$pluginSta.currentBlockType,
          availableBlockTypes = _this$props$pluginSta.availableBlockTypes;
      var items = availableBlockTypes.map(function (blockType, index) {
        var isActive = currentBlockType === blockType;
        var tagName = blockType.tagName || 'p';
        var Tag = tagName;
        return {
          content: jsx("div", {
            css: blockTypeMenuItemStyle(tagName, isActive)
          }, jsx(Tag, null, formatMessage(blockType.title))),
          value: blockType,
          label: formatMessage(blockType.title),
          key: "".concat(blockType.name, "-").concat(index),
          elemAfter: jsx("div", {
            css: [keyboardShortcut, isActive && keyboardShortcutSelect]
          }, tooltip(findKeymapByDescription(blockType.title.defaultMessage))),
          isActive: isActive
        };
      });
      return [{
        items: items
      }];
    });

    _defineProperty(_assertThisInitialized(_this), "handleSelectBlockType", function (_ref) {
      var item = _ref.item;
      var blockType = item.value;

      _this.props.setBlockType(blockType.name);

      _this.setState({
        active: false
      });
    });

    return _this;
  }

  _createClass(ToolbarBlockType, [{
    key: "render",
    value: function render() {
      var active = this.state.active;
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isSmall = _this$props.isSmall,
          isReducedSpacing = _this$props.isReducedSpacing,
          _this$props$pluginSta2 = _this$props.pluginState,
          currentBlockType = _this$props$pluginSta2.currentBlockType,
          blockTypesDisabled = _this$props$pluginSta2.blockTypesDisabled,
          availableBlockTypes = _this$props$pluginSta2.availableBlockTypes,
          formatMessage = _this$props.intl.formatMessage;
      var isHeadingDisabled = !availableBlockTypes.some(function (blockType) {
        return blockType.nodeName === 'heading';
      });

      if (isHeadingDisabled) {
        return null;
      }

      var blockTypeTitles = availableBlockTypes.filter(function (blockType) {
        return blockType.name === currentBlockType.name;
      }).map(function (blockType) {
        return blockType.title;
      });
      var longestDropdownMenuItem = [NORMAL_TEXT].concat(_toConsumableArray(availableBlockTypes)).reduce(function (longest, item) {
        var itemTitle = formatMessage(item.title);
        return itemTitle.length >= longest.length ? itemTitle : longest;
      }, '');

      if (!this.props.isDisabled && !blockTypesDisabled) {
        var items = this.createItems();
        return jsx("span", {
          css: wrapperStyle
        }, jsx(DropdownMenu, {
          items: items,
          onOpenChange: this.onOpenChange,
          onItemActivated: this.handleSelectBlockType,
          isOpen: active,
          mountTo: popupsMountPoint,
          boundariesElement: popupsBoundariesElement,
          scrollableElement: popupsScrollableElement,
          zIndex: akEditorMenuZIndex,
          fitHeight: 360,
          fitWidth: 106,
          shouldUseDefaultRole: true
        }, jsx(BlockTypeButton, {
          isSmall: isSmall,
          isReducedSpacing: isReducedSpacing,
          selected: active,
          disabled: false,
          title: blockTypeTitles[0],
          onClick: this.handleTriggerClick,
          formatMessage: formatMessage,
          "aria-expanded": active
        }, longestDropdownMenuItem)), jsx("span", {
          css: separatorStyles
        }));
      }

      return jsx("span", {
        css: wrapperStyle
      }, jsx(BlockTypeButton, {
        isSmall: isSmall,
        isReducedSpacing: isReducedSpacing,
        selected: active,
        disabled: true,
        title: blockTypeTitles[0],
        onClick: this.handleTriggerClick,
        formatMessage: formatMessage,
        "aria-expanded": active
      }, longestDropdownMenuItem), jsx("span", {
        css: separatorStyles
      }));
    }
  }]);

  return ToolbarBlockType;
}(React.PureComponent);

export default injectIntl(ToolbarBlockType);
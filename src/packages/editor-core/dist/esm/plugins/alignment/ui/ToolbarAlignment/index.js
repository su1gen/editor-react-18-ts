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
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ToolbarButton from '../../../../ui/ToolbarButton';
import Dropdown from '../../../../ui/Dropdown';
import Alignment from '../../../../ui/Alignment';
import { expandIconWrapper, separator, triggerWrapper, wrapper } from './styles';
import { IconMap } from './icon-map';
import { messages } from './messages';
export var AlignmentToolbar = /*#__PURE__*/function (_React$Component) {
  _inherits(AlignmentToolbar, _React$Component);

  var _super = _createSuper(AlignmentToolbar);

  function AlignmentToolbar() {
    var _this;

    _classCallCheck(this, AlignmentToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isOpen: false
    });

    _defineProperty(_assertThisInitialized(_this), "changeAlignment", function (align) {
      _this.toggleOpen();

      return _this.props.changeAlignment(align);
    });

    _defineProperty(_assertThisInitialized(_this), "toggleOpen", function () {
      _this.handleOpenChange({
        isOpen: !_this.state.isOpen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleOpenChange", function (_ref) {
      var isOpen = _ref.isOpen;

      _this.setState({
        isOpen: isOpen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "hide", function () {
      if (_this.state.isOpen) {
        _this.setState({
          isOpen: false
        });
      }
    });

    return _this;
  }

  _createClass(AlignmentToolbar, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var isOpen = this.state.isOpen;
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isReducedSpacing = _this$props.isReducedSpacing,
          pluginState = _this$props.pluginState,
          disabled = _this$props.disabled,
          intl = _this$props.intl;
      var title = intl.formatMessage(messages.alignment);
      return jsx("span", {
        css: wrapper
      }, jsx(Dropdown, {
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        isOpen: isOpen,
        handleClickOutside: this.hide,
        handleEscapeKeydown: this.hide,
        fitWidth: 112,
        fitHeight: 80,
        trigger: jsx(ToolbarButton, {
          spacing: isReducedSpacing ? 'none' : 'default',
          disabled: disabled,
          selected: isOpen,
          title: title,
          className: "align-btn",
          "aria-label": title,
          "aria-expanded": isOpen,
          "aria-haspopup": true,
          onClick: this.toggleOpen,
          iconBefore: jsx("div", {
            css: triggerWrapper
          }, jsx(IconMap, {
            alignment: pluginState.align
          }), jsx("span", {
            css: expandIconWrapper
          }, jsx(ExpandIcon, {
            label: ""
          })))
        })
      }, jsx(Alignment, {
        onClick: function onClick(align) {
          return _this2.changeAlignment(align);
        },
        selectedAlignment: pluginState.align
      })), jsx("span", {
        css: separator
      }));
    }
  }]);

  return AlignmentToolbar;
}(React.Component);

_defineProperty(AlignmentToolbar, "displayName", 'AlignmentToolbar');

export default injectIntl(AlignmentToolbar);
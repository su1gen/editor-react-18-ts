import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React, { Component } from 'react';
import { css, jsx } from '@emotion/react';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import UiDropdown from '../../../ui/Dropdown';
import Button from './Button';
import DropdownMenu, { itemSpacing, menuItemDimensions } from './DropdownMenu';
var dropdownExpandContainer = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  margin: 0px -4px;\n"])));
var iconGroup = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n"])));

var CompositeIcon = function CompositeIcon(_ref) {
  var icon = _ref.icon;
  return jsx("div", {
    css: iconGroup
  }, icon, jsx("span", {
    css: dropdownExpandContainer
  }, jsx(ExpandIcon, {
    label: "Expand dropdown menu"
  })));
};

var Dropdown = /*#__PURE__*/function (_Component) {
  _inherits(Dropdown, _Component);

  var _super = _createSuper(Dropdown);

  function Dropdown() {
    var _this;

    _classCallCheck(this, Dropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isOpen: false
    });

    _defineProperty(_assertThisInitialized(_this), "renderArrayOptions", function (options) {
      var _this$props = _this.props,
          showSelected = _this$props.showSelected,
          dispatchCommand = _this$props.dispatchCommand;
      return jsx(DropdownMenu, {
        hide: _this.hide,
        dispatchCommand: dispatchCommand,
        items: options,
        showSelected: showSelected
      });
    });

    _defineProperty(_assertThisInitialized(_this), "toggleOpen", function () {
      _this.setState({
        isOpen: !_this.state.isOpen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "hide", function () {
      _this.setState({
        isOpen: false
      });
    });

    return _this;
  }

  _createClass(Dropdown, [{
    key: "render",
    value: function render() {
      var isOpen = this.state.isOpen;
      var _this$props2 = this.props,
          title = _this$props2.title,
          icon = _this$props2.icon,
          options = _this$props2.options,
          dispatchCommand = _this$props2.dispatchCommand,
          mountPoint = _this$props2.mountPoint,
          boundariesElement = _this$props2.boundariesElement,
          scrollableElement = _this$props2.scrollableElement,
          hideExpandIcon = _this$props2.hideExpandIcon,
          disabled = _this$props2.disabled,
          tooltip = _this$props2.tooltip,
          buttonTestId = _this$props2.buttonTestId,
          dropdownWidth = _this$props2.dropdownWidth;
      var trigger;

      if (icon) {
        var TriggerIcon = hideExpandIcon ? icon : jsx(CompositeIcon, {
          icon: icon
        });
        trigger = jsx(Button, {
          testId: buttonTestId,
          title: title,
          icon: TriggerIcon,
          onClick: this.toggleOpen,
          selected: isOpen,
          disabled: disabled,
          tooltipContent: tooltip
        });
      } else {
        trigger = jsx(Button, {
          testId: buttonTestId,
          iconAfter: jsx("span", {
            css: dropdownExpandContainer
          }, jsx(ExpandIcon, {
            label: "Expand dropdown menu"
          })),
          onClick: this.toggleOpen,
          selected: isOpen,
          disabled: disabled,
          tooltipContent: tooltip
        }, title);
      }
      /**
       * We want to change direction of our dropdowns a bit early,
       * not exactly when it hits the boundary.
       */


      var fitTolerance = 10;
      var fitWidth = Array.isArray(options) ? dropdownWidth || menuItemDimensions.width : options.width;
      var fitHeight = Array.isArray(options) ? options.length * menuItemDimensions.height + itemSpacing * 2 : options.height;
      return jsx(UiDropdown, {
        mountTo: mountPoint,
        boundariesElement: boundariesElement,
        scrollableElement: scrollableElement,
        isOpen: isOpen,
        handleClickOutside: this.hide,
        handleEscapeKeydown: this.hide,
        fitWidth: fitWidth + fitTolerance,
        fitHeight: fitHeight + fitTolerance,
        trigger: trigger
      }, Array.isArray(options) ? this.renderArrayOptions(options) : options.render({
        hide: this.hide,
        dispatchCommand: dispatchCommand
      }));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.setDisableParentScroll && prevState.isOpen !== this.state.isOpen) {
        this.props.setDisableParentScroll(this.state.isOpen);
      }
    }
  }]);

  return Dropdown;
}(Component);

export { Dropdown as default };
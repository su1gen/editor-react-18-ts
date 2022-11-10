import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
var _excluded = ["buttonStyles"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx } from '@emotion/react';
import Button from '@atlaskit/button/custom-theme-button';
import { expandMessages, expandLayoutWrapperStyle, ExpandLayoutWrapperWithRef } from '@atlaskit/editor-common/ui';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import Tooltip from '@atlaskit/tooltip';
import { expandClassNames } from './class-names';
export var withTooltip = function withTooltip(WrapperComponent) {
  return /*#__PURE__*/function (_React$Component) {
    _inherits(WithSortableColumn, _React$Component);

    var _super = _createSuper(WithSortableColumn);

    function WithSortableColumn(props) {
      _classCallCheck(this, WithSortableColumn);

      return _super.call(this, props);
    }

    _createClass(WithSortableColumn, [{
      key: "render",
      value: function render() {
        var label = this.props.label;
        return jsx(Tooltip, {
          content: label,
          position: "top",
          tag: ExpandLayoutWrapperWithRef
        }, jsx(WrapperComponent, this.props));
      }
    }]);

    return WithSortableColumn;
  }(React.Component);
};
export var CustomButton = function CustomButton(props) {
  var label = props.label,
      allowInteractiveExpand = props.allowInteractiveExpand;
  var useTheme = useCallback(function (currentTheme, themeProps) {
    var _currentTheme = currentTheme(themeProps),
        buttonStyles = _currentTheme.buttonStyles,
        rest = _objectWithoutProperties(_currentTheme, _excluded);

    return _objectSpread({
      buttonStyles: _objectSpread(_objectSpread({}, buttonStyles), {}, {
        height: '100%',
        '& svg': {
          transform: props.expanded ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);',
          transition: "transform 0.2s ".concat(akEditorSwoopCubicBezier, ";")
        }
      })
    }, rest);
  }, [props]);
  return jsx(Button, {
    appearance: "subtle",
    className: expandClassNames.iconContainer,
    iconBefore: jsx(ChevronRightIcon, {
      label: label
    }),
    shouldFitContainer: true,
    theme: useTheme,
    isDisabled: !allowInteractiveExpand
  });
};
var ButtonWithTooltip = withTooltip(CustomButton);
var ButtonWithoutTooltip = CustomButton;
export var ExpandIconButton = function ExpandIconButton(props) {
  var expanded = props.expanded,
      intl = props.intl;
  var message = expanded ? expandMessages.collapseNode : expandMessages.expandNode;
  var label = intl && intl.formatMessage(message) || message.defaultMessage; // check to ensure device supports any-hover

  var supportsAnyHover = !!window.matchMedia ? window.matchMedia('(any-hover: hover)').matches !== window.matchMedia('(any-hover: none)').matches : false;
  var hoverEventCheck = supportsAnyHover ? window.matchMedia('(any-hover: hover)').matches : true; // hoverEventCheck is to disable tooltips for mobile to prevent incorrect hover state causing issues on iOS

  if (props.allowInteractiveExpand && hoverEventCheck) {
    return jsx(ButtonWithTooltip, _extends({
      label: label
    }, props));
  }

  return jsx("div", {
    css: expandLayoutWrapperStyle
  }, jsx(ButtonWithoutTooltip, _extends({
    label: label
  }, props)));
};
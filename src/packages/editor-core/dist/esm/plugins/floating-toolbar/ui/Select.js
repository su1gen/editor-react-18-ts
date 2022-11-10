import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React, { useRef } from 'react';
import Select from '@atlaskit/select';
export default function Search(props) {
  var selectRef = useRef(null);
  var _props$width = props.width,
      width = _props$width === void 0 ? 200 : _props$width;
  var style = React.useMemo(function () {
    return {
      container: function container(base) {
        return _objectSpread(_objectSpread({}, base), {}, {
          width: width
        });
      },
      menuPortal: function menuPortal(base) {
        var _selectRef$current;

        var controlWrapper = selectRef === null || selectRef === void 0 ? void 0 : (_selectRef$current = selectRef.current) === null || _selectRef$current === void 0 ? void 0 : _selectRef$current.select.select.controlRef.parentNode;
        var menuPortalStyles = controlWrapper && props.setDisableParentScroll ? {
          // since the portal is now outside, we need to position it as before
          top: controlWrapper.offsetTop,
          left: controlWrapper.offsetLeft,
          height: controlWrapper.offsetHeight,
          width: width
        } : {};
        return _objectSpread(_objectSpread({}, base), menuPortalStyles);
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [width]);

  var onMenuOpen = function onMenuOpen() {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(true);
    }
  };

  var onMenuClose = function onMenuClose() {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(false);
    }
  };

  return /*#__PURE__*/React.createElement(Select, {
    ref: selectRef,
    options: props.options,
    value: props.defaultValue,
    onChange: props.onChange,
    placeholder: props.placeholder,
    spacing: "compact",
    menuPlacement: "auto",
    filterOption: props.filterOption,
    styles: style,
    menuPortalTarget: props.mountPoint,
    onMenuOpen: onMenuOpen,
    onMenuClose: onMenuClose
  });
}
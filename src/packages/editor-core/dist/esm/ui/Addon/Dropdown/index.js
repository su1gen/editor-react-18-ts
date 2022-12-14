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
import { dropdown } from './styles';

var DropdownWrapper = /*#__PURE__*/function (_React$Component) {
  _inherits(DropdownWrapper, _React$Component);

  var _super = _createSuper(DropdownWrapper);

  function DropdownWrapper() {
    var _this;

    _classCallCheck(this, DropdownWrapper);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (actions) {
      var actionOnClick = actions.actionOnClick,
          renderOnClick = actions.renderOnClick;
      var editorActions = _this.props.editorActions;

      if (actionOnClick) {
        actionOnClick(editorActions);

        _this.props.togglePopup();
      } else if (renderOnClick) {
        _this.props.onClick(editorActions, renderOnClick);
      }
    });

    return _this;
  }

  _createClass(DropdownWrapper, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      // adding onClick handler to each DropdownItem component
      var children = React.Children.map(this.props.children, function (child) {
        return /*#__PURE__*/React.cloneElement(child, {
          onClick: _this2.handleClick
        });
      });
      return jsx("div", {
        css: dropdown
      }, children);
    }
  }]);

  return DropdownWrapper;
}(React.Component);

export { DropdownWrapper as default };
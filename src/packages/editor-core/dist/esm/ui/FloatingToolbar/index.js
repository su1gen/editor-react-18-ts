import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { Popup } from '@atlaskit/editor-common/ui';
import { container } from './styles';
export { handlePositionCalculatedWith, getOffsetParent, getNearestNonTextNode } from './utils';

var FloatingToolbar = /*#__PURE__*/function (_PureComponent) {
  _inherits(FloatingToolbar, _PureComponent);

  var _super = _createSuper(FloatingToolbar);

  function FloatingToolbar() {
    _classCallCheck(this, FloatingToolbar);

    return _super.apply(this, arguments);
  }

  _createClass(FloatingToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          target = _this$props.target,
          offset = _this$props.offset,
          fitWidth = _this$props.fitWidth,
          _this$props$fitHeight = _this$props.fitHeight,
          fitHeight = _this$props$fitHeight === void 0 ? 40 : _this$props$fitHeight,
          onPositionCalculated = _this$props.onPositionCalculated,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          className = _this$props.className,
          alignX = _this$props.alignX,
          alignY = _this$props.alignY,
          zIndex = _this$props.zIndex;

      if (!target) {
        return null;
      }

      return jsx(Popup, {
        alignX: alignX,
        alignY: alignY,
        target: target,
        zIndex: zIndex,
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        offset: offset,
        fitWidth: fitWidth,
        fitHeight: fitHeight,
        onPositionCalculated: onPositionCalculated
      }, jsx("div", {
        css: container(fitHeight),
        "data-testid": "popup-container",
        className: className
      }, children));
    }
  }]);

  return FloatingToolbar;
}(PureComponent);

export { FloatingToolbar as default };
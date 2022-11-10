import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
export var AnnotationViewWrapper = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(AnnotationViewWrapper, _React$PureComponent);

  var _super = _createSuper(AnnotationViewWrapper);

  function AnnotationViewWrapper() {
    _classCallCheck(this, AnnotationViewWrapper);

    return _super.apply(this, arguments);
  }

  _createClass(AnnotationViewWrapper, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var onViewed = this.props.onViewed;

      if (onViewed) {
        onViewed();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return AnnotationViewWrapper;
}(React.PureComponent);
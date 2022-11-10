import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { EventEmitter } from 'events';
export var AnnotationUpdateEmitter = /*#__PURE__*/function (_EventEmitter) {
  _inherits(AnnotationUpdateEmitter, _EventEmitter);

  var _super = _createSuper(AnnotationUpdateEmitter);

  function AnnotationUpdateEmitter() {
    _classCallCheck(this, AnnotationUpdateEmitter);

    return _super.apply(this, arguments);
  }

  _createClass(AnnotationUpdateEmitter, [{
    key: "on",
    value: function on(event, listener) {
      return _get(_getPrototypeOf(AnnotationUpdateEmitter.prototype), "on", this).call(this, event, listener);
    }
  }]);

  return AnnotationUpdateEmitter;
}(EventEmitter);
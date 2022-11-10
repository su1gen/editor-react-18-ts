"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnnotationUpdateEmitter = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _events = require("events");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AnnotationUpdateEmitter = /*#__PURE__*/function (_EventEmitter) {
  (0, _inherits2.default)(AnnotationUpdateEmitter, _EventEmitter);

  var _super = _createSuper(AnnotationUpdateEmitter);

  function AnnotationUpdateEmitter() {
    (0, _classCallCheck2.default)(this, AnnotationUpdateEmitter);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(AnnotationUpdateEmitter, [{
    key: "on",
    value: function on(event, listener) {
      return (0, _get2.default)((0, _getPrototypeOf2.default)(AnnotationUpdateEmitter.prototype), "on", this).call(this, event, listener);
    }
  }]);
  return AnnotationUpdateEmitter;
}(_events.EventEmitter);

exports.AnnotationUpdateEmitter = AnnotationUpdateEmitter;
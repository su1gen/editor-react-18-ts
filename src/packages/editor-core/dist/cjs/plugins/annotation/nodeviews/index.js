"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationViewClassname = exports.AnnotationNodeView = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _styles = require("@atlaskit/editor-common/styles");

var _nodeviews = require("../../../nodeviews");

var _WithPluginState = _interopRequireDefault(require("../../../ui/WithPluginState"));

var _utils = require("../utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var AnnotationNodeView = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(AnnotationNodeView, _ReactNodeView);

  var _super = _createSuper(AnnotationNodeView);

  function AnnotationNodeView() {
    (0, _classCallCheck2.default)(this, AnnotationNodeView);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(AnnotationNodeView, [{
    key: "createDomRef",
    value: function createDomRef() {
      return document.createElement('span');
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('span');
      dom.className = 'ak-editor-annotation';
      return {
        dom: dom
      };
    }
  }, {
    key: "render",
    value: function render(_props, forwardRef) {
      var _this = this;

      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          inlineCommentState: _utils.inlineCommentPluginKey
        },
        editorView: this.view,
        render: function render(_ref) {
          var inlineCommentState = _ref.inlineCommentState;

          if (!(inlineCommentState !== null && inlineCommentState !== void 0 && inlineCommentState.isVisible)) {
            return /*#__PURE__*/_react.default.createElement("span", {
              ref: forwardRef
            });
          } // Check if selection includes current annotation ID


          var annotations = inlineCommentState.annotations,
              selectedAnnotations = inlineCommentState.selectedAnnotations;
          var id = _this.node.attrs.id;
          var isUnresolved = annotations[id] === false;
          var annotationHasFocus = selectedAnnotations.some(function (x) {
            return x.id === id;
          });
          var className = getAnnotationViewClassname(isUnresolved, annotationHasFocus);
          return /*#__PURE__*/_react.default.createElement("span", {
            className: className,
            ref: forwardRef
          });
        }
      });
    }
  }]);
  return AnnotationNodeView;
}(_nodeviews.ReactNodeView);

exports.AnnotationNodeView = AnnotationNodeView;

var getAnnotationViewClassname = function getAnnotationViewClassname(isUnresolved, hasFocus) {
  if (!isUnresolved) {
    return;
  }

  return hasFocus ? _styles.AnnotationSharedClassNames.focus : _styles.AnnotationSharedClassNames.blur;
};

exports.getAnnotationViewClassname = getAnnotationViewClassname;
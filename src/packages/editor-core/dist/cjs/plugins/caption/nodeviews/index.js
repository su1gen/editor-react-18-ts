"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CaptionNodeView = void 0;
exports.default = captionNodeView;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _ui = require("@atlaskit/editor-common/ui");

var _nodeviews = require("../../../nodeviews/");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var CaptionNodeView = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  (0, _inherits2.default)(CaptionNodeView, _SelectionBasedNodeVi);

  var _super = _createSuper(CaptionNodeView);

  function CaptionNodeView() {
    var _this;

    (0, _classCallCheck2.default)(this, CaptionNodeView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "selected", _this.insideSelection());
    return _this;
  }

  (0, _createClass2.default)(CaptionNodeView, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('figcaption');
      domRef.setAttribute('data-caption', 'true');
      return domRef;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('div');
      return {
        dom: dom
      };
    }
  }, {
    key: "render",
    value: function render(_props, forwardRef) {
      return /*#__PURE__*/_react.default.createElement(_ui.Caption, {
        selected: this.insideSelection(),
        hasContent: this.node.content.childCount > 0
      }, /*#__PURE__*/_react.default.createElement("div", {
        ref: forwardRef
      }));
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.node.childCount !== nextNode.childCount) {
        return true;
      }

      var newSelected = this.insideSelection();
      var selectedStateChange = this.selected !== newSelected;
      this.selected = newSelected;
      return selectedStateChange;
    }
  }]);
  return CaptionNodeView;
}(_nodeviews.SelectionBasedNodeView);

exports.CaptionNodeView = CaptionNodeView;

function captionNodeView(portalProviderAPI, eventDispatcher) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new CaptionNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {}, undefined, undefined, undefined, hasIntlContext).init();
  };
}
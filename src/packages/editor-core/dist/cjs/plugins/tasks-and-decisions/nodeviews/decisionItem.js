"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decisionItemNodeView = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _nodeviews = require("../../../nodeviews");

var _Decision = _interopRequireDefault(require("../ui/Decision"));

var _utils = require("../../type-ahead/utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Decision = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(Decision, _ReactNodeView);

  var _super = _createSuper(Decision);

  function Decision() {
    (0, _classCallCheck2.default)(this, Decision);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Decision, [{
    key: "isContentEmpty",
    value: function isContentEmpty(node) {
      return node.content.childCount === 0;
    }
  }, {
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('li');
      domRef.style['list-style-type'] = 'none';
      return domRef;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('div'); // setting a className prevents PM/Chrome mutation observer from
      // incorrectly deleting nodes

      dom.className = 'decision-item';
      return {
        dom: dom
      };
    }
  }, {
    key: "render",
    value: function render(_props, forwardRef) {
      return /*#__PURE__*/_react.default.createElement(_Decision.default, {
        contentRef: forwardRef,
        showPlaceholder: this.isContentEmpty(this.node) && !(0, _utils.isTypeAheadOpen)(this.view.state)
      });
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      /**
       * To ensure the placeholder is correctly toggled we need to allow react to re-render
       * on first character insertion.
       * Note: last character deletion is handled externally and automatically re-renders.
       */
      return this.isContentEmpty(this.node) && !!nextNode.content.childCount;
    }
  }, {
    key: "update",
    value: function update(node, decorations) {
      var _this = this;

      return (0, _get2.default)((0, _getPrototypeOf2.default)(Decision.prototype), "update", this).call(this, node, decorations, undefined, // Toggle the placeholder based on whether user input exists.
      function (_currentNode, _newNode) {
        return !_this.isContentEmpty(_newNode);
      });
    }
  }]);
  return Decision;
}(_nodeviews.ReactNodeView);

var decisionItemNodeView = function decisionItemNodeView(portalProviderAPI, eventDispatcher) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new Decision(node, view, getPos, portalProviderAPI, eventDispatcher, {}, undefined, undefined, undefined, hasIntlContext).init();
  };
};

exports.decisionItemNodeView = decisionItemNodeView;
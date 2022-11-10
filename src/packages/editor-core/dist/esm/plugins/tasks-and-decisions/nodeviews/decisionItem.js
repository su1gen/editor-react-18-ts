import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { ReactNodeView } from '../../../nodeviews';
import DecisionItem from '../ui/Decision';
import { isTypeAheadOpen } from '../../type-ahead/utils';

var Decision = /*#__PURE__*/function (_ReactNodeView) {
  _inherits(Decision, _ReactNodeView);

  var _super = _createSuper(Decision);

  function Decision() {
    _classCallCheck(this, Decision);

    return _super.apply(this, arguments);
  }

  _createClass(Decision, [{
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
      return /*#__PURE__*/React.createElement(DecisionItem, {
        contentRef: forwardRef,
        showPlaceholder: this.isContentEmpty(this.node) && !isTypeAheadOpen(this.view.state)
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

      return _get(_getPrototypeOf(Decision.prototype), "update", this).call(this, node, decorations, undefined, // Toggle the placeholder based on whether user input exists.
      function (_currentNode, _newNode) {
        return !_this.isContentEmpty(_newNode);
      });
    }
  }]);

  return Decision;
}(ReactNodeView);

export var decisionItemNodeView = function decisionItemNodeView(portalProviderAPI, eventDispatcher) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new Decision(node, view, getPos, portalProviderAPI, eventDispatcher, {}, undefined, undefined, undefined, hasIntlContext).init();
  };
};
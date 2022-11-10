import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { Caption } from '@atlaskit/editor-common/ui';
import { SelectionBasedNodeView } from '../../../nodeviews/';
export var CaptionNodeView = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  _inherits(CaptionNodeView, _SelectionBasedNodeVi);

  var _super = _createSuper(CaptionNodeView);

  function CaptionNodeView() {
    var _this;

    _classCallCheck(this, CaptionNodeView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "selected", _this.insideSelection());

    return _this;
  }

  _createClass(CaptionNodeView, [{
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
      return /*#__PURE__*/React.createElement(Caption, {
        selected: this.insideSelection(),
        hasContent: this.node.content.childCount > 0
      }, /*#__PURE__*/React.createElement("div", {
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
}(SelectionBasedNodeView);
export default function captionNodeView(portalProviderAPI, eventDispatcher) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new CaptionNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {}, undefined, undefined, undefined, hasIntlContext).init();
  };
}
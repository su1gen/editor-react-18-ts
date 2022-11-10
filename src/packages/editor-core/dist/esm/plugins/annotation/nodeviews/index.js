import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { AnnotationSharedClassNames } from '@atlaskit/editor-common/styles';
import { ReactNodeView } from '../../../nodeviews';
import WithPluginState from '../../../ui/WithPluginState';
import { inlineCommentPluginKey } from '../utils';
export var AnnotationNodeView = /*#__PURE__*/function (_ReactNodeView) {
  _inherits(AnnotationNodeView, _ReactNodeView);

  var _super = _createSuper(AnnotationNodeView);

  function AnnotationNodeView() {
    _classCallCheck(this, AnnotationNodeView);

    return _super.apply(this, arguments);
  }

  _createClass(AnnotationNodeView, [{
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

      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          inlineCommentState: inlineCommentPluginKey
        },
        editorView: this.view,
        render: function render(_ref) {
          var inlineCommentState = _ref.inlineCommentState;

          if (!(inlineCommentState !== null && inlineCommentState !== void 0 && inlineCommentState.isVisible)) {
            return /*#__PURE__*/React.createElement("span", {
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
          return /*#__PURE__*/React.createElement("span", {
            className: className,
            ref: forwardRef
          });
        }
      });
    }
  }]);

  return AnnotationNodeView;
}(ReactNodeView);
export var getAnnotationViewClassname = function getAnnotationViewClassname(isUnresolved, hasFocus) {
  if (!isUnresolved) {
    return;
  }

  return hasFocus ? AnnotationSharedClassNames.focus : AnnotationSharedClassNames.blur;
};
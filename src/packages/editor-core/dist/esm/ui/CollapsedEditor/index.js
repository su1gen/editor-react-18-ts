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
import Editor from '../../editor';
import EditorWithActions from '../../labs/EditorWithActions';
import ChromeCollapsed from '../ChromeCollapsed';

var CollapsedEditor = /*#__PURE__*/function (_React$Component) {
  _inherits(CollapsedEditor, _React$Component);

  var _super = _createSuper(CollapsedEditor);

  function CollapsedEditor() {
    var _this;

    _classCallCheck(this, CollapsedEditor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleEditorRef", function (editorRef, editorRefCallback) {
      if (editorRefCallback && typeof editorRefCallback === 'function') {
        editorRefCallback(editorRef);
      }

      _this.editorComponent = editorRef;
    });

    return _this;
  }

  _createClass(CollapsedEditor, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (!this.props.isExpanded && nextProps.isExpanded) {
        this.shouldTriggerExpandEvent = true;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.shouldTriggerExpandEvent && this.editorComponent) {
        this.shouldTriggerExpandEvent = false;

        if (this.props.onExpand) {
          this.props.onExpand();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var child = React.Children.only(this.props.children);

      if (child.type !== Editor && child.type !== EditorWithActions) {
        throw new Error('Expected child to be of type `Editor`');
      }

      if (!this.props.isExpanded) {
        return /*#__PURE__*/React.createElement(ChromeCollapsed, {
          onFocus: this.props.onFocus,
          text: this.props.placeholder
        });
      }

      return /*#__PURE__*/React.cloneElement(child, {
        ref: function ref(editorComponent) {
          return _this2.handleEditorRef(editorComponent, child.ref);
        }
      });
    }
  }]);

  return CollapsedEditor;
}(React.Component);

export { CollapsedEditor as default };
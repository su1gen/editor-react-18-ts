import _extends from "@babel/runtime/helpers/extends";
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
import PropTypes from 'prop-types';
import Editor from '../../editor';
import EditorContext from '../../ui/EditorContext';
import WithEditorActions from '../../ui/WithEditorActions';

var EditorWithActions = /*#__PURE__*/function (_React$Component) {
  _inherits(EditorWithActions, _React$Component);

  var _super = _createSuper(EditorWithActions);

  function EditorWithActions() {
    var _this;

    _classCallCheck(this, EditorWithActions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleSave", function (actions) {
      return function () {
        _this.props.onSave(actions);
      };
    });

    _defineProperty(_assertThisInitialized(_this), "handleCancel", function (actions) {
      return function () {
        _this.props.onCancel(actions);
      };
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (actions) {
      return function () {
        _this.props.onChange(actions);
      };
    });

    return _this;
  }

  _createClass(EditorWithActions, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.context.editorActions) {
        var _actions = this.context.editorActions;
        return /*#__PURE__*/React.createElement(Editor, _extends({}, this.props, {
          onSave: this.props.onSave ? this.handleSave(_actions) : undefined,
          onChange: this.props.onChange ? this.handleChange(_actions) : undefined,
          onCancel: this.props.onCancel ? this.handleCancel(_actions) : undefined
        }));
      }

      return /*#__PURE__*/React.createElement(EditorContext, null, /*#__PURE__*/React.createElement(WithEditorActions, {
        render: function render(actions) {
          return /*#__PURE__*/React.createElement(Editor, _extends({}, _this2.props, {
            onSave: _this2.props.onSave ? _this2.handleSave(actions) : undefined,
            onChange: _this2.props.onChange ? _this2.handleChange(actions) : undefined,
            onCancel: _this2.props.onCancel ? _this2.handleCancel(actions) : undefined
          }));
        }
      }));
    }
  }]);

  return EditorWithActions;
}(React.Component);

_defineProperty(EditorWithActions, "contextTypes", {
  editorActions: PropTypes.object.isRequired
});

export { EditorWithActions as default };
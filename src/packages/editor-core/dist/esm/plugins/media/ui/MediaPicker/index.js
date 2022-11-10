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
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';
import { BrowserWrapper } from './BrowserWrapper';
import WithPluginState from '../../../../ui/WithPluginState';
import { focusStateKey } from '../../../../plugins/base/pm-plugins/focus-handler';
export var MediaPickerComponents = /*#__PURE__*/function (_React$Component) {
  _inherits(MediaPickerComponents, _React$Component);

  var _super = _createSuper(MediaPickerComponents);

  function MediaPickerComponents() {
    var _this;

    _classCallCheck(this, MediaPickerComponents);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isPopupOpened: false
    });

    _defineProperty(_assertThisInitialized(_this), "onBrowseFn", function (nativeBrowseFn) {
      var mediaState = _this.props.mediaState;
      mediaState && mediaState.setBrowseFn(nativeBrowseFn);
    });

    return _this;
  }

  _createClass(MediaPickerComponents, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var mediaState = this.props.mediaState;
      mediaState.onPopupToggle(function (isPopupOpened) {
        _this2.setState({
          isPopupOpened: isPopupOpened
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _this$props = this.props,
          mediaState = _this$props.mediaState,
          editorDomElement = _this$props.editorDomElement,
          appearance = _this$props.appearance;
      var isPopupOpened = this.state.isPopupOpened;
      var featureFlags = mediaState.mediaOptions && mediaState.mediaOptions.featureFlags;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          focus: focusStateKey
        },
        render: function render(_ref) {
          var focus = _ref.focus;
          var clipboard = focus ? /*#__PURE__*/React.createElement(ClipboardWrapper, {
            mediaState: mediaState,
            featureFlags: featureFlags
          }) : null;
          return /*#__PURE__*/React.createElement(React.Fragment, null, clipboard, /*#__PURE__*/React.createElement(DropzoneWrapper, {
            mediaState: mediaState,
            isActive: !isPopupOpened,
            featureFlags: featureFlags,
            editorDomElement: editorDomElement,
            appearance: appearance
          }), /*#__PURE__*/React.createElement(BrowserWrapper, {
            onBrowseFn: _this3.onBrowseFn,
            mediaState: mediaState,
            featureFlags: featureFlags
          }));
        }
      });
    }
  }]);

  return MediaPickerComponents;
}(React.Component);

_defineProperty(MediaPickerComponents, "displayName", 'MediaPickerComponents');
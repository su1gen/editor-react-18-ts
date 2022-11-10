"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _chevronDown = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-down"));

var _Dropdown = _interopRequireDefault(require("../../../ui/Dropdown"));

var _Button = _interopRequireDefault(require("./Button"));

var _DropdownMenu = _interopRequireWildcard(require("./DropdownMenu"));

var _templateObject, _templateObject2;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var dropdownExpandContainer = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0px -4px;\n"])));
var iconGroup = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n"])));

var CompositeIcon = function CompositeIcon(_ref) {
  var icon = _ref.icon;
  return (0, _react2.jsx)("div", {
    css: iconGroup
  }, icon, (0, _react2.jsx)("span", {
    css: dropdownExpandContainer
  }, (0, _react2.jsx)(_chevronDown.default, {
    label: "Expand dropdown menu"
  })));
};

var Dropdown = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Dropdown, _Component);

  var _super = _createSuper(Dropdown);

  function Dropdown() {
    var _this;

    (0, _classCallCheck2.default)(this, Dropdown);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      isOpen: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderArrayOptions", function (options) {
      var _this$props = _this.props,
          showSelected = _this$props.showSelected,
          dispatchCommand = _this$props.dispatchCommand;
      return (0, _react2.jsx)(_DropdownMenu.default, {
        hide: _this.hide,
        dispatchCommand: dispatchCommand,
        items: options,
        showSelected: showSelected
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "toggleOpen", function () {
      _this.setState({
        isOpen: !_this.state.isOpen
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "hide", function () {
      _this.setState({
        isOpen: false
      });
    });
    return _this;
  }

  (0, _createClass2.default)(Dropdown, [{
    key: "render",
    value: function render() {
      var isOpen = this.state.isOpen;
      var _this$props2 = this.props,
          title = _this$props2.title,
          icon = _this$props2.icon,
          options = _this$props2.options,
          dispatchCommand = _this$props2.dispatchCommand,
          mountPoint = _this$props2.mountPoint,
          boundariesElement = _this$props2.boundariesElement,
          scrollableElement = _this$props2.scrollableElement,
          hideExpandIcon = _this$props2.hideExpandIcon,
          disabled = _this$props2.disabled,
          tooltip = _this$props2.tooltip,
          buttonTestId = _this$props2.buttonTestId,
          dropdownWidth = _this$props2.dropdownWidth;
      var trigger;

      if (icon) {
        var TriggerIcon = hideExpandIcon ? icon : (0, _react2.jsx)(CompositeIcon, {
          icon: icon
        });
        trigger = (0, _react2.jsx)(_Button.default, {
          testId: buttonTestId,
          title: title,
          icon: TriggerIcon,
          onClick: this.toggleOpen,
          selected: isOpen,
          disabled: disabled,
          tooltipContent: tooltip
        });
      } else {
        trigger = (0, _react2.jsx)(_Button.default, {
          testId: buttonTestId,
          iconAfter: (0, _react2.jsx)("span", {
            css: dropdownExpandContainer
          }, (0, _react2.jsx)(_chevronDown.default, {
            label: "Expand dropdown menu"
          })),
          onClick: this.toggleOpen,
          selected: isOpen,
          disabled: disabled,
          tooltipContent: tooltip
        }, title);
      }
      /**
       * We want to change direction of our dropdowns a bit early,
       * not exactly when it hits the boundary.
       */


      var fitTolerance = 10;
      var fitWidth = Array.isArray(options) ? dropdownWidth || _DropdownMenu.menuItemDimensions.width : options.width;
      var fitHeight = Array.isArray(options) ? options.length * _DropdownMenu.menuItemDimensions.height + _DropdownMenu.itemSpacing * 2 : options.height;
      return (0, _react2.jsx)(_Dropdown.default, {
        mountTo: mountPoint,
        boundariesElement: boundariesElement,
        scrollableElement: scrollableElement,
        isOpen: isOpen,
        handleClickOutside: this.hide,
        handleEscapeKeydown: this.hide,
        fitWidth: fitWidth + fitTolerance,
        fitHeight: fitHeight + fitTolerance,
        trigger: trigger
      }, Array.isArray(options) ? this.renderArrayOptions(options) : options.render({
        hide: this.hide,
        dispatchCommand: dispatchCommand
      }));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      if (this.props.setDisableParentScroll && prevState.isOpen !== this.state.isOpen) {
        this.props.setDisableParentScroll(this.state.isOpen);
      }
    }
  }]);
  return Dropdown;
}(_react.Component);

exports.default = Dropdown;
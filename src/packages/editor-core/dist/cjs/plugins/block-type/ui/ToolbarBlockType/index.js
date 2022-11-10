"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _DropdownMenu = _interopRequireDefault(require("../../../../ui/DropdownMenu"));

var _styles = require("../../../../ui/styles");

var _types = require("../../types");

var _styled = require("./styled");

var _keymaps = require("../../../../keymaps");

var _blocktypeButton = require("./blocktype-button");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ToolbarBlockType = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(ToolbarBlockType, _React$PureComponent);

  var _super = _createSuper(ToolbarBlockType);

  function ToolbarBlockType() {
    var _this;

    (0, _classCallCheck2.default)(this, ToolbarBlockType);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      active: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onOpenChange", function (attrs) {
      _this.setState({
        active: attrs.isOpen
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleTriggerClick", function () {
      _this.onOpenChange({
        isOpen: !_this.state.active
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "createItems", function () {
      var formatMessage = _this.props.intl.formatMessage;
      var _this$props$pluginSta = _this.props.pluginState,
          currentBlockType = _this$props$pluginSta.currentBlockType,
          availableBlockTypes = _this$props$pluginSta.availableBlockTypes;
      var items = availableBlockTypes.map(function (blockType, index) {
        var isActive = currentBlockType === blockType;
        var tagName = blockType.tagName || 'p';
        var Tag = tagName;
        return {
          content: (0, _react2.jsx)("div", {
            css: (0, _styled.blockTypeMenuItemStyle)(tagName, isActive)
          }, (0, _react2.jsx)(Tag, null, formatMessage(blockType.title))),
          value: blockType,
          label: formatMessage(blockType.title),
          key: "".concat(blockType.name, "-").concat(index),
          elemAfter: (0, _react2.jsx)("div", {
            css: [_styled.keyboardShortcut, isActive && _styled.keyboardShortcutSelect]
          }, (0, _keymaps.tooltip)((0, _keymaps.findKeymapByDescription)(blockType.title.defaultMessage))),
          isActive: isActive
        };
      });
      return [{
        items: items
      }];
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSelectBlockType", function (_ref) {
      var item = _ref.item;
      var blockType = item.value;

      _this.props.setBlockType(blockType.name);

      _this.setState({
        active: false
      });
    });
    return _this;
  }

  (0, _createClass2.default)(ToolbarBlockType, [{
    key: "render",
    value: function render() {
      var active = this.state.active;
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isSmall = _this$props.isSmall,
          isReducedSpacing = _this$props.isReducedSpacing,
          _this$props$pluginSta2 = _this$props.pluginState,
          currentBlockType = _this$props$pluginSta2.currentBlockType,
          blockTypesDisabled = _this$props$pluginSta2.blockTypesDisabled,
          availableBlockTypes = _this$props$pluginSta2.availableBlockTypes,
          formatMessage = _this$props.intl.formatMessage;
      var isHeadingDisabled = !availableBlockTypes.some(function (blockType) {
        return blockType.nodeName === 'heading';
      });

      if (isHeadingDisabled) {
        return null;
      }

      var blockTypeTitles = availableBlockTypes.filter(function (blockType) {
        return blockType.name === currentBlockType.name;
      }).map(function (blockType) {
        return blockType.title;
      });
      var longestDropdownMenuItem = [_types.NORMAL_TEXT].concat((0, _toConsumableArray2.default)(availableBlockTypes)).reduce(function (longest, item) {
        var itemTitle = formatMessage(item.title);
        return itemTitle.length >= longest.length ? itemTitle : longest;
      }, '');

      if (!this.props.isDisabled && !blockTypesDisabled) {
        var items = this.createItems();
        return (0, _react2.jsx)("span", {
          css: _styles.wrapperStyle
        }, (0, _react2.jsx)(_DropdownMenu.default, {
          items: items,
          onOpenChange: this.onOpenChange,
          onItemActivated: this.handleSelectBlockType,
          isOpen: active,
          mountTo: popupsMountPoint,
          boundariesElement: popupsBoundariesElement,
          scrollableElement: popupsScrollableElement,
          zIndex: _editorSharedStyles.akEditorMenuZIndex,
          fitHeight: 360,
          fitWidth: 106,
          shouldUseDefaultRole: true
        }, (0, _react2.jsx)(_blocktypeButton.BlockTypeButton, {
          isSmall: isSmall,
          isReducedSpacing: isReducedSpacing,
          selected: active,
          disabled: false,
          title: blockTypeTitles[0],
          onClick: this.handleTriggerClick,
          formatMessage: formatMessage,
          "aria-expanded": active
        }, longestDropdownMenuItem)), (0, _react2.jsx)("span", {
          css: _styles.separatorStyles
        }));
      }

      return (0, _react2.jsx)("span", {
        css: _styles.wrapperStyle
      }, (0, _react2.jsx)(_blocktypeButton.BlockTypeButton, {
        isSmall: isSmall,
        isReducedSpacing: isReducedSpacing,
        selected: active,
        disabled: true,
        title: blockTypeTitles[0],
        onClick: this.handleTriggerClick,
        formatMessage: formatMessage,
        "aria-expanded": active
      }, longestDropdownMenuItem), (0, _react2.jsx)("span", {
        css: _styles.separatorStyles
      }));
    }
  }]);
  return ToolbarBlockType;
}(_react.default.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(ToolbarBlockType);

exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _search = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/search"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _ToolbarButton = _interopRequireWildcard(require("../../../ui/ToolbarButton"));

var _Dropdown = _interopRequireDefault(require("../../../ui/Dropdown"));

var _FindReplace = _interopRequireDefault(require("./FindReplace"));

var _types = require("../../analytics/types");

var _keymaps = require("../../../keymaps");

var _templateObject, _templateObject2, _templateObject3;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var toolbarButtonWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex: 1 1 auto;\n  flex-grow: 0;\n  justify-content: flex-end;\n  align-items: center;\n  padding: 0 8px;\n  @media (max-width: ", "px) {\n    justify-content: center;\n    padding: 0;\n  }\n"])), _editorSharedStyles.akEditorMobileMaxWidth);
var toolbarButtonWrapperFullWith = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex-grow: 1;\n"])));
var wrapper = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n"])));
var messages = (0, _reactIntlNext.defineMessages)({
  findReplaceToolbarButton: {
    id: 'fabric.editor.findReplaceToolbarButton',
    defaultMessage: 'Find and replace',
    description: '"Find" highlights all instances of a word or phrase on the document, and "Replace" changes one or all of those instances to something else'
  }
});

var FindReplaceToolbarButton = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(FindReplaceToolbarButton, _React$PureComponent);

  var _super = _createSuper(FindReplaceToolbarButton);

  function FindReplaceToolbarButton() {
    var _this;

    (0, _classCallCheck2.default)(this, FindReplaceToolbarButton);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "toggleOpen", function () {
      if (_this.props.isActive) {
        _this.props.onCancel({
          triggerMethod: _types.TRIGGER_METHOD.TOOLBAR
        });
      } else {
        _this.props.onActivate();
      }
    });
    return _this;
  }

  (0, _createClass2.default)(FindReplaceToolbarButton, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isReducedSpacing = _this$props.isReducedSpacing,
          findText = _this$props.findText,
          replaceText = _this$props.replaceText,
          isActive = _this$props.isActive,
          index = _this$props.index,
          numMatches = _this$props.numMatches,
          formatMessage = _this$props.intl.formatMessage,
          takeFullWidth = _this$props.takeFullWidth;
      var title = formatMessage(messages.findReplaceToolbarButton);
      var stackBelowOtherEditorFloatingPanels = _editorSharedStyles.akEditorFloatingPanelZIndex - 1;
      return (0, _react2.jsx)("div", {
        css: [toolbarButtonWrapper, takeFullWidth && toolbarButtonWrapperFullWith]
      }, (0, _react2.jsx)(_Dropdown.default, {
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        isOpen: isActive,
        handleEscapeKeydown: function handleEscapeKeydown() {
          if (isActive) {
            _this2.props.onCancel({
              triggerMethod: _types.TRIGGER_METHOD.KEYBOARD
            });
          }
        },
        fitWidth: 352,
        zIndex: stackBelowOtherEditorFloatingPanels,
        trigger: (0, _react2.jsx)(_ToolbarButton.default, {
          buttonId: _ToolbarButton.TOOLBAR_BUTTON.FIND_REPLACE,
          spacing: isReducedSpacing ? 'none' : 'default',
          selected: isActive,
          title: (0, _react2.jsx)(_keymaps.ToolTipContent, {
            description: title,
            keymap: (0, _keymaps.findKeymapByDescription)('Find')
          }),
          iconBefore: (0, _react2.jsx)(_search.default, {
            label: title
          }),
          onClick: this.toggleOpen,
          "aria-expanded": isActive,
          "aria-haspopup": true
        })
      }, (0, _react2.jsx)("div", {
        css: wrapper
      }, (0, _react2.jsx)(_FindReplace.default, (0, _extends2.default)({
        findText: findText,
        replaceText: replaceText,
        count: {
          index: index,
          total: numMatches
        }
      }, this.props)))));
    }
  }]);
  return FindReplaceToolbarButton;
}(_react.default.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(FindReplaceToolbarButton);

exports.default = _default;
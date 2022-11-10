"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FullPageEditor = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _StyledComponents = require("./StyledComponents");

var _context = require("../../ContextPanel/context");

var _FullPageContentArea = require("./FullPageContentArea");

var _FullPageToolbar = require("./FullPageToolbar");

var _featureFlagsContext = require("../../../plugins/feature-flags-context");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var FullPageEditor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(FullPageEditor, _React$Component);

  var _super = _createSuper(FullPageEditor);

  // Wrapper container for toolbar and content area
  function FullPageEditor(props) {
    var _this;

    (0, _classCallCheck2.default)(this, FullPageEditor);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      showKeyline: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "scrollContainer", null);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "wrapperElementRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "contentAreaRef", function (contentArea) {
      _this.contentArea = contentArea;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "scrollContainerRef", function (ref) {
      var previousScrollContainer = _this.scrollContainer; // remove existing handler

      if (previousScrollContainer) {
        previousScrollContainer.removeEventListener('scroll', _this.updateToolbarKeyline);
      }

      _this.scrollContainer = ref ? ref : null;

      if (_this.scrollContainer) {
        _this.scrollContainer.addEventListener('scroll', _this.updateToolbarKeyline, false);

        _this.updateToolbarKeyline();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateToolbarKeyline", (0, _rafSchd.default)(function () {
      if (!_this.scrollContainer) {
        return false;
      }

      var scrollTop = _this.scrollContainer.scrollTop;
      var showKeyline = scrollTop > _editorSharedStyles.akEditorToolbarKeylineHeight;

      if (showKeyline !== _this.state.showKeyline) {
        _this.setState({
          showKeyline: showKeyline
        });
      }

      return false;
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleResize", function () {
      _this.updateToolbarKeyline();
    });

    if (props.innerRef) {
      _this.wrapperElementRef = props.innerRef;
    }

    return _this;
  }

  (0, _createClass2.default)(FullPageEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener('resize', this.handleResize, false);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
      this.updateToolbarKeyline.cancel();
    }
  }, {
    key: "render",
    value: function render() {
      var _props$editorView;

      var props = this.props;
      var showKeyline = this.state.showKeyline;
      var featureFlags = (_props$editorView = props.editorView) !== null && _props$editorView !== void 0 && _props$editorView.state ? (0, _featureFlagsContext.getFeatureFlags)(props.editorView.state) : undefined;
      return (0, _react2.jsx)(_context.ContextPanelWidthProvider, null, (0, _react2.jsx)("div", {
        css: _StyledComponents.fullPageEditorWrapper,
        className: "akEditor",
        ref: this.wrapperElementRef
      }, (0, _react2.jsx)(_FullPageToolbar.FullPageToolbar, {
        appearance: props.appearance,
        beforeIcon: props.primaryToolbarIconBefore,
        collabEdit: props.collabEdit,
        containerElement: this.scrollContainer,
        customPrimaryToolbarComponents: props.customPrimaryToolbarComponents,
        disabled: !!props.disabled,
        dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
        editorActions: props.editorActions,
        editorDOMElement: props.editorDOMElement,
        editorView: props.editorView,
        eventDispatcher: props.eventDispatcher,
        hasMinWidth: props.enableToolbarMinWidth,
        popupsBoundariesElement: props.popupsBoundariesElement,
        popupsMountPoint: props.popupsMountPoint,
        popupsScrollableElement: props.popupsScrollableElement,
        primaryToolbarComponents: props.primaryToolbarComponents,
        providerFactory: props.providerFactory,
        showKeyline: showKeyline,
        featureFlags: featureFlags
      }), (0, _react2.jsx)(_FullPageContentArea.FullPageContentArea, {
        appearance: props.appearance,
        contentArea: this.contentArea,
        contentAreaRef: this.contentAreaRef,
        contentComponents: props.contentComponents,
        contextPanel: props.contextPanel,
        customContentComponents: props.customContentComponents,
        disabled: props.disabled,
        dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
        editorActions: props.editorActions,
        editorDOMElement: props.editorDOMElement,
        editorView: props.editorView,
        eventDispatcher: props.eventDispatcher,
        popupsBoundariesElement: props.popupsBoundariesElement,
        popupsMountPoint: props.popupsMountPoint,
        popupsScrollableElement: props.popupsScrollableElement,
        providerFactory: props.providerFactory,
        scrollContainer: this.scrollContainer,
        scrollContainerRef: this.scrollContainerRef,
        wrapperElement: this.wrapperElementRef.current
      })));
    }
  }]);
  return FullPageEditor;
}(_react.default.Component);

exports.FullPageEditor = FullPageEditor;
(0, _defineProperty2.default)(FullPageEditor, "displayName", 'FullPageEditor');
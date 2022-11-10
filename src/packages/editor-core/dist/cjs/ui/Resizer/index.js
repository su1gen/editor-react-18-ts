"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _reResizable = require("re-resizable");

var _grid = require("../../plugins/grid");

var _utils = require("./utils");

var _styles = require("@atlaskit/editor-common/styles");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _analytics = require("../../plugins/analytics");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var getResizeAnalyticsEvent = function getResizeAnalyticsEvent(type, size, layout) {
  var actionSubject = type === 'embed' ? _analytics.ACTION_SUBJECT.EMBEDS : _analytics.ACTION_SUBJECT.MEDIA_SINGLE;
  return {
    action: _analytics.ACTION.EDITED,
    actionSubject: actionSubject,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      size: size,
      layout: layout
    },
    eventType: _analytics.EVENT_TYPE.UI
  };
};

var getWidthFromSnapPoints = function getWidthFromSnapPoints(width, snapPoints) {
  if (snapPoints.length) {
    return Math.min(Math.max(width, snapPoints[0]), snapPoints[snapPoints.length - 1]);
  }

  return width;
};

var Resizer = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Resizer, _React$Component);

  var _super = _createSuper(Resizer);

  function Resizer() {
    var _this;

    (0, _classCallCheck2.default)(this, Resizer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "resizable", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      isResizing: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleResizeStart", function (event) {
      var _this$props = _this.props,
          _this$props$innerPadd = _this$props.innerPadding,
          innerPadding = _this$props$innerPadd === void 0 ? 0 : _this$props$innerPadd,
          highlights = _this$props.highlights,
          displayGrid = _this$props.displayGrid,
          layout = _this$props.layout,
          width = _this$props.width,
          snapPoints = _this$props.snapPoints; // prevent creating a drag event on Firefox

      event.preventDefault();

      _this.setState({
        isResizing: true
      }, function () {
        var newHighlights = highlights(width + innerPadding, snapPoints);
        displayGrid(newHighlights.length > 0, (0, _grid.gridTypeForLayout)(layout), newHighlights);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleResize", function (_event, _direction, _elementRef, delta) {
      var _this$props2 = _this.props,
          highlights = _this$props2.highlights,
          calcNewSize = _this$props2.calcNewSize,
          scaleFactor = _this$props2.scaleFactor,
          snapPoints = _this$props2.snapPoints,
          displayGrid = _this$props2.displayGrid,
          layout = _this$props2.layout,
          updateSize = _this$props2.updateSize,
          _this$props2$innerPad = _this$props2.innerPadding,
          innerPadding = _this$props2$innerPad === void 0 ? 0 : _this$props2$innerPad;
      var resizable = _this.resizable.current;
      var isResizing = _this.state.isResizing;

      if (!resizable || !resizable.state.original || !isResizing) {
        return;
      }

      var newWidth = getWidthFromSnapPoints(resizable.state.original.width + delta.width * (scaleFactor || 1), snapPoints);
      var newSize = calcNewSize(newWidth + innerPadding, false);

      if (newSize.layout !== layout) {
        updateSize(newSize.width, newSize.layout);
      }

      var newHighlights = highlights(newWidth, snapPoints);
      displayGrid(newHighlights.length > 0, (0, _grid.gridTypeForLayout)(newSize.layout), newHighlights);
      resizable.updateSize({
        width: newWidth,
        height: 'auto'
      });
      resizable.setState({
        isResizing: true
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleResizeStop", function (_event, _direction, _elementRef, delta) {
      var _this$props3 = _this.props,
          highlights = _this$props3.highlights,
          calcNewSize = _this$props3.calcNewSize,
          snapPoints = _this$props3.snapPoints,
          displayGrid = _this$props3.displayGrid,
          layout = _this$props3.layout,
          updateSize = _this$props3.updateSize,
          dispatchAnalyticsEvent = _this$props3.dispatchAnalyticsEvent,
          nodeType = _this$props3.nodeType;
      var resizable = _this.resizable.current;
      var isResizing = _this.state.isResizing;

      if (!resizable || !resizable.state.original || !isResizing) {
        return;
      }

      var newWidth = getWidthFromSnapPoints(resizable.state.original.width + delta.width, snapPoints);
      var snapWidth = (0, _utils.snapTo)(newWidth, snapPoints);
      var newSize = calcNewSize(snapWidth, true);
      var newHighlights = highlights(newWidth, snapPoints);

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent(getResizeAnalyticsEvent(nodeType, newSize.width, newSize.layout));
      } // show committed grid size


      displayGrid(newHighlights.length > 0, (0, _grid.gridTypeForLayout)(newSize.layout), newHighlights);

      _this.setState({
        isResizing: false
      }, function () {
        updateSize(newSize.width, newSize.layout);
        displayGrid(false, (0, _grid.gridTypeForLayout)(layout));
      });
    });
    return _this;
  }

  (0, _createClass2.default)(Resizer, [{
    key: "render",
    value: function render() {
      var handleStyles = {};
      var handles = {};
      var handleComponent = {};
      var _this$props4 = this.props,
          _this$props4$innerPad = _this$props4.innerPadding,
          innerPadding = _this$props4$innerPad === void 0 ? 0 : _this$props4$innerPad,
          width = _this$props4.width,
          pctWidth = _this$props4.pctWidth,
          selected = _this$props4.selected,
          layout = _this$props4.layout,
          enable = _this$props4.enable,
          children = _this$props4.children,
          ratio = _this$props4.ratio,
          handleComponentFunc = _this$props4.handleComponentFunc;
      var isResizing = this.state.isResizing;

      _utils.handleSides.forEach(function (side) {
        var _handleStyles$side;

        handles[side] = "richMedia-resize-handle-".concat(side);
        handleStyles[side] = (_handleStyles$side = {
          width: '24px'
        }, (0, _defineProperty2.default)(_handleStyles$side, side, "".concat(-13 - innerPadding, "px")), (0, _defineProperty2.default)(_handleStyles$side, "zIndex", _editorSharedStyles.akRichMediaResizeZIndex), (0, _defineProperty2.default)(_handleStyles$side, "pointerEvents", 'auto'), _handleStyles$side);
        var sideHandleComponent = handleComponentFunc && handleComponentFunc(side);

        if (sideHandleComponent) {
          handleComponent[side] = sideHandleComponent;
        }
      });

      var className = (0, _classnames.default)(_styles.richMediaClassName, "image-".concat(layout), this.props.className, {
        'is-resizing': isResizing,
        'not-resized': !pctWidth,
        'richMedia-selected': selected,
        'rich-media-wrapped': layout === 'wrap-left' || layout === 'wrap-right'
      });
      var handleWrapperStyle;

      if (ratio) {
        handleWrapperStyle = {
          position: 'absolute',
          width: '100%',
          paddingBottom: "".concat(ratio, "%"),
          top: 0,
          pointerEvents: 'none'
        };
      } // Ideally, Resizable would let you pass in the component rather than
      // the div. For now, we just apply the same styles using CSS


      return /*#__PURE__*/_react.default.createElement(_reResizable.Resizable, {
        ref: this.resizable,
        size: {
          width: width,
          // just content itself (no paddings)
          height: 'auto'
        },
        className: className,
        handleClasses: handles,
        handleStyles: handleStyles,
        handleWrapperStyle: handleWrapperStyle,
        handleComponent: handleComponent,
        enable: enable,
        onResize: this.handleResize,
        onResizeStop: this.handleResizeStop,
        onResizeStart: this.handleResizeStart
      }, children);
    }
  }]);
  return Resizer;
}(_react.default.Component);

exports.default = Resizer;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _prosemirrorUtils = require("prosemirror-utils");

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _smartCard = require("@atlaskit/smart-card");

var _styled = require("../../../ui/Resizer/styled");

var _Resizer = _interopRequireDefault(require("../../../ui/Resizer"));

var _utils = require("../../../ui/Resizer/utils");

var _mediaSingle = require("../../../plugins/media/utils/media-single");

var _styled2 = require("./styled");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ResizableEmbedCard = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ResizableEmbedCard, _React$Component);

  var _super = _createSuper(ResizableEmbedCard);

  function ResizableEmbedCard() {
    var _this;

    (0, _classCallCheck2.default)(this, ResizableEmbedCard);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      offsetLeft: _this.calcOffsetLeft()
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calcNewSize", function (newWidth, stop) {
      var _this$props = _this.props,
          layout = _this$props.layout,
          state = _this$props.view.state;
      var newPct = (0, _ui.calcPctFromPx)(newWidth, _this.props.lineLength) * 100;

      _this.setState({
        resizedPctWidth: newPct
      });

      var newLayout = (0, _prosemirrorUtils.hasParentNodeOfType)(state.schema.nodes.table)(state.selection) ? layout : _this.calcUnwrappedLayout(newPct, newWidth);

      if (newPct <= 100) {
        if (_this.wrappedLayout && (stop ? newPct !== 100 : true)) {
          newLayout = layout;
        }

        return {
          width: newPct,
          layout: newLayout
        };
      } else {
        return {
          width: _this.props.pctWidth || null,
          layout: newLayout
        };
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calcUnwrappedLayout", function (pct, width) {
      if (pct <= 100) {
        return 'center';
      }

      if (width <= _this.wideLayoutWidth) {
        return 'wide';
      }

      return 'full-width';
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calcColumnLeftOffset", function () {
      var offsetLeft = _this.state.offsetLeft;
      return _this.insideInlineLike ? (0, _ui.calcColumnsFromPx)(offsetLeft, _this.props.lineLength, _this.props.gridSize) : 0;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calcPxWidth", function (useLayout) {
      var _this$props2 = _this.props,
          layout = _this$props2.layout,
          pctWidth = _this$props2.pctWidth,
          lineLength = _this$props2.lineLength,
          containerWidth = _this$props2.containerWidth,
          fullWidthMode = _this$props2.fullWidthMode,
          getPos = _this$props2.getPos,
          state = _this$props2.view.state;
      var resizedPctWidth = _this.state.resizedPctWidth;
      var pos = typeof getPos === 'function' ? getPos() : undefined;
      return (0, _mediaSingle.calcMediaPxWidth)({
        origWidth: _editorSharedStyles.DEFAULT_EMBED_CARD_WIDTH,
        origHeight: _editorSharedStyles.DEFAULT_EMBED_CARD_HEIGHT,
        pctWidth: pctWidth,
        state: state,
        containerWidth: {
          width: containerWidth,
          lineLength: lineLength
        },
        isFullWidthModeEnabled: fullWidthMode,
        layout: useLayout || layout,
        pos: pos,
        resizedPctWidth: resizedPctWidth
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "highlights", function (newWidth, snapPoints) {
      var snapWidth = (0, _utils.snapTo)(newWidth, snapPoints);
      var _this$props$view$stat = _this.props.view.state.schema.nodes,
          layoutColumn = _this$props$view$stat.layoutColumn,
          table = _this$props$view$stat.table,
          expand = _this$props$view$stat.expand,
          nestedExpand = _this$props$view$stat.nestedExpand;

      if (_this.$pos && !!(0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)(_this.$pos, [layoutColumn, table, expand, nestedExpand].filter(Boolean))) {
        return [];
      }

      if (snapWidth > _this.wideLayoutWidth) {
        return ['full-width'];
      }

      var _this$props3 = _this.props,
          layout = _this$props3.layout,
          lineLength = _this$props3.lineLength,
          gridSize = _this$props3.gridSize;
      var columns = (0, _ui.calcColumnsFromPx)(snapWidth, lineLength, gridSize);
      var columnWidth = Math.round(columns);
      var highlight = [];

      if (layout === 'wrap-left' || layout === 'align-start') {
        highlight.push(0, columnWidth);
      } else if (layout === 'wrap-right' || layout === 'align-end') {
        highlight.push(gridSize, gridSize - columnWidth);
      } else if (_this.insideInlineLike) {
        highlight.push(Math.round(columns + _this.calcColumnLeftOffset()));
      } else {
        highlight.push(Math.floor((gridSize - columnWidth) / 2), Math.ceil((gridSize + columnWidth) / 2));
      }

      return highlight;
    });
    return _this;
  }

  (0, _createClass2.default)(ResizableEmbedCard, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var offsetLeft = this.calcOffsetLeft();

      if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
        this.setState({
          offsetLeft: offsetLeft
        });
      }
    }
  }, {
    key: "wrappedLayout",
    get: function get() {
      return _ui.wrappedLayouts.indexOf(this.props.layout) > -1;
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.layout !== nextProps.layout) {
        this.checkLayout(this.props.layout, nextProps.layout);
      }
    }
    /**
     * When returning to center layout from a wrapped/aligned layout, it might actually
     * be wide or full-width
     */

  }, {
    key: "checkLayout",
    value: function checkLayout(oldLayout, newLayout) {
      var resizedPctWidth = this.state.resizedPctWidth;

      if (_ui.wrappedLayouts.indexOf(oldLayout) > -1 && newLayout === 'center' && resizedPctWidth) {
        var layout = this.calcUnwrappedLayout(resizedPctWidth, this.calcPxWidth(newLayout));
        this.props.updateSize(resizedPctWidth, layout);
      }
    }
  }, {
    key: "$pos",
    get: function get() {
      if (typeof this.props.getPos !== 'function') {
        return null;
      }

      var pos = this.props.getPos();

      if (Number.isNaN(pos) || typeof pos !== 'number') {
        return null;
      } // need to pass view because we may not get updated props in time


      return this.props.view.state.doc.resolve(pos);
    }
    /**
     * The maxmimum number of grid columns this node can resize to.
     */

  }, {
    key: "gridWidth",
    get: function get() {
      var gridSize = this.props.gridSize;
      return !(this.wrappedLayout || this.insideInlineLike) ? gridSize / 2 : gridSize;
    }
  }, {
    key: "calcOffsetLeft",
    value: function calcOffsetLeft() {
      var offsetLeft = 0;

      if (this.wrapper && this.insideInlineLike) {
        var currentNode = this.wrapper;
        var boundingRect = currentNode.getBoundingClientRect();
        var pmRect = this.props.view.dom.getBoundingClientRect();
        offsetLeft = boundingRect.left - pmRect.left;
      }

      return offsetLeft;
    }
  }, {
    key: "wideLayoutWidth",
    get: function get() {
      var lineLength = this.props.lineLength;

      if (lineLength) {
        return Math.ceil(lineLength * _editorSharedStyles.breakoutWideScaleRatio);
      } else {
        return _editorSharedStyles.akEditorWideLayoutWidth;
      }
    }
  }, {
    key: "calcSnapPoints",
    value: function calcSnapPoints() {
      var offsetLeft = this.state.offsetLeft;
      var _this$props4 = this.props,
          containerWidth = _this$props4.containerWidth,
          lineLength = _this$props4.lineLength;
      var snapTargets = [];

      for (var i = 0; i < this.gridWidth; i++) {
        snapTargets.push((0, _ui.calcPxFromColumns)(i, lineLength, this.gridWidth) - offsetLeft);
      } // full width


      snapTargets.push(lineLength - offsetLeft);
      var minimumWidth = (0, _ui.calcPxFromColumns)(this.wrappedLayout || this.insideInlineLike ? 1 : 2, lineLength, this.props.gridSize);
      var snapPoints = snapTargets.filter(function (width) {
        return width >= minimumWidth;
      });
      var $pos = this.$pos;

      if (!$pos) {
        return snapPoints;
      }

      var isTopLevel = $pos.parent.type.name === 'doc';

      if (isTopLevel) {
        snapPoints.push(this.wideLayoutWidth);
        var fullWidthPoint = containerWidth - _editorSharedStyles.akEditorBreakoutPadding;

        if (fullWidthPoint > this.wideLayoutWidth) {
          snapPoints.push(fullWidthPoint);
        }
      }

      return snapPoints;
    }
  }, {
    key: "insideInlineLike",
    get: function get() {
      var $pos = this.$pos;

      if (!$pos) {
        return false;
      }

      var listItem = this.props.view.state.schema.nodes.listItem;
      return !!(0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($pos, [listItem]);
    }
  }, {
    key: "getHeightDefiningComponent",
    value:
    /**
     * Previously height of the box was controlled with paddingTop/paddingBottom trick inside Wrapper.
     * It allowed height to be defined by a given percent ratio and so absolute value was defined by actual width.
     * Also, it was part of styled component, which was fine because it was static through out life time of component.
     *
     * Now, two things changed:
     * 1. If `height` is present we take it as actual height of the box, and hence we don't need
     * (or even can't have, due to lack of width value) paddingTop trick.
     * 2. Since `height` can be changing through out life time of a component, we can't have it as part of styled component,
     * and hence we use `style` prop.
     */
    function getHeightDefiningComponent() {
      var _this$props5 = this.props,
          height = _this$props5.height,
          aspectRatio = _this$props5.aspectRatio;
      var heightDefiningStyles;

      if (height) {
        heightDefiningStyles = {
          height: "".concat(height, "px")
        };
      } else {
        // paddingBottom css trick defines ratio of `iframe height (y) + header (32)` to `width (x)`,
        // where is `aspectRatio` defines iframe aspectRatio alone
        // So, visually:
        //
        //            x
        //       ┌──────────┐
        //       │  header  │ 32
        //       ├──────────┤
        //       │          │
        //       │  iframe  │ y
        //       │          │
        //       └──────────┘
        //
        // aspectRatio = x / y
        // paddingBottom = (y + 32) / x
        // which can be achieved with css calc() as (1 / (x/y)) * 100)% + 32px
        heightDefiningStyles = {
          paddingBottom: "calc(".concat((1 / aspectRatio * 100).toFixed(3), "% + ").concat(_smartCard.embedHeaderHeight, "px)")
        };
      }

      return (0, _react2.jsx)("span", {
        "data-testid": 'resizable-embed-card-height-definer',
        style: _objectSpread({
          display: 'block',

          /* Fixes extra padding problem in Firefox */
          fontSize: 0,
          lineHeight: 0
        }, heightDefiningStyles)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props6 = this.props,
          layout = _this$props6.layout,
          pctWidth = _this$props6.pctWidth,
          containerWidth = _this$props6.containerWidth,
          fullWidthMode = _this$props6.fullWidthMode,
          children = _this$props6.children;

      var initialWidth = this.calcPxWidth() - _editorSharedStyles.akEditorMediaResizeHandlerPaddingWide;

      var enable = {};

      _utils.handleSides.forEach(function (side) {
        var oppositeSide = side === 'left' ? 'right' : 'left';
        enable[side] = ['full-width', 'wide', 'center'].concat("wrap-".concat(oppositeSide)).concat("align-".concat(_utils.imageAlignmentMap[oppositeSide])).indexOf(layout) > -1;

        if (side === 'left' && _this2.insideInlineLike) {
          enable[side] = false;
        }
      });

      return (0, _react2.jsx)("div", {
        css: _styled2.embedSpacingStyles,
        "data-testid": "resizable-embed-card-spacing"
      }, (0, _react2.jsx)("div", {
        css: (0, _styled.wrapperStyle)({
          layout: layout,
          isResized: !!pctWidth,
          containerWidth: containerWidth || _editorSharedStyles.DEFAULT_EMBED_CARD_WIDTH,
          fullWidthMode: fullWidthMode
        })
      }, (0, _react2.jsx)(_Resizer.default, (0, _extends2.default)({}, this.props, {
        width: initialWidth // Starting or initial width of embed <iframe> itself.
        ,
        enable: enable,
        calcNewSize: this.calcNewSize,
        snapPoints: this.calcSnapPoints(),
        scaleFactor: !this.wrappedLayout && !this.insideInlineLike ? 2 : 1,
        highlights: this.highlights,
        innerPadding: _editorSharedStyles.akEditorMediaResizeHandlerPaddingWide,
        nodeType: "embed"
      }), children, this.getHeightDefiningComponent())));
    }
  }]);
  return ResizableEmbedCard;
}(_react.default.Component);

exports.default = ResizableEmbedCard;
(0, _defineProperty2.default)(ResizableEmbedCard, "defaultProps", {
  aspectRatio: _editorSharedStyles.DEFAULT_EMBED_CARD_WIDTH / _editorSharedStyles.DEFAULT_EMBED_CARD_HEIGHT
});
import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { findParentNodeOfTypeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { calcColumnsFromPx, calcPctFromPx, calcPxFromColumns, wrappedLayouts } from '@atlaskit/editor-common/ui';
import { akEditorMediaResizeHandlerPaddingWide, akEditorBreakoutPadding, akEditorWideLayoutWidth, breakoutWideScaleRatio, DEFAULT_EMBED_CARD_HEIGHT, DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import { embedHeaderHeight } from '@atlaskit/smart-card';
import { wrapperStyle } from '../../../ui/Resizer/styled';
import Resizer from '../../../ui/Resizer';
import { handleSides, imageAlignmentMap, snapTo } from '../../../ui/Resizer/utils';
import { calcMediaPxWidth } from '../../../plugins/media/utils/media-single';
import { embedSpacingStyles } from './styled';

var ResizableEmbedCard = /*#__PURE__*/function (_React$Component) {
  _inherits(ResizableEmbedCard, _React$Component);

  var _super = _createSuper(ResizableEmbedCard);

  function ResizableEmbedCard() {
    var _this;

    _classCallCheck(this, ResizableEmbedCard);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      offsetLeft: _this.calcOffsetLeft()
    });

    _defineProperty(_assertThisInitialized(_this), "calcNewSize", function (newWidth, stop) {
      var _this$props = _this.props,
          layout = _this$props.layout,
          state = _this$props.view.state;
      var newPct = calcPctFromPx(newWidth, _this.props.lineLength) * 100;

      _this.setState({
        resizedPctWidth: newPct
      });

      var newLayout = hasParentNodeOfType(state.schema.nodes.table)(state.selection) ? layout : _this.calcUnwrappedLayout(newPct, newWidth);

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

    _defineProperty(_assertThisInitialized(_this), "calcUnwrappedLayout", function (pct, width) {
      if (pct <= 100) {
        return 'center';
      }

      if (width <= _this.wideLayoutWidth) {
        return 'wide';
      }

      return 'full-width';
    });

    _defineProperty(_assertThisInitialized(_this), "calcColumnLeftOffset", function () {
      var offsetLeft = _this.state.offsetLeft;
      return _this.insideInlineLike ? calcColumnsFromPx(offsetLeft, _this.props.lineLength, _this.props.gridSize) : 0;
    });

    _defineProperty(_assertThisInitialized(_this), "calcPxWidth", function (useLayout) {
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
      return calcMediaPxWidth({
        origWidth: DEFAULT_EMBED_CARD_WIDTH,
        origHeight: DEFAULT_EMBED_CARD_HEIGHT,
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

    _defineProperty(_assertThisInitialized(_this), "highlights", function (newWidth, snapPoints) {
      var snapWidth = snapTo(newWidth, snapPoints);
      var _this$props$view$stat = _this.props.view.state.schema.nodes,
          layoutColumn = _this$props$view$stat.layoutColumn,
          table = _this$props$view$stat.table,
          expand = _this$props$view$stat.expand,
          nestedExpand = _this$props$view$stat.nestedExpand;

      if (_this.$pos && !!findParentNodeOfTypeClosestToPos(_this.$pos, [layoutColumn, table, expand, nestedExpand].filter(Boolean))) {
        return [];
      }

      if (snapWidth > _this.wideLayoutWidth) {
        return ['full-width'];
      }

      var _this$props3 = _this.props,
          layout = _this$props3.layout,
          lineLength = _this$props3.lineLength,
          gridSize = _this$props3.gridSize;
      var columns = calcColumnsFromPx(snapWidth, lineLength, gridSize);
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

  _createClass(ResizableEmbedCard, [{
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
      return wrappedLayouts.indexOf(this.props.layout) > -1;
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

      if (wrappedLayouts.indexOf(oldLayout) > -1 && newLayout === 'center' && resizedPctWidth) {
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
        return Math.ceil(lineLength * breakoutWideScaleRatio);
      } else {
        return akEditorWideLayoutWidth;
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
        snapTargets.push(calcPxFromColumns(i, lineLength, this.gridWidth) - offsetLeft);
      } // full width


      snapTargets.push(lineLength - offsetLeft);
      var minimumWidth = calcPxFromColumns(this.wrappedLayout || this.insideInlineLike ? 1 : 2, lineLength, this.props.gridSize);
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
        var fullWidthPoint = containerWidth - akEditorBreakoutPadding;

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
      return !!findParentNodeOfTypeClosestToPos($pos, [listItem]);
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
          paddingBottom: "calc(".concat((1 / aspectRatio * 100).toFixed(3), "% + ").concat(embedHeaderHeight, "px)")
        };
      }

      return jsx("span", {
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
      var initialWidth = this.calcPxWidth() - akEditorMediaResizeHandlerPaddingWide;
      var enable = {};
      handleSides.forEach(function (side) {
        var oppositeSide = side === 'left' ? 'right' : 'left';
        enable[side] = ['full-width', 'wide', 'center'].concat("wrap-".concat(oppositeSide)).concat("align-".concat(imageAlignmentMap[oppositeSide])).indexOf(layout) > -1;

        if (side === 'left' && _this2.insideInlineLike) {
          enable[side] = false;
        }
      });
      return jsx("div", {
        css: embedSpacingStyles,
        "data-testid": "resizable-embed-card-spacing"
      }, jsx("div", {
        css: wrapperStyle({
          layout: layout,
          isResized: !!pctWidth,
          containerWidth: containerWidth || DEFAULT_EMBED_CARD_WIDTH,
          fullWidthMode: fullWidthMode
        })
      }, jsx(Resizer, _extends({}, this.props, {
        width: initialWidth // Starting or initial width of embed <iframe> itself.
        ,
        enable: enable,
        calcNewSize: this.calcNewSize,
        snapPoints: this.calcSnapPoints(),
        scaleFactor: !this.wrappedLayout && !this.insideInlineLike ? 2 : 1,
        highlights: this.highlights,
        innerPadding: akEditorMediaResizeHandlerPaddingWide,
        nodeType: "embed"
      }), children, this.getHeightDefiningComponent())));
    }
  }]);

  return ResizableEmbedCard;
}(React.Component);

_defineProperty(ResizableEmbedCard, "defaultProps", {
  aspectRatio: DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT
});

export { ResizableEmbedCard as default };
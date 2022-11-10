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
import classnames from 'classnames';
import { Resizable } from 're-resizable';
import { gridTypeForLayout } from '../../plugins/grid';
import { snapTo, handleSides } from './utils';
import { richMediaClassName } from '@atlaskit/editor-common/styles';
import { akRichMediaResizeZIndex } from '@atlaskit/editor-shared-styles';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../plugins/analytics';

var getResizeAnalyticsEvent = function getResizeAnalyticsEvent(type, size, layout) {
  var actionSubject = type === 'embed' ? ACTION_SUBJECT.EMBEDS : ACTION_SUBJECT.MEDIA_SINGLE;
  return {
    action: ACTION.EDITED,
    actionSubject: actionSubject,
    actionSubjectId: ACTION_SUBJECT_ID.RESIZED,
    attributes: {
      size: size,
      layout: layout
    },
    eventType: EVENT_TYPE.UI
  };
};

var getWidthFromSnapPoints = function getWidthFromSnapPoints(width, snapPoints) {
  if (snapPoints.length) {
    return Math.min(Math.max(width, snapPoints[0]), snapPoints[snapPoints.length - 1]);
  }

  return width;
};

var Resizer = /*#__PURE__*/function (_React$Component) {
  _inherits(Resizer, _React$Component);

  var _super = _createSuper(Resizer);

  function Resizer() {
    var _this;

    _classCallCheck(this, Resizer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "resizable", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "state", {
      isResizing: false
    });

    _defineProperty(_assertThisInitialized(_this), "handleResizeStart", function (event) {
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
        displayGrid(newHighlights.length > 0, gridTypeForLayout(layout), newHighlights);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleResize", function (_event, _direction, _elementRef, delta) {
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
      displayGrid(newHighlights.length > 0, gridTypeForLayout(newSize.layout), newHighlights);
      resizable.updateSize({
        width: newWidth,
        height: 'auto'
      });
      resizable.setState({
        isResizing: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleResizeStop", function (_event, _direction, _elementRef, delta) {
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
      var snapWidth = snapTo(newWidth, snapPoints);
      var newSize = calcNewSize(snapWidth, true);
      var newHighlights = highlights(newWidth, snapPoints);

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent(getResizeAnalyticsEvent(nodeType, newSize.width, newSize.layout));
      } // show committed grid size


      displayGrid(newHighlights.length > 0, gridTypeForLayout(newSize.layout), newHighlights);

      _this.setState({
        isResizing: false
      }, function () {
        updateSize(newSize.width, newSize.layout);
        displayGrid(false, gridTypeForLayout(layout));
      });
    });

    return _this;
  }

  _createClass(Resizer, [{
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
      handleSides.forEach(function (side) {
        var _handleStyles$side;

        handles[side] = "richMedia-resize-handle-".concat(side);
        handleStyles[side] = (_handleStyles$side = {
          width: '24px'
        }, _defineProperty(_handleStyles$side, side, "".concat(-13 - innerPadding, "px")), _defineProperty(_handleStyles$side, "zIndex", akRichMediaResizeZIndex), _defineProperty(_handleStyles$side, "pointerEvents", 'auto'), _handleStyles$side);
        var sideHandleComponent = handleComponentFunc && handleComponentFunc(side);

        if (sideHandleComponent) {
          handleComponent[side] = sideHandleComponent;
        }
      });
      var className = classnames(richMediaClassName, "image-".concat(layout), this.props.className, {
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


      return /*#__PURE__*/React.createElement(Resizable, {
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
}(React.Component);

export { Resizer as default };
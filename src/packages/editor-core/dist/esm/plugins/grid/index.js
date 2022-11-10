import _extends from "@babel/runtime/helpers/extends";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import classnames from 'classnames';
import { withTheme } from '@emotion/react';
import { PluginKey } from 'prosemirror-state';
import { breakoutWideScaleRatio, akEditorFullPageMaxWidth, akEditorBreakoutPadding } from '@atlaskit/editor-shared-styles';
import { pluginKey as widthPlugin } from '../width/index';
import WithPluginState from '../../ui/WithPluginState';
import { createDispatch } from '../../event-dispatcher';
export var stateKey = new PluginKey('gridPlugin');
export var GRID_SIZE = 12;
export var createDisplayGrid = function createDisplayGrid(eventDispatcher) {
  var dispatch = createDispatch(eventDispatcher);
  return function (show, type) {
    var highlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return dispatch(stateKey, {
      visible: show,
      gridType: type,
      highlight: highlight
    });
  };
};
export var gridTypeForLayout = function gridTypeForLayout(layout) {
  return layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';
};
var sides = ['left', 'right'];

var overflowHighlight = function overflowHighlight(highlights, side, start, size) {
  if (!highlights.length) {
    return false;
  }

  var minHighlight = highlights.reduce(function (prev, cur) {
    return Math.min(prev, cur);
  });
  var maxHighlight = highlights.reduce(function (prev, cur) {
    return Math.max(prev, cur);
  });

  if (side === 'left') {
    return minHighlight < 0 && minHighlight <= -start && (typeof size === 'number' ? minHighlight >= -(start + size) : true);
  } else {
    return maxHighlight > GRID_SIZE && maxHighlight >= GRID_SIZE + start && (typeof size === 'number' ? maxHighlight <= GRID_SIZE + size : true);
  }
};

var gutterGridLines = function gutterGridLines(editorMaxWidth, editorWidth, highlights, shouldCalcBreakoutGridLines) {
  var gridLines = [];

  if (!shouldCalcBreakoutGridLines) {
    return gridLines;
  }

  var wideSpacing = (editorMaxWidth * breakoutWideScaleRatio - editorMaxWidth) / 2;
  sides.forEach(function (side) {
    gridLines.push( /*#__PURE__*/React.createElement("div", {
      key: side,
      className: classnames('gridLine', overflowHighlight(highlights, side, 0, 4) ? 'highlight' : ''),
      style: _defineProperty({
        position: 'absolute'
      }, side, "-".concat(wideSpacing, "px"))
    }));
    gridLines.push( /*#__PURE__*/React.createElement("div", {
      key: side + '-bk',
      className: classnames('gridLine', highlights.indexOf('full-width') > -1 ? 'highlight' : ''),
      style: _defineProperty({
        position: 'absolute'
      }, side, "-".concat((editorWidth - editorMaxWidth - akEditorBreakoutPadding) / 2, "px"))
    }));
  });
  return gridLines;
};

var lineLengthGridLines = function lineLengthGridLines(highlights) {
  var gridLines = [];
  var gridSpacing = 100 / GRID_SIZE;

  for (var i = 0; i <= GRID_SIZE; i++) {
    var style = {
      paddingLeft: "".concat(gridSpacing, "%")
    };
    gridLines.push( /*#__PURE__*/React.createElement("div", {
      key: i,
      className: classnames('gridLine', highlights.indexOf(i) > -1 ? 'highlight' : ''),
      style: i < GRID_SIZE ? style : undefined
    }));
  }

  return gridLines;
};

var Grid = /*#__PURE__*/function (_React$Component) {
  _inherits(Grid, _React$Component);

  var _super = _createSuper(Grid);

  function Grid() {
    _classCallCheck(this, Grid);

    return _super.apply(this, arguments);
  }

  _createClass(Grid, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          highlight = _this$props.highlight,
          shouldCalcBreakoutGridLines = _this$props.shouldCalcBreakoutGridLines,
          theme = _this$props.theme,
          containerElement = _this$props.containerElement,
          editorWidth = _this$props.editorWidth,
          gridType = _this$props.gridType,
          visible = _this$props.visible;
      var editorMaxWidth = theme.layoutMaxWidth;
      var gridLines = [].concat(_toConsumableArray(lineLengthGridLines(highlight)), _toConsumableArray(gutterGridLines(editorMaxWidth, editorWidth, highlight, shouldCalcBreakoutGridLines)));
      return /*#__PURE__*/React.createElement("div", {
        className: "gridParent"
      }, /*#__PURE__*/React.createElement("div", {
        className: classnames('gridContainer', gridType),
        style: {
          height: "".concat(containerElement.scrollHeight, "px"),
          display: visible ? 'block' : 'none'
        }
      }, gridLines));
    }
  }]);

  return Grid;
}(React.Component);

var ThemedGrid = withTheme(Grid);

var gridPlugin = function gridPlugin(options) {
  return {
    name: 'grid',
    contentComponent: function contentComponent(_ref3) {
      var editorView = _ref3.editorView;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          grid: stateKey,
          widthState: widthPlugin
        },
        render: function render(_ref4) {
          var grid = _ref4.grid,
              _ref4$widthState = _ref4.widthState,
              widthState = _ref4$widthState === void 0 ? {
            width: akEditorFullPageMaxWidth
          } : _ref4$widthState;

          if (!grid) {
            return null;
          }

          return /*#__PURE__*/React.createElement(ThemedGrid, _extends({
            shouldCalcBreakoutGridLines: options && options.shouldCalcBreakoutGridLines,
            editorWidth: widthState.width,
            containerElement: editorView.dom
          }, grid));
        }
      });
    }
  };
};

export default gridPlugin;
export { GRID_GUTTER } from './styles';
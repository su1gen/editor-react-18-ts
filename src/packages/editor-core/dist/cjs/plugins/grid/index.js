"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "GRID_GUTTER", {
  enumerable: true,
  get: function get() {
    return _styles.GRID_GUTTER;
  }
});
exports.stateKey = exports.gridTypeForLayout = exports.default = exports.createDisplayGrid = exports.GRID_SIZE = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _react2 = require("@emotion/react");

var _prosemirrorState = require("prosemirror-state");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _index = require("../width/index");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _eventDispatcher = require("../../event-dispatcher");

var _styles = require("./styles");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var stateKey = new _prosemirrorState.PluginKey('gridPlugin');
exports.stateKey = stateKey;
var GRID_SIZE = 12;
exports.GRID_SIZE = GRID_SIZE;

var createDisplayGrid = function createDisplayGrid(eventDispatcher) {
  var dispatch = (0, _eventDispatcher.createDispatch)(eventDispatcher);
  return function (show, type) {
    var highlight = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    return dispatch(stateKey, {
      visible: show,
      gridType: type,
      highlight: highlight
    });
  };
};

exports.createDisplayGrid = createDisplayGrid;

var gridTypeForLayout = function gridTypeForLayout(layout) {
  return layout === 'wrap-left' || layout === 'wrap-right' ? 'wrapped' : 'full';
};

exports.gridTypeForLayout = gridTypeForLayout;
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

  var wideSpacing = (editorMaxWidth * _editorSharedStyles.breakoutWideScaleRatio - editorMaxWidth) / 2;
  sides.forEach(function (side) {
    gridLines.push( /*#__PURE__*/_react.default.createElement("div", {
      key: side,
      className: (0, _classnames.default)('gridLine', overflowHighlight(highlights, side, 0, 4) ? 'highlight' : ''),
      style: (0, _defineProperty2.default)({
        position: 'absolute'
      }, side, "-".concat(wideSpacing, "px"))
    }));
    gridLines.push( /*#__PURE__*/_react.default.createElement("div", {
      key: side + '-bk',
      className: (0, _classnames.default)('gridLine', highlights.indexOf('full-width') > -1 ? 'highlight' : ''),
      style: (0, _defineProperty2.default)({
        position: 'absolute'
      }, side, "-".concat((editorWidth - editorMaxWidth - _editorSharedStyles.akEditorBreakoutPadding) / 2, "px"))
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
    gridLines.push( /*#__PURE__*/_react.default.createElement("div", {
      key: i,
      className: (0, _classnames.default)('gridLine', highlights.indexOf(i) > -1 ? 'highlight' : ''),
      style: i < GRID_SIZE ? style : undefined
    }));
  }

  return gridLines;
};

var Grid = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Grid, _React$Component);

  var _super = _createSuper(Grid);

  function Grid() {
    (0, _classCallCheck2.default)(this, Grid);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Grid, [{
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
      var gridLines = [].concat((0, _toConsumableArray2.default)(lineLengthGridLines(highlight)), (0, _toConsumableArray2.default)(gutterGridLines(editorMaxWidth, editorWidth, highlight, shouldCalcBreakoutGridLines)));
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "gridParent"
      }, /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('gridContainer', gridType),
        style: {
          height: "".concat(containerElement.scrollHeight, "px"),
          display: visible ? 'block' : 'none'
        }
      }, gridLines));
    }
  }]);
  return Grid;
}(_react.default.Component);

var ThemedGrid = (0, _react2.withTheme)(Grid);

var gridPlugin = function gridPlugin(options) {
  return {
    name: 'grid',
    contentComponent: function contentComponent(_ref3) {
      var editorView = _ref3.editorView;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          grid: stateKey,
          widthState: _index.pluginKey
        },
        render: function render(_ref4) {
          var grid = _ref4.grid,
              _ref4$widthState = _ref4.widthState,
              widthState = _ref4$widthState === void 0 ? {
            width: _editorSharedStyles.akEditorFullPageMaxWidth
          } : _ref4$widthState;

          if (!grid) {
            return null;
          }

          return /*#__PURE__*/_react.default.createElement(ThemedGrid, (0, _extends2.default)({
            shouldCalcBreakoutGridLines: options && options.shouldCalcBreakoutGridLines,
            editorWidth: widthState.width,
            containerElement: editorView.dom
          }, grid));
        }
      });
    }
  };
};

var _default = gridPlugin;
exports.default = _default;
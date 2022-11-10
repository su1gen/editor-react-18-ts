"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calcOffsetLeft = calcOffsetLeft;
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

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

var _mediaClient = require("@atlaskit/media-client");

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _styled = require("./styled");

var _Resizer = _interopRequireDefault(require("../../../../ui/Resizer"));

var _utils = require("../../../../ui/Resizer/utils");

var _mediaSingle = require("../../utils/media-single");

var _richMediaUtils = require("../../../../utils/rich-media-utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ResizableMediaSingle = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ResizableMediaSingle, _React$Component);

  var _super = _createSuper(ResizableMediaSingle);

  function ResizableMediaSingle() {
    var _this;

    (0, _classCallCheck2.default)(this, ResizableMediaSingle);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      offsetLeft: calcOffsetLeft(_this.insideInlineLike, _this.insideLayout, _this.props.view.dom, undefined),
      // We default to true until we resolve the file type
      isVideoFile: true
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

      if (width <= _editorSharedStyles.akEditorWideLayoutWidth) {
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
          _this$props2$width = _this$props2.width,
          origWidth = _this$props2$width === void 0 ? 0 : _this$props2$width,
          origHeight = _this$props2.height,
          layout = _this$props2.layout,
          pctWidth = _this$props2.pctWidth,
          lineLength = _this$props2.lineLength,
          containerWidth = _this$props2.containerWidth,
          fullWidthMode = _this$props2.fullWidthMode,
          getPos = _this$props2.getPos,
          state = _this$props2.view.state;
      var pos = typeof getPos === 'function' ? getPos() : undefined;
      return (0, _mediaSingle.calcMediaPxWidth)({
        origWidth: origWidth,
        origHeight: origHeight,
        pctWidth: pctWidth,
        state: state,
        containerWidth: {
          width: containerWidth,
          lineLength: lineLength
        },
        isFullWidthModeEnabled: fullWidthMode,
        layout: useLayout || layout,
        pos: pos
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

      if (snapWidth > _editorSharedStyles.akEditorWideLayoutWidth) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "saveWrapper", function (wrapper) {
      return _this.wrapper = wrapper;
    });
    return _this;
  }

  (0, _createClass2.default)(ResizableMediaSingle, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var offsetLeft = calcOffsetLeft(this.insideInlineLike, this.insideLayout, this.props.view.dom, this.wrapper);

      if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
        this.setState({
          offsetLeft: offsetLeft
        });
      }

      return true;
    }
  }, {
    key: "wrappedLayout",
    get: function get() {
      return _ui.wrappedLayouts.indexOf(this.props.layout) > -1;
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var viewMediaClientConfig;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                viewMediaClientConfig = this.props.viewMediaClientConfig;

                if (!viewMediaClientConfig) {
                  _context.next = 4;
                  break;
                }

                _context.next = 4;
                return this.checkVideoFile(viewMediaClientConfig);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.viewMediaClientConfig !== nextProps.viewMediaClientConfig) {
        this.checkVideoFile(nextProps.viewMediaClientConfig);
      }

      if (this.props.layout !== nextProps.layout) {
        this.checkLayout(this.props.layout, nextProps.layout);
      }
    }
  }, {
    key: "checkVideoFile",
    value: function () {
      var _checkVideoFile = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(viewMediaClientConfig) {
        var $pos, mediaNode, mediaClient, state;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                $pos = this.$pos;

                if (!(!$pos || !viewMediaClientConfig)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                mediaNode = this.props.view.state.doc.nodeAt($pos.pos + 1);

                if (!(!mediaNode || !mediaNode.attrs.id)) {
                  _context2.next = 6;
                  break;
                }

                return _context2.abrupt("return");

              case 6:
                mediaClient = (0, _mediaClient.getMediaClient)(viewMediaClientConfig);
                _context2.prev = 7;
                _context2.next = 10;
                return mediaClient.file.getCurrentState(mediaNode.attrs.id, {
                  collectionName: mediaNode.attrs.collection
                });

              case 10:
                state = _context2.sent;

                if (state && state.status !== 'error' && state.mediaType === 'image') {
                  this.setState({
                    isVideoFile: false
                  });
                }

                _context2.next = 17;
                break;

              case 14:
                _context2.prev = 14;
                _context2.t0 = _context2["catch"](7);
                this.setState({
                  isVideoFile: false
                });

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[7, 14]]);
      }));

      function checkVideoFile(_x) {
        return _checkVideoFile.apply(this, arguments);
      }

      return checkVideoFile;
    }()
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
    key: "insideLayout",
    get: function get() {
      var $pos = this.$pos;

      if (!$pos) {
        return false;
      }

      var layoutColumn = this.props.view.state.schema.nodes.layoutColumn;
      return !!(0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($pos, [layoutColumn]);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props4 = this.props,
          origWidth = _this$props4.width,
          origHeight = _this$props4.height,
          layout = _this$props4.layout,
          pctWidth = _this$props4.pctWidth,
          containerWidth = _this$props4.containerWidth,
          fullWidthMode = _this$props4.fullWidthMode,
          selected = _this$props4.selected,
          children = _this$props4.children;
      var initialWidth = this.calcPxWidth(); // width with padding

      var ratio;

      if (origWidth) {
        ratio = (origHeight / origWidth * 100).toFixed(3);
      }

      var enable = {};

      _utils.handleSides.forEach(function (side) {
        var oppositeSide = side === 'left' ? 'right' : 'left';
        enable[side] = ['full-width', 'wide', 'center'].concat("wrap-".concat(oppositeSide)).concat("align-".concat(_utils.imageAlignmentMap[oppositeSide])).indexOf(layout) > -1;

        if (side === 'left' && _this2.insideInlineLike) {
          enable[side] = false;
        }
      });

      var snapPointsProps = {
        $pos: this.$pos,
        akEditorWideLayoutWidth: _editorSharedStyles.akEditorWideLayoutWidth,
        allowBreakoutSnapPoints: this.props.allowBreakoutSnapPoints,
        containerWidth: this.props.containerWidth,
        gridSize: this.props.gridSize,
        gridWidth: this.gridWidth,
        insideInlineLike: this.insideInlineLike,
        insideLayout: this.insideLayout,
        isVideoFile: this.state.isVideoFile,
        lineLength: this.props.lineLength,
        offsetLeft: this.state.offsetLeft,
        wrappedLayout: this.wrappedLayout
      };
      return (0, _react2.jsx)("div", {
        ref: this.saveWrapper,
        css: (0, _styled.wrapperStyle)({
          layout: layout,
          isResized: !!pctWidth,
          containerWidth: containerWidth || origWidth,
          fullWidthMode: fullWidthMode
        })
      }, (0, _react2.jsx)(_Resizer.default, (0, _extends2.default)({}, this.props, {
        ratio: ratio,
        width: initialWidth,
        selected: selected,
        enable: enable,
        calcNewSize: this.calcNewSize,
        snapPoints: (0, _richMediaUtils.calculateSnapPoints)(snapPointsProps),
        scaleFactor: !this.wrappedLayout && !this.insideInlineLike ? 2 : 1,
        highlights: this.highlights,
        nodeType: "media",
        dispatchAnalyticsEvent: this.props.dispatchAnalyticsEvent // when cursor is located below a media with caption,
        // press “Up“ key will result cursor focus on an invalid position, (on the resize handler)
        // This workaround adds an empty div inside the resize handler to prevent the issue.
        ,
        handleComponentFunc: function handleComponentFunc() {
          return (0, _react2.jsx)("div", {
            contentEditable: false
          });
        }
      }), children));
    }
  }]);
  return ResizableMediaSingle;
}(_react.default.Component);

exports.default = ResizableMediaSingle;

function calcOffsetLeft(insideInlineLike, insideLayout, pmViewDom, wrapper) {
  var offsetLeft = 0;

  if (wrapper && insideInlineLike && !insideLayout) {
    var currentNode = wrapper;
    var boundingRect = currentNode.getBoundingClientRect();
    offsetLeft = boundingRect.left - pmViewDom.getBoundingClientRect().left;
  }

  return offsetLeft;
}
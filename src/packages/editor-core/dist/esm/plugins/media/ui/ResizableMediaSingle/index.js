import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { findParentNodeOfTypeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { getMediaClient } from '@atlaskit/media-client';
import { calcPctFromPx, calcColumnsFromPx, wrappedLayouts } from '@atlaskit/editor-common/ui';
import { akEditorWideLayoutWidth } from '@atlaskit/editor-shared-styles';
import { wrapperStyle } from './styled';
import Resizer from '../../../../ui/Resizer';
import { snapTo, handleSides, imageAlignmentMap } from '../../../../ui/Resizer/utils';
import { calcMediaPxWidth } from '../../utils/media-single';
import { calculateSnapPoints } from '../../../../utils/rich-media-utils';

var ResizableMediaSingle = /*#__PURE__*/function (_React$Component) {
  _inherits(ResizableMediaSingle, _React$Component);

  var _super = _createSuper(ResizableMediaSingle);

  function ResizableMediaSingle() {
    var _this;

    _classCallCheck(this, ResizableMediaSingle);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      offsetLeft: calcOffsetLeft(_this.insideInlineLike, _this.insideLayout, _this.props.view.dom, undefined),
      // We default to true until we resolve the file type
      isVideoFile: true
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

      if (width <= akEditorWideLayoutWidth) {
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
      return calcMediaPxWidth({
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

      if (snapWidth > akEditorWideLayoutWidth) {
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

    _defineProperty(_assertThisInitialized(_this), "saveWrapper", function (wrapper) {
      return _this.wrapper = wrapper;
    });

    return _this;
  }

  _createClass(ResizableMediaSingle, [{
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
      return wrappedLayouts.indexOf(this.props.layout) > -1;
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var viewMediaClientConfig;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
      var _checkVideoFile = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(viewMediaClientConfig) {
        var $pos, mediaNode, mediaClient, state;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                mediaClient = getMediaClient(viewMediaClientConfig);
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
    key: "insideLayout",
    get: function get() {
      var $pos = this.$pos;

      if (!$pos) {
        return false;
      }

      var layoutColumn = this.props.view.state.schema.nodes.layoutColumn;
      return !!findParentNodeOfTypeClosestToPos($pos, [layoutColumn]);
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
      handleSides.forEach(function (side) {
        var oppositeSide = side === 'left' ? 'right' : 'left';
        enable[side] = ['full-width', 'wide', 'center'].concat("wrap-".concat(oppositeSide)).concat("align-".concat(imageAlignmentMap[oppositeSide])).indexOf(layout) > -1;

        if (side === 'left' && _this2.insideInlineLike) {
          enable[side] = false;
        }
      });
      var snapPointsProps = {
        $pos: this.$pos,
        akEditorWideLayoutWidth: akEditorWideLayoutWidth,
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
      return jsx("div", {
        ref: this.saveWrapper,
        css: wrapperStyle({
          layout: layout,
          isResized: !!pctWidth,
          containerWidth: containerWidth || origWidth,
          fullWidthMode: fullWidthMode
        })
      }, jsx(Resizer, _extends({}, this.props, {
        ratio: ratio,
        width: initialWidth,
        selected: selected,
        enable: enable,
        calcNewSize: this.calcNewSize,
        snapPoints: calculateSnapPoints(snapPointsProps),
        scaleFactor: !this.wrappedLayout && !this.insideInlineLike ? 2 : 1,
        highlights: this.highlights,
        nodeType: "media",
        dispatchAnalyticsEvent: this.props.dispatchAnalyticsEvent // when cursor is located below a media with caption,
        // press “Up“ key will result cursor focus on an invalid position, (on the resize handler)
        // This workaround adds an empty div inside the resize handler to prevent the issue.
        ,
        handleComponentFunc: function handleComponentFunc() {
          return jsx("div", {
            contentEditable: false
          });
        }
      }), children));
    }
  }]);

  return ResizableMediaSingle;
}(React.Component);

export { ResizableMediaSingle as default };
export function calcOffsetLeft(insideInlineLike, insideLayout, pmViewDom, wrapper) {
  var offsetLeft = 0;

  if (wrapper && insideInlineLike && !insideLayout) {
    var currentNode = wrapper;
    var boundingRect = currentNode.getBoundingClientRect();
    offsetLeft = boundingRect.left - pmViewDom.getBoundingClientRect().left;
  }

  return offsetLeft;
}
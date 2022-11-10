import _get from "@babel/runtime/helpers/get";
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

import React from 'react';
import { Card as SmartCard, EmbedResizeMessageListener } from '@atlaskit/smart-card';
import PropTypes from 'prop-types';
import rafSchedule from 'raf-schd';
import { Card } from './genericCard';
import { UnsupportedBlock, MediaSingle as RichMediaWrapper, findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { DEFAULT_EMBED_CARD_HEIGHT, DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import { SelectionBasedNodeView } from '../../../nodeviews/';
import { registerCard } from '../pm-plugins/actions';
import ResizableEmbedCard from '../ui/ResizableEmbedCard';
import { createDisplayGrid } from '../../../plugins/grid';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { floatingLayouts, isRichMediaInsideOfBlockNode } from '../../../utils/rich-media-utils';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
export var EmbedCardComponent = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(EmbedCardComponent, _React$PureComponent);

  var _super = _createSuper(EmbedCardComponent);

  function EmbedCardComponent() {
    var _this;

    _classCallCheck(this, EmbedCardComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "embedIframeRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "onClick", function () {});

    _defineProperty(_assertThisInitialized(_this), "state", {
      hasPreview: true
    });

    _defineProperty(_assertThisInitialized(_this), "getPosSafely", function () {
      var getPos = _this.props.getPos;

      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      try {
        return getPos();
      } catch (e) {// Can blow up in rare cases, when node has been removed.
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onResolve", function (data) {
      var view = _this.props.view;
      var title = data.title,
          url = data.url,
          aspectRatio = data.aspectRatio;
      var _this$props$node$attr = _this.props.node.attrs,
          originalHeight = _this$props$node$attr.originalHeight,
          originalWidth = _this$props$node$attr.originalWidth;

      if (aspectRatio && !originalHeight && !originalWidth) {
        // Assumption here is if ADF already have both height and width set,
        // we will going to use that later on in this class as aspectRatio
        // Most likely we dealing with an embed that received aspectRatio via onResolve previously
        // and now this information already stored in ADF.
        _this.setState({
          initialAspectRatio: aspectRatio
        });

        _this.saveOriginalDimensionsAttributes(DEFAULT_EMBED_CARD_HEIGHT, DEFAULT_EMBED_CARD_HEIGHT * aspectRatio);
      } // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview


      rafSchedule(function () {
        var pos = _this.getPosSafely();

        if (pos === undefined) {
          return;
        }

        return view.dispatch(registerCard({
          title: title,
          url: url,
          pos: pos
        })(view.state.tr));
      })();

      try {
        var cardContext = _this.context.contextAdapter ? _this.context.contextAdapter.card : undefined;
        var hasPreview = cardContext && cardContext.value.extractors.getPreview(url, _this.props.platform);

        if (!hasPreview) {
          _this.setState({
            hasPreview: false
          });
        }
      } catch (e) {}
    });

    _defineProperty(_assertThisInitialized(_this), "updateSize", function (pctWidth, layout) {
      var _this$props$view = _this.props.view,
          state = _this$props$view.state,
          dispatch = _this$props$view.dispatch;

      var pos = _this.getPosSafely();

      if (pos === undefined) {
        return;
      }

      var tr = state.tr.setNodeMarkup(pos, undefined, _objectSpread(_objectSpread({}, _this.props.node.attrs), {}, {
        width: pctWidth,
        layout: layout
      }));
      tr.setMeta('scrollIntoView', false);
      dispatch(tr);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "getLineLength", function (view, pos, originalLineLength) {
      if (typeof pos === 'number' && isRichMediaInsideOfBlockNode(view, pos)) {
        var $pos = view.state.doc.resolve(pos);
        var domNode = view.nodeDOM($pos.pos);

        if ($pos.nodeAfter && floatingLayouts.indexOf($pos.nodeAfter.attrs.layout) > -1 && domNode && domNode.parentElement) {
          return domNode.parentElement.offsetWidth;
        }

        if (domNode instanceof HTMLElement) {
          return domNode.offsetWidth;
        }
      }

      return originalLineLength;
    });

    _defineProperty(_assertThisInitialized(_this), "saveOriginalDimensionsAttributes", function (height, width) {
      var view = _this.props.view; // TODO: ED-15663
      // Please, do not copy or use this kind of code below
      // @ts-ignore

      var fakeTableResizePluginKey = {
        key: 'tableFlexiColumnResizing$',
        getState: function getState(state) {
          return state['tableFlexiColumnResizing$'];
        }
      };
      var fakeTableResizeState = fakeTableResizePluginKey.getState(view.state); // We are not updating ADF when this function fired while table is resizing.
      // Changing ADF in the middle of resize will break table resize plugin logic
      // (tables will be considered different at the end of the drag and cell size won't be stored)
      // But this is not a big problem, editor user will be seeing latest height anyway (via updated state)
      // And even if page to be saved with slightly outdated height, renderer is capable of reading latest height value
      // when embed loads, and so it won't be a problem.

      if (fakeTableResizeState !== null && fakeTableResizeState !== void 0 && fakeTableResizeState.dragging) {
        return;
      }

      rafSchedule(function () {
        var pos = _this.getPosSafely();

        if (pos === undefined) {
          return;
        }

        view.dispatch(view.state.tr.step(new SetAttrsStep(pos, {
          originalHeight: height,
          originalWidth: width
        })).setMeta('addToHistory', false));
      })();
    });

    _defineProperty(_assertThisInitialized(_this), "onHeightUpdate", function (height) {
      _this.setState({
        liveHeight: height
      });

      _this.saveOriginalDimensionsAttributes(height, undefined);
    });

    return _this;
  }

  _createClass(EmbedCardComponent, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      var view = this.props.view;
      var scrollContainer = findOverflowScrollParent(view.dom);
      this.scrollContainer = scrollContainer || undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          node = _this$props.node,
          cardContext = _this$props.cardContext,
          platform = _this$props.platform,
          allowResizing = _this$props.allowResizing,
          fullWidthMode = _this$props.fullWidthMode,
          view = _this$props.view,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          getPos = _this$props.getPos;
      var _node$attrs = node.attrs,
          url = _node$attrs.url,
          pctWidth = _node$attrs.width,
          layout = _node$attrs.layout,
          originalHeight = _node$attrs.originalHeight,
          originalWidth = _node$attrs.originalWidth;
      var _this$state = this.state,
          hasPreview = _this$state.hasPreview,
          liveHeight = _this$state.liveHeight,
          initialAspectRatio = _this$state.initialAspectRatio; // We don't want to use `originalHeight` when `originalWidth` also present,
      // since `heightAlone` is defined only when just height is available.

      var heightAlone = liveHeight !== null && liveHeight !== void 0 ? liveHeight : !originalWidth && originalHeight || undefined;
      var aspectRatio = !heightAlone && ( // No need getting aspectRatio if heightAlone defined already
      initialAspectRatio || // If we have initialAspectRatio (coming from iframely) we should go with that
      originalHeight && originalWidth && originalWidth / originalHeight) || // If ADF contains both width and height we get ratio from that
      undefined;
      var cardProps = {
        layout: layout,
        pctWidth: pctWidth,
        fullWidthMode: fullWidthMode
      };
      var cardInner = /*#__PURE__*/React.createElement(EmbedResizeMessageListener, {
        embedIframeRef: this.embedIframeRef,
        onHeightUpdate: this.onHeightUpdate
      }, /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: view,
        plugins: {
          widthState: widthPluginKey
        },
        render: function render(_ref) {
          var widthState = _ref.widthState;
          var widthStateLineLength = (widthState === null || widthState === void 0 ? void 0 : widthState.lineLength) || 0;
          var widthStateWidth = (widthState === null || widthState === void 0 ? void 0 : widthState.width) || 0;

          var pos = _this2.getPosSafely();

          if (pos === undefined) {
            return null;
          }

          var lineLength = _this2.getLineLength(view, pos, widthStateLineLength);

          var containerWidth = isRichMediaInsideOfBlockNode(view, pos) ? lineLength : widthStateWidth;
          var smartCard = /*#__PURE__*/React.createElement(SmartCard, {
            key: url,
            url: url,
            appearance: "embed",
            onClick: _this2.onClick,
            onResolve: _this2.onResolve,
            showActions: platform === 'web',
            isFrameVisible: true,
            inheritDimensions: true,
            platform: platform,
            container: _this2.scrollContainer,
            embedIframeRef: _this2.embedIframeRef
          });

          if (!allowResizing || !hasPreview) {
            // There are two ways `width` and `height` can be defined here:
            // 1) Either as `heightAlone` as height value and no width
            // 2) or as `1` for height and aspectRation (defined or a default one) as a width
            // See above for how aspectRation is calculated.
            var defaultAspectRatio = DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT;
            var richMediaWrapperHeight = 1;
            var richMediaWrapperWidth = aspectRatio || defaultAspectRatio;

            if (heightAlone) {
              richMediaWrapperHeight = heightAlone;
              richMediaWrapperWidth = undefined;
            }

            return /*#__PURE__*/React.createElement(RichMediaWrapper, _extends({}, cardProps, {
              height: richMediaWrapperHeight,
              width: richMediaWrapperWidth,
              nodeType: "embedCard",
              hasFallbackContainer: hasPreview,
              lineLength: lineLength,
              containerWidth: containerWidth
            }), smartCard);
          }

          return /*#__PURE__*/React.createElement(ResizableEmbedCard, _extends({}, cardProps, {
            height: heightAlone,
            aspectRatio: aspectRatio,
            view: _this2.props.view,
            getPos: getPos,
            lineLength: lineLength,
            gridSize: 12,
            containerWidth: containerWidth,
            displayGrid: createDisplayGrid(_this2.props.eventDispatcher),
            updateSize: _this2.updateSize,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          }), smartCard);
        }
      })); // [WS-2307]: we only render card wrapped into a Provider when the value is ready

      return /*#__PURE__*/React.createElement(React.Fragment, null, cardContext && cardContext.value ? /*#__PURE__*/React.createElement(cardContext.Provider, {
        value: cardContext.value
      }, cardInner) : null);
    }
  }]);

  return EmbedCardComponent;
}(React.PureComponent);

_defineProperty(EmbedCardComponent, "contextTypes", {
  contextAdapter: PropTypes.object
});

var WrappedBlockCard = Card(EmbedCardComponent, UnsupportedBlock);
export var EmbedCard = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  _inherits(EmbedCard, _SelectionBasedNodeVi);

  var _super2 = _createSuper(EmbedCard);

  function EmbedCard() {
    _classCallCheck(this, EmbedCard);

    return _super2.apply(this, arguments);
  }

  _createClass(EmbedCard, [{
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.node.attrs !== nextNode.attrs) {
        return true;
      }

      return _get(_getPrototypeOf(EmbedCard.prototype), "viewShouldUpdate", this).call(this, nextNode);
    }
  }, {
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('div');

      if (browser.chrome && this.reactComponentProps.platform !== 'mobile') {
        // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
        // see also: https://github.com/ProseMirror/prosemirror/issues/884
        domRef.contentEditable = 'true';
        domRef.setAttribute('spellcheck', 'false');
      }

      return domRef;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$reactComponentP = this.reactComponentProps,
          eventDispatcher = _this$reactComponentP.eventDispatcher,
          allowResizing = _this$reactComponentP.allowResizing,
          platform = _this$reactComponentP.platform,
          fullWidthMode = _this$reactComponentP.fullWidthMode,
          dispatchAnalyticsEvent = _this$reactComponentP.dispatchAnalyticsEvent;
      return /*#__PURE__*/React.createElement(WrappedBlockCard, {
        node: this.node,
        view: this.view,
        eventDispatcher: eventDispatcher,
        getPos: this.getPos,
        allowResizing: allowResizing,
        platform: platform,
        fullWidthMode: fullWidthMode,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent
      });
    }
  }]);

  return EmbedCard;
}(SelectionBasedNodeView);
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

import { withImageLoader } from '@atlaskit/editor-common/utils';
import { Card, CardLoading } from '@atlaskit/media-card';
import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import React, { Component } from 'react';
import { setNodeSelection, setTextSelection } from '../../../../utils';
import { stateKey as mediaStateKey } from '../../pm-plugins/plugin-key';
import { MediaCardWrapper } from '../styles';
// This is being used by DropPlaceholder now
export var MEDIA_HEIGHT = 125;
export var FILE_WIDTH = 156;
export var MediaNode = /*#__PURE__*/function (_Component) {
  _inherits(MediaNode, _Component);

  var _super = _createSuper(MediaNode);

  function MediaNode(_props) {
    var _this;

    _classCallCheck(this, MediaNode);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "setViewMediaClientConfig", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var mediaProvider, viewMediaClientConfig;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.props.mediaProvider;

            case 2:
              mediaProvider = _context.sent;

              if (mediaProvider) {
                viewMediaClientConfig = mediaProvider.viewMediaClientConfig;

                _this.setState({
                  viewMediaClientConfig: viewMediaClientConfig
                });
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(_assertThisInitialized(_this), "selectMediaSingleFromCard", function (_ref2) {
      var event = _ref2.event;

      _this.selectMediaSingle(event);
    });

    _defineProperty(_assertThisInitialized(_this), "selectMediaSingle", function (event) {
      // We need to call "stopPropagation" here in order to prevent the browser from navigating to
      // another URL if the media node is wrapped in a link mark.
      event.stopPropagation();

      var propPos = _this.props.getPos();

      var state = _this.props.view.state;

      if (event.shiftKey) {
        // don't select text if there is current selection in a table (as this would override selected cells)
        if (state.selection instanceof CellSelection) {
          return;
        }

        setTextSelection(_this.props.view, state.selection.from < propPos ? state.selection.from : propPos - 1, // + 3 needed for offset of the media inside mediaSingle and cursor to make whole mediaSingle selected
        state.selection.to > propPos ? state.selection.to : propPos + 2);
      } else {
        setNodeSelection(_this.props.view, propPos - 1);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onFullscreenChange", function (fullscreen) {
      _this.mediaPluginState.updateAndDispatch({
        isFullscreen: fullscreen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleNewNode", function (props) {
      var node = props.node;

      _this.mediaPluginState.handleMediaNodeMount(node, function () {
        return _this.props.getPos();
      });
    });

    var view = _this.props.view;
    _this.mediaPluginState = mediaStateKey.getState(view.state);
    return _this;
  }

  _createClass(MediaNode, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var hasNewViewMediaClientConfig = !this.state.viewMediaClientConfig && nextState.viewMediaClientConfig;

      if (this.props.selected !== nextProps.selected || this.props.node.attrs.id !== nextProps.node.attrs.id || this.props.node.attrs.collection !== nextProps.node.attrs.collection || this.props.maxDimensions.height !== nextProps.maxDimensions.height || this.props.maxDimensions.width !== nextProps.maxDimensions.width || this.props.contextIdentifierProvider !== nextProps.contextIdentifierProvider || this.props.isLoading !== nextProps.isLoading || this.props.mediaProvider !== nextProps.mediaProvider || hasNewViewMediaClientConfig) {
        return true;
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var contextIdentifierProvider;
        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.handleNewNode(this.props);
                contextIdentifierProvider = this.props.contextIdentifierProvider;
                _context2.t0 = this;
                _context2.next = 5;
                return contextIdentifierProvider;

              case 5:
                _context2.t1 = _context2.sent;
                _context2.t2 = {
                  contextIdentifierProvider: _context2.t1
                };

                _context2.t0.setState.call(_context2.t0, _context2.t2);

                _context2.next = 10;
                return this.setViewMediaClientConfig();

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var node = this.props.node;
      this.mediaPluginState.handleMediaNodeUnmount(node);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.node.attrs.id !== this.props.node.attrs.id) {
        this.mediaPluginState.handleMediaNodeUnmount(prevProps.node);
        this.handleNewNode(this.props);
      }

      this.mediaPluginState.updateElement();
      this.setViewMediaClientConfig();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          node = _this$props.node,
          selected = _this$props.selected,
          originalDimensions = _this$props.originalDimensions,
          isLoading = _this$props.isLoading,
          maxDimensions = _this$props.maxDimensions,
          mediaOptions = _this$props.mediaOptions;
      var _this$state = this.state,
          viewMediaClientConfig = _this$state.viewMediaClientConfig,
          contextIdentifierProvider = _this$state.contextIdentifierProvider;
      var _node$attrs = node.attrs,
          id = _node$attrs.id,
          type = _node$attrs.type,
          collection = _node$attrs.collection,
          url = _node$attrs.url,
          alt = _node$attrs.alt;

      if (isLoading || type !== 'external' && !viewMediaClientConfig) {
        return /*#__PURE__*/React.createElement(MediaCardWrapper, {
          dimensions: originalDimensions
        }, /*#__PURE__*/React.createElement(CardLoading, null));
      }

      var contextId = contextIdentifierProvider && contextIdentifierProvider.objectId;
      var identifier = type === 'external' ? {
        dataURI: url,
        name: url,
        mediaItemType: 'external-image'
      } : {
        id: id,
        mediaItemType: 'file',
        collectionName: collection
      }; // mediaClientConfig is not needed for "external" case. So we have to cheat here.
      // there is a possibility mediaClientConfig will be part of a identifier,
      // so this might be not an issue

      var mediaClientConfig = viewMediaClientConfig || {
        authProvider: function authProvider() {
          return {};
        }
      };
      return /*#__PURE__*/React.createElement(MediaCardWrapper, {
        dimensions: originalDimensions,
        onContextMenu: this.selectMediaSingle
      }, /*#__PURE__*/React.createElement(Card, {
        mediaClientConfig: mediaClientConfig,
        resizeMode: "stretchy-fit",
        dimensions: maxDimensions,
        originalDimensions: originalDimensions,
        identifier: identifier,
        selectable: true,
        selected: selected,
        disableOverlay: true,
        onFullscreenChange: this.onFullscreenChange,
        onClick: this.selectMediaSingleFromCard,
        useInlinePlayer: mediaOptions && mediaOptions.allowLazyLoading,
        isLazy: mediaOptions && mediaOptions.allowLazyLoading,
        featureFlags: mediaOptions && mediaOptions.featureFlags,
        contextId: contextId,
        alt: alt
      }));
    }
  }]);

  return MediaNode;
}(Component);
export default withImageLoader(MediaNode);
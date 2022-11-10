import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React, { useEffect, useState } from 'react';
import { SelectionBasedNodeView } from '../../../nodeviews/';
import WithPluginState from '../../../ui/WithPluginState';
import { MediaInlineCard } from '@atlaskit/media-card';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { MediaInlineNodeSelector } from './styles';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
export var createMediaNodeUpdater = function createMediaNodeUpdater(props) {
  var node = props.node;
  return new MediaNodeUpdater(_objectSpread(_objectSpread({}, props), {}, {
    isMediaSingle: true,
    node: node ? node : props.node,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    contextIdentifierProvider: props.contextIdentifierProvider
  }));
};
/**
 * Handles updating the media inline node attributes
 * but also handling copy-paste for cross-editor of the same instance
 * using the contextid
 *
 */

export var updateMediaNodeAttributes = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(props) {
    var mediaNodeUpdater, addPendingTask, node, contextId, hasDifferentContextId, copyNode;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            mediaNodeUpdater = createMediaNodeUpdater(props);
            addPendingTask = props.mediaPluginState.addPendingTask;
            node = props.node;

            if (node) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return");

          case 5:
            contextId = mediaNodeUpdater.getNodeContextId();

            if (contextId) {
              _context.next = 9;
              break;
            }

            _context.next = 9;
            return mediaNodeUpdater.updateContextId();

          case 9:
            _context.next = 11;
            return mediaNodeUpdater.hasDifferentContextId();

          case 11:
            hasDifferentContextId = _context.sent;

            if (!hasDifferentContextId) {
              _context.next = 23;
              break;
            }

            _context.prev = 13;
            copyNode = mediaNodeUpdater.copyNode();
            addPendingTask(copyNode);
            _context.next = 18;
            return copyNode;

          case 18:
            _context.next = 23;
            break;

          case 20:
            _context.prev = 20;
            _context.t0 = _context["catch"](13);
            return _context.abrupt("return");

          case 23:
            _context.next = 25;
            return mediaNodeUpdater.updateFileAttrs();

          case 25:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[13, 20]]);
  }));

  return function updateMediaNodeAttributes(_x) {
    return _ref.apply(this, arguments);
  };
}();
export var handleNewNode = function handleNewNode(props) {
  var node = props.node,
      mediaPluginState = props.mediaPluginState,
      getPos = props.getPos;
  mediaPluginState.handleMediaNodeMount(node, function () {
    return getPos();
  });
};
export var MediaInline = function MediaInline(props) {
  var _useState = useState(),
      _useState2 = _slicedToArray(_useState, 2),
      viewMediaClientConfig = _useState2[0],
      setViewMediaClientConfig = _useState2[1];

  useEffect(function () {
    handleNewNode(props);
    updateMediaNodeAttributes(props);
    updateViewMediaClientConfig(props);
    return function () {
      var mediaPluginState = props.mediaPluginState;
      mediaPluginState.handleMediaNodeUnmount(props.node);
    };
  }, [props]);

  var updateViewMediaClientConfig = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(props) {
      var mediaProvider, _viewMediaClientConfig;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return props.mediaProvider;

            case 2:
              mediaProvider = _context2.sent;

              if (mediaProvider) {
                _viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
                setViewMediaClientConfig(_viewMediaClientConfig);
              }

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function updateViewMediaClientConfig(_x2) {
      return _ref2.apply(this, arguments);
    };
  }();

  var _props$node$attrs = props.node.attrs,
      id = _props$node$attrs.id,
      collection = _props$node$attrs.collection;
  var identifier = {
    id: id,
    mediaItemType: 'file',
    collectionName: collection
  };
  /*
   * Only show the loading view if the media provider is not ready
   * prevents calling the media API before the provider is ready
   */

  if (!viewMediaClientConfig) {
    return /*#__PURE__*/React.createElement(MediaInlineCardLoadingView, {
      message: "",
      isSelected: false
    });
  }

  return /*#__PURE__*/React.createElement(MediaInlineCard, {
    isSelected: props.isSelected,
    identifier: identifier,
    mediaClientConfig: viewMediaClientConfig
  });
};
export var MediaInlineNodeView = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  _inherits(MediaInlineNodeView, _SelectionBasedNodeVi);

  var _super = _createSuper(MediaInlineNodeView);

  function MediaInlineNodeView() {
    _classCallCheck(this, MediaInlineNodeView);

    return _super.apply(this, arguments);
  }

  _createClass(MediaInlineNodeView, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('span');
      domRef.contentEditable = 'false';
      return domRef;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('span');
      dom.classList.add(MediaInlineNodeSelector);
      return {
        dom: dom
      };
    }
  }, {
    key: "ignoreMutation",
    value: function ignoreMutation() {
      return true;
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.node.attrs !== nextNode.attrs) {
        return true;
      }

      return _get(_getPrototypeOf(MediaInlineNodeView.prototype), "viewShouldUpdate", this).call(this, nextNode);
    }
  }, {
    key: "render",
    value: function render(props) {
      var _this = this;

      var providerFactory = props.providerFactory;
      var getPos = this.getPos;
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref3) {
          var mediaProvider = _ref3.mediaProvider,
              contextIdentifierProvider = _ref3.contextIdentifierProvider;

          if (!mediaProvider) {
            return null;
          }

          return /*#__PURE__*/React.createElement(WithPluginState, {
            editorView: _this.view,
            plugins: {
              mediaPluginState: mediaStateKey
            },
            render: function render(_ref4) {
              var mediaPluginState = _ref4.mediaPluginState;

              if (!mediaPluginState) {
                return null;
              }

              return /*#__PURE__*/React.createElement(MediaInline, {
                identifier: _this.node.attrs.id,
                mediaProvider: mediaProvider,
                mediaPluginState: mediaPluginState,
                node: _this.node,
                isSelected: _this.nodeInsideSelection(),
                view: _this.view,
                getPos: getPos,
                contextIdentifierProvider: contextIdentifierProvider
              });
            }
          });
        }
      });
    }
  }]);

  return MediaInlineNodeView;
}(SelectionBasedNodeView);
export var ReactMediaInlineNode = function ReactMediaInlineNode(portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent) {
  return function (node, view, getPos) {
    return new MediaInlineNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent
    }).init();
  };
};
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import React from 'react';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import WithPluginState from '../../../ui/WithPluginState';
import { setNodeSelection } from '../../../utils';
import { isNodeSelectedOrInRange, SelectedState } from '../../../utils/nodes';
import { pluginKey as editorDisabledPluginKey } from '../../editor-disabled';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';

var isMediaGroupSelectedFromProps = function isMediaGroupSelectedFromProps(props) {
  return isNodeSelectedOrInRange(props.anchorPos, props.headPos, props.getPos(), props.node.nodeSize);
};

var hasSelectionChanged = function hasSelectionChanged(oldProps, newProps) {
  if (isMediaGroupSelectedFromProps(oldProps) !== isMediaGroupSelectedFromProps(newProps)) {
    return true;
  }

  if (isMediaGroupSelectedFromProps(newProps) === SelectedState.selectedInside) {
    return oldProps.anchorPos !== newProps.anchorPos;
  }

  return false;
};

var MediaGroup = /*#__PURE__*/function (_React$Component) {
  _inherits(MediaGroup, _React$Component);

  var _super = _createSuper(MediaGroup);

  function MediaGroup(_props) {
    var _this;

    _classCallCheck(this, MediaGroup);

    _this = _super.call(this, _props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      viewMediaClientConfig: undefined
    });

    _defineProperty(_assertThisInitialized(_this), "updateNodeAttrs", function (props) {
      var view = props.view,
          mediaProvider = props.mediaProvider,
          contextIdentifierProvider = props.contextIdentifierProvider;

      _this.mediaNodes.forEach(function (node) {
        var mediaNodeUpdater = new MediaNodeUpdater({
          view: view,
          mediaProvider: mediaProvider,
          contextIdentifierProvider: contextIdentifierProvider,
          node: node,
          isMediaSingle: false
        });
        mediaNodeUpdater.updateFileAttrs(false);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "setMediaItems", function (props) {
      var node = props.node;
      var oldMediaNodes = _this.mediaNodes;
      _this.mediaNodes = [];
      node.forEach(function (item, childOffset) {
        _this.mediaPluginState.mediaGroupNodes[item.attrs.id] = {
          node: item,
          getPos: function getPos() {
            return props.getPos() + childOffset + 1;
          }
        };

        _this.mediaNodes.push(item);
      });

      _this.mediaPluginState.handleMediaGroupUpdate(oldMediaNodes, _this.mediaNodes);
    });

    _defineProperty(_assertThisInitialized(_this), "getIdentifier", function (item) {
      if (item.attrs.type === 'external') {
        return {
          mediaItemType: 'external-image',
          dataURI: item.attrs.url
        };
      }

      return {
        id: item.attrs.id,
        mediaItemType: 'file',
        collectionName: item.attrs.collection
      };
    });

    _defineProperty(_assertThisInitialized(_this), "isNodeSelected", function (nodePos) {
      var selected = isMediaGroupSelectedFromProps(_this.props);

      if (selected === SelectedState.selectedInRange) {
        return true;
      }

      if (selected === SelectedState.selectedInside && _this.props.anchorPos === nodePos) {
        return true;
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "renderChildNodes", function () {
      var viewMediaClientConfig = _this.state.viewMediaClientConfig;
      var _this$props = _this.props,
          getPos = _this$props.getPos,
          allowLazyLoading = _this$props.allowLazyLoading,
          disabled = _this$props.disabled,
          mediaOptions = _this$props.mediaOptions;

      var items = _this.mediaNodes.map(function (item, idx) {
        // We declared this to get a fresh position every time
        var getNodePos = function getNodePos() {
          return getPos() + idx + 1;
        }; // Media Inline creates a floating toolbar with the same options, excludes these options if enabled


        var mediaInlineOptions = function mediaInlineOptions() {
          var allowMediaInline = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

          if (!allowMediaInline) {
            return {
              shouldEnableDownloadButton: mediaOptions.enableDownloadButton,
              actions: [{
                handler: disabled ? function () {} : _this.mediaPluginState.handleMediaNodeRemoval.bind(null, undefined, getNodePos),
                icon: /*#__PURE__*/React.createElement(EditorCloseIcon, {
                  label: _this.props.intl.formatMessage(messages.mediaGroupDeleteLabel)
                })
              }]
            };
          }
        };

        return _objectSpread({
          identifier: _this.getIdentifier(item),
          isLazy: allowLazyLoading,
          selected: _this.isNodeSelected(getNodePos()),
          onClick: function onClick() {
            setNodeSelection(_this.props.view, getNodePos());
          }
        }, mediaInlineOptions(getMediaFeatureFlag('mediaInline', mediaOptions.featureFlags)));
      });

      return /*#__PURE__*/React.createElement(Filmstrip, {
        items: items,
        mediaClientConfig: viewMediaClientConfig,
        featureFlags: mediaOptions.featureFlags
      });
    });

    _this.mediaNodes = [];
    _this.mediaPluginState = mediaStateKey.getState(_props.view.state);

    _this.setMediaItems(_props);

    _this.state = {
      viewMediaClientConfig: undefined
    };
    return _this;
  }

  _createClass(MediaGroup, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      this.updateMediaClientConfig();
      this.mediaNodes.forEach( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(node) {
          var _this2$props, view, mediaProvider, contextIdentifierProvider, mediaNodeUpdater, contextId, hasDifferentContextId;

          return _regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(node.attrs.type === 'external')) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return");

                case 2:
                  _this2$props = _this2.props, view = _this2$props.view, mediaProvider = _this2$props.mediaProvider, contextIdentifierProvider = _this2$props.contextIdentifierProvider;
                  mediaNodeUpdater = new MediaNodeUpdater({
                    view: view,
                    mediaProvider: mediaProvider,
                    contextIdentifierProvider: contextIdentifierProvider,
                    node: node,
                    isMediaSingle: false
                  });
                  contextId = mediaNodeUpdater.getNodeContextId();

                  if (contextId) {
                    _context.next = 8;
                    break;
                  }

                  _context.next = 8;
                  return mediaNodeUpdater.updateContextId();

                case 8:
                  _context.next = 10;
                  return mediaNodeUpdater.hasDifferentContextId();

                case 10:
                  hasDifferentContextId = _context.sent;

                  if (!hasDifferentContextId) {
                    _context.next = 14;
                    break;
                  }

                  _context.next = 14;
                  return mediaNodeUpdater.copyNode();

                case 14:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mediaPluginState.handleMediaGroupUpdate(this.mediaNodes, []);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(props) {
      this.updateMediaClientConfig();
      this.setMediaItems(props);

      if (props.isCopyPasteEnabled !== false) {
        this.updateNodeAttrs(props);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (hasSelectionChanged(this.props, nextProps) || this.props.node !== nextProps.node || this.state.viewMediaClientConfig !== this.mediaPluginState.mediaClientConfig) {
        return true;
      }

      return false;
    }
  }, {
    key: "updateMediaClientConfig",
    value: function updateMediaClientConfig() {
      var viewMediaClientConfig = this.state.viewMediaClientConfig;
      var mediaClientConfig = this.mediaPluginState.mediaClientConfig;

      if (!viewMediaClientConfig && mediaClientConfig) {
        this.setState({
          viewMediaClientConfig: mediaClientConfig
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return this.renderChildNodes();
    }
  }]);

  return MediaGroup;
}(React.Component);

_defineProperty(MediaGroup, "displayName", 'MediaGroup');

var IntlMediaGroup = injectIntl(MediaGroup);
export default IntlMediaGroup;

var MediaGroupNodeView = /*#__PURE__*/function (_ReactNodeView) {
  _inherits(MediaGroupNodeView, _ReactNodeView);

  var _super2 = _createSuper(MediaGroupNodeView);

  function MediaGroupNodeView() {
    _classCallCheck(this, MediaGroupNodeView);

    return _super2.apply(this, arguments);
  }

  _createClass(MediaGroupNodeView, [{
    key: "render",
    value: function render(props, forwardRef) {
      var _this3 = this;

      var providerFactory = props.providerFactory,
          mediaOptions = props.mediaOptions;
      var getPos = this.getPos;
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref2) {
          var mediaProvider = _ref2.mediaProvider,
              contextIdentifierProvider = _ref2.contextIdentifierProvider;

          var renderFn = function renderFn(_ref3) {
            var editorDisabledPlugin = _ref3.editorDisabledPlugin;

            if (!mediaProvider) {
              return null;
            }

            return /*#__PURE__*/React.createElement(IntlMediaGroup, {
              node: _this3.node,
              getPos: getPos,
              view: _this3.view,
              forwardRef: forwardRef,
              disabled: (editorDisabledPlugin || {}).editorDisabled,
              allowLazyLoading: mediaOptions.allowLazyLoading,
              mediaProvider: mediaProvider,
              contextIdentifierProvider: contextIdentifierProvider,
              isCopyPasteEnabled: mediaOptions.isCopyPasteEnabled,
              anchorPos: _this3.view.state.selection.$anchor.pos,
              headPos: _this3.view.state.selection.$head.pos,
              mediaOptions: mediaOptions
            });
          };

          return /*#__PURE__*/React.createElement(WithPluginState, {
            editorView: _this3.view,
            plugins: {
              reactNodeViewState: reactNodeViewStateKey,
              editorDisabledPlugin: editorDisabledPluginKey
            },
            render: renderFn
          });
        }
      });
    }
  }]);

  return MediaGroupNodeView;
}(ReactNodeView);

export var ReactMediaGroupNode = function ReactMediaGroupNode(portalProviderAPI, eventDispatcher, providerFactory) {
  var mediaOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory,
      mediaOptions: mediaOptions
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
};
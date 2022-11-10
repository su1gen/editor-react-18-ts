import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _get from "@babel/runtime/helpers/get";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { NodeSelection } from 'prosemirror-state';
import React from 'react';
import { SelectionBasedNodeView } from '../../../../nodeviews';
import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../../width';
import MediaNode from './media';
import { getAttrsFromUrl } from '@atlaskit/media-client';
import { isMediaBlobUrlFromAttrs } from '../../utils/media-common';

var MediaNodeView = /*#__PURE__*/function (_SelectionBasedNodeVi) {
  _inherits(MediaNodeView, _SelectionBasedNodeVi);

  var _super = _createSuper(MediaNodeView);

  function MediaNodeView() {
    var _this;

    _classCallCheck(this, MediaNodeView);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "renderMediaNodeWithState", function (mediaProvider, contextIdentifierProvider) {
      return function (_ref) {
        var editorWidth = _ref.width;
        var getPos = _this.getPos;
        var mediaOptions = _this.reactComponentProps.mediaOptions;
        var selection = _this.view.state.selection;

        var isSelected = function isSelected() {
          return _this.isNodeInsideSelection(selection.from, selection.to) || selection instanceof NodeSelection && selection.from === getPos();
        };

        var attrs = _this.getAttrs();

        var url = attrs.type === 'external' ? attrs.url : '';
        var width = attrs.width,
            height = attrs.height;

        if (_this.isMediaBlobUrl()) {
          var urlAttrs = getAttrsFromUrl(url);

          if (urlAttrs) {
            var urlWidth = urlAttrs.width,
                urlHeight = urlAttrs.height;
            width = width || urlWidth;
            height = height || urlHeight;
          }
        }

        width = width || DEFAULT_IMAGE_WIDTH;
        height = height || DEFAULT_IMAGE_HEIGHT;
        var maxDimensions = {
          width: "".concat(editorWidth.width, "px"),
          height: "".concat(height / width * editorWidth.width, "px")
        };
        var originalDimensions = {
          width: width,
          height: height
        };
        return /*#__PURE__*/React.createElement(MediaNode, {
          view: _this.view,
          node: _this.node,
          getPos: getPos,
          selected: isSelected(),
          originalDimensions: originalDimensions,
          maxDimensions: maxDimensions,
          url: url,
          mediaProvider: mediaProvider,
          contextIdentifierProvider: contextIdentifierProvider,
          mediaOptions: mediaOptions
        });
      };
    });

    _defineProperty(_assertThisInitialized(_this), "renderMediaNodeWithProviders", function (_ref2) {
      var mediaProvider = _ref2.mediaProvider,
          contextIdentifierProvider = _ref2.contextIdentifierProvider;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: _this.view,
        plugins: {
          width: widthPluginKey
        },
        render: _this.renderMediaNodeWithState(mediaProvider, contextIdentifierProvider)
      });
    });

    return _this;
  }

  _createClass(MediaNodeView, [{
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('div');

      if (browser.chrome && this.reactComponentProps.mediaOptions && this.reactComponentProps.mediaOptions.allowMediaSingleEditable) {
        // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
        // see also: https://github.com/ProseMirror/prosemirror/issues/884
        domRef.contentEditable = 'true';
      }

      return domRef;
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      if (this.node.attrs !== nextNode.attrs) {
        return true;
      }

      return _get(_getPrototypeOf(MediaNodeView.prototype), "viewShouldUpdate", this).call(this, nextNode);
    }
  }, {
    key: "stopEvent",
    value: function stopEvent(event) {
      // Don't trap right click events on media node
      if (['mousedown', 'contextmenu'].indexOf(event.type) !== -1) {
        var mouseEvent = event;

        if (mouseEvent.button === 2) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "getAttrs",
    value: function getAttrs() {
      var attrs = this.node.attrs;
      return attrs;
    }
  }, {
    key: "isMediaBlobUrl",
    value: function isMediaBlobUrl() {
      var attrs = this.getAttrs();
      return isMediaBlobUrlFromAttrs(attrs);
    }
  }, {
    key: "render",
    value: function render() {
      var providerFactory = this.reactComponentProps.providerFactory;
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['mediaProvider', 'contextIdentifierProvider'],
        providerFactory: providerFactory,
        renderNode: this.renderMediaNodeWithProviders
      });
    }
  }]);

  return MediaNodeView;
}(SelectionBasedNodeView);

export var ReactMediaNode = function ReactMediaNode(portalProviderAPI, eventDispatcher, providerFactory) {
  var mediaOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new MediaNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
      eventDispatcher: eventDispatcher,
      providerFactory: providerFactory,
      mediaOptions: mediaOptions
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
};
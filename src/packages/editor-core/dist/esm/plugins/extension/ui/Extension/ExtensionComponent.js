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

import React from 'react';
import { Component } from 'react';
import memoizeOne from 'memoize-one';
import { getNodeRenderer, getExtensionModuleNodePrivateProps } from '@atlaskit/editor-common/extensions';
import { getExtensionRenderer } from '@atlaskit/editor-common/utils';
import Extension from './Extension';
import InlineExtension from './InlineExtension';

var ExtensionComponent = /*#__PURE__*/function (_Component) {
  _inherits(ExtensionComponent, _Component);

  var _super = _createSuper(ExtensionComponent);

  function ExtensionComponent() {
    var _this;

    _classCallCheck(this, ExtensionComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "privatePropsParsed", false);

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "mounted", false);

    _defineProperty(_assertThisInitialized(_this), "getNodeRenderer", memoizeOne(getNodeRenderer));

    _defineProperty(_assertThisInitialized(_this), "getExtensionModuleNodePrivateProps", memoizeOne(getExtensionModuleNodePrivateProps));

    _defineProperty(_assertThisInitialized(_this), "setStateFromPromise", function (stateKey, promise) {
      promise && promise.then(function (p) {
        if (!_this.mounted) {
          return;
        }

        _this.setState(_defineProperty({}, stateKey, p));
      });
    });

    _defineProperty(_assertThisInitialized(_this), "parsePrivateNodePropsIfNeeded", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _this$props$node$attr, extensionType, extensionKey, privateProps;

      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(_this.privatePropsParsed || !_this.state.extensionProvider)) {
                _context.next = 2;
                break;
              }

              return _context.abrupt("return");

            case 2:
              _this.privatePropsParsed = true;
              _this$props$node$attr = _this.props.node.attrs, extensionType = _this$props$node$attr.extensionType, extensionKey = _this$props$node$attr.extensionKey;
              /**
               * getExtensionModuleNodePrivateProps can throw if there are issues in the
               * manifest
               */

              _context.prev = 4;
              _context.next = 7;
              return _this.getExtensionModuleNodePrivateProps(_this.state.extensionProvider, extensionType, extensionKey);

            case 7:
              privateProps = _context.sent;

              _this.setState({
                _privateProps: privateProps
              });

              _context.next = 14;
              break;

            case 11:
              _context.prev = 11;
              _context.t0 = _context["catch"](4);
              // eslint-disable-next-line no-console
              console.error('Provided extension handler has thrown an error\n', _context.t0);
              /** We don't want this error to block renderer */

              /** We keep rendering the default content */

            case 14:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 11]]);
    })));

    _defineProperty(_assertThisInitialized(_this), "handleExtension", function (pmNode) {
      var _pmNode$marks, _pmNode$marks$find, _pmNode$marks$find$at;

      var _this$props = _this.props,
          extensionHandlers = _this$props.extensionHandlers,
          editorView = _this$props.editorView;
      var _pmNode$attrs = pmNode.attrs,
          extensionType = _pmNode$attrs.extensionType,
          extensionKey = _pmNode$attrs.extensionKey,
          parameters = _pmNode$attrs.parameters,
          text = _pmNode$attrs.text;
      var isBodiedExtension = pmNode.type.name === 'bodiedExtension';

      if (isBodiedExtension) {
        return;
      }

      var fragmentLocalId = pmNode === null || pmNode === void 0 ? void 0 : (_pmNode$marks = pmNode.marks) === null || _pmNode$marks === void 0 ? void 0 : (_pmNode$marks$find = _pmNode$marks.find(function (m) {
        return m.type.name === 'fragment';
      })) === null || _pmNode$marks$find === void 0 ? void 0 : (_pmNode$marks$find$at = _pmNode$marks$find.attrs) === null || _pmNode$marks$find$at === void 0 ? void 0 : _pmNode$marks$find$at.localId;
      var node = {
        type: pmNode.type.name,
        extensionType: extensionType,
        extensionKey: extensionKey,
        parameters: parameters,
        content: text,
        localId: pmNode.attrs.localId,
        fragmentLocalId: fragmentLocalId
      };
      var result;

      if (extensionHandlers && extensionHandlers[extensionType]) {
        var render = getExtensionRenderer(extensionHandlers[extensionType]);
        result = render(node, editorView.state.doc);
      }

      if (!result) {
        var extensionHandlerFromProvider = _this.state.extensionProvider && _this.getNodeRenderer(_this.state.extensionProvider, extensionType, extensionKey);

        if (extensionHandlerFromProvider) {
          var NodeRenderer = extensionHandlerFromProvider;
          return /*#__PURE__*/React.createElement(NodeRenderer, {
            node: node,
            references: _this.props.references
          });
        }
      }

      return result;
    });

    return _this;
  }

  _createClass(ExtensionComponent, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.mounted = true;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var extensionProvider = this.props.extensionProvider;

      if (extensionProvider) {
        this.setStateFromPromise('extensionProvider', extensionProvider);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.parsePrivateNodePropsIfNeeded();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      var extensionProvider = nextProps.extensionProvider;

      if (extensionProvider && this.props.extensionProvider !== extensionProvider) {
        this.setStateFromPromise('extensionProvider', extensionProvider);
      }
    } // memoized to avoid rerender on extension state changes

  }, {
    key: "render",
    value: function render() {
      var _this$state$_privateP;

      var _this$props2 = this.props,
          node = _this$props2.node,
          handleContentDOMRef = _this$props2.handleContentDOMRef,
          editorView = _this$props2.editorView,
          references = _this$props2.references,
          editorAppearance = _this$props2.editorAppearance;
      var extensionHandlerResult = this.tryExtensionHandler();

      switch (node.type.name) {
        case 'extension':
        case 'bodiedExtension':
          return /*#__PURE__*/React.createElement(Extension, {
            node: node,
            getPos: this.props.getPos,
            references: references,
            extensionProvider: this.state.extensionProvider,
            handleContentDOMRef: handleContentDOMRef,
            view: editorView,
            editorAppearance: editorAppearance,
            hideFrame: (_this$state$_privateP = this.state._privateProps) === null || _this$state$_privateP === void 0 ? void 0 : _this$state$_privateP.__hideFrame
          }, extensionHandlerResult);

        case 'inlineExtension':
          return /*#__PURE__*/React.createElement(InlineExtension, {
            node: node
          }, extensionHandlerResult);

        default:
          return null;
      }
    }
  }, {
    key: "tryExtensionHandler",
    value: function tryExtensionHandler() {
      var node = this.props.node;

      try {
        var extensionContent = this.handleExtension(node);

        if (extensionContent && /*#__PURE__*/React.isValidElement(extensionContent)) {
          return extensionContent;
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Provided extension handler has thrown an error\n', e);
        /** We don't want this error to block renderer */

        /** We keep rendering the default content */
      }

      return null;
    }
  }]);

  return ExtensionComponent;
}(Component);

export { ExtensionComponent as default };
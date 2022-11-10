"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _extensions = require("@atlaskit/editor-common/extensions");

var _utils = require("@atlaskit/editor-common/utils");

var _Extension = _interopRequireDefault(require("./Extension"));

var _InlineExtension = _interopRequireDefault(require("./InlineExtension"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ExtensionComponent = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(ExtensionComponent, _Component);

  var _super = _createSuper(ExtensionComponent);

  function ExtensionComponent() {
    var _this;

    (0, _classCallCheck2.default)(this, ExtensionComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "privatePropsParsed", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "mounted", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getNodeRenderer", (0, _memoizeOne.default)(_extensions.getNodeRenderer));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getExtensionModuleNodePrivateProps", (0, _memoizeOne.default)(_extensions.getExtensionModuleNodePrivateProps));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setStateFromPromise", function (stateKey, promise) {
      promise && promise.then(function (p) {
        if (!_this.mounted) {
          return;
        }

        _this.setState((0, _defineProperty2.default)({}, stateKey, p));
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "parsePrivateNodePropsIfNeeded", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
      var _this$props$node$attr, extensionType, extensionKey, privateProps;

      return _regenerator.default.wrap(function _callee$(_context) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleExtension", function (pmNode) {
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
        var render = (0, _utils.getExtensionRenderer)(extensionHandlers[extensionType]);
        result = render(node, editorView.state.doc);
      }

      if (!result) {
        var extensionHandlerFromProvider = _this.state.extensionProvider && _this.getNodeRenderer(_this.state.extensionProvider, extensionType, extensionKey);

        if (extensionHandlerFromProvider) {
          var NodeRenderer = extensionHandlerFromProvider;
          return /*#__PURE__*/_react.default.createElement(NodeRenderer, {
            node: node,
            references: _this.props.references
          });
        }
      }

      return result;
    });
    return _this;
  }

  (0, _createClass2.default)(ExtensionComponent, [{
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
          return /*#__PURE__*/_react.default.createElement(_Extension.default, {
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
          return /*#__PURE__*/_react.default.createElement(_InlineExtension.default, {
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

        if (extensionContent && /*#__PURE__*/_react.default.isValidElement(extensionContent)) {
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
}(_react.Component);

exports.default = ExtensionComponent;
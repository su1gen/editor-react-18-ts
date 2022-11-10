"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HyperlinkToolbarAppearance = void 0;

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

var _LinkToolbarAppearance = require("../card/ui/LinkToolbarAppearance");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var HyperlinkToolbarAppearance = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(HyperlinkToolbarAppearance, _Component);

  var _super = _createSuper(HyperlinkToolbarAppearance);

  function HyperlinkToolbarAppearance() {
    var _this;

    (0, _classCallCheck2.default)(this, HyperlinkToolbarAppearance);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      supportedUrlsMap: new Map()
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getProvider", /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
      return _regenerator.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!_this.cardProvider) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt("return", _this.cardProvider);

            case 2:
              return _context2.abrupt("return", new Promise(function (resolve) {
                var providerFactory = _this.props.providerFactory;
                providerFactory.subscribe('cardProvider', /*#__PURE__*/function () {
                  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_, cardProvider) {
                    return _regenerator.default.wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            if (cardProvider) {
                              _context.next = 2;
                              break;
                            }

                            return _context.abrupt("return");

                          case 2:
                            _context.next = 4;
                            return cardProvider;

                          case 4:
                            _this.cardProvider = _context.sent;
                            resolve(_this.cardProvider);

                          case 6:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee);
                  }));

                  return function (_x, _x2) {
                    return _ref2.apply(this, arguments);
                  };
                }());
              }));

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "resolveUrl", /*#__PURE__*/function () {
      var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(url) {
        var supportedUrlsMap, isUrlSupported, provider;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                supportedUrlsMap = _this.state.supportedUrlsMap;

                if (!supportedUrlsMap.has(url)) {
                  _context3.next = 3;
                  break;
                }

                return _context3.abrupt("return");

              case 3:
                isUrlSupported = false;
                _context3.prev = 4;
                _context3.next = 7;
                return _this.getProvider();

              case 7:
                provider = _context3.sent;
                _context3.next = 10;
                return provider.findPattern(url);

              case 10:
                isUrlSupported = _context3.sent;
                _context3.next = 16;
                break;

              case 13:
                _context3.prev = 13;
                _context3.t0 = _context3["catch"](4);
                isUrlSupported = false;

              case 16:
                supportedUrlsMap.set(url, isUrlSupported);

                _this.setState({
                  supportedUrlsMap: supportedUrlsMap
                });

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[4, 13]]);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "componentDidMount", function () {
      return _this.resolveUrl(_this.props.url);
    });
    return _this;
  }

  (0, _createClass2.default)(HyperlinkToolbarAppearance, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: // needed so we display the right state on the Toolbar while the same Toolbar
    // instance is visible and we click other link
    function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.url !== this.props.url) {
        this.resolveUrl(nextProps.url);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          url = _this$props.url,
          intl = _this$props.intl,
          editorView = _this$props.editorView,
          editorState = _this$props.editorState,
          cardOptions = _this$props.cardOptions,
          platform = _this$props.platform;
      var supportedUrlsMap = this.state.supportedUrlsMap;

      if (!supportedUrlsMap.get(url)) {
        return null;
      }

      return /*#__PURE__*/_react.default.createElement(_LinkToolbarAppearance.LinkToolbarAppearance, {
        key: "link-appearance",
        url: url,
        intl: intl,
        editorView: editorView,
        editorState: editorState,
        allowEmbeds: cardOptions === null || cardOptions === void 0 ? void 0 : cardOptions.allowEmbeds,
        platform: platform
      });
    }
  }]);
  return HyperlinkToolbarAppearance;
}(_react.Component);

exports.HyperlinkToolbarAppearance = HyperlinkToolbarAppearance;
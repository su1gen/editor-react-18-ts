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
import { LinkToolbarAppearance } from '../card/ui/LinkToolbarAppearance';
export var HyperlinkToolbarAppearance = /*#__PURE__*/function (_Component) {
  _inherits(HyperlinkToolbarAppearance, _Component);

  var _super = _createSuper(HyperlinkToolbarAppearance);

  function HyperlinkToolbarAppearance() {
    var _this;

    _classCallCheck(this, HyperlinkToolbarAppearance);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      supportedUrlsMap: new Map()
    });

    _defineProperty(_assertThisInitialized(_this), "getProvider", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
                  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_, cardProvider) {
                    return _regeneratorRuntime.wrap(function _callee$(_context) {
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

    _defineProperty(_assertThisInitialized(_this), "resolveUrl", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(url) {
        var supportedUrlsMap, isUrlSupported, provider;
        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
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

    _defineProperty(_assertThisInitialized(_this), "componentDidMount", function () {
      return _this.resolveUrl(_this.props.url);
    });

    return _this;
  }

  _createClass(HyperlinkToolbarAppearance, [{
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

      return /*#__PURE__*/React.createElement(LinkToolbarAppearance, {
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
}(Component);
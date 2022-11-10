"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

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

var _react = _interopRequireDefault(require("react"));

var _utils = require("@atlaskit/editor-common/utils");

var _pickerFacade = _interopRequireDefault(require("../../picker-facade"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var dummyMediaPickerObject = {
  on: function on() {},
  removeAllListeners: function removeAllListeners() {},
  emit: function emit() {},
  destroy: function destroy() {},
  setUploadParams: function setUploadParams() {}
};

var PickerFacadeProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(PickerFacadeProvider, _React$Component);

  var _super = _createSuper(PickerFacadeProvider);

  function PickerFacadeProvider() {
    var _this;

    (0, _classCallCheck2.default)(this, PickerFacadeProvider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleMediaProvider", /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(_name, provider) {
        var _this$props, mediaState, analyticsName, mediaProvider, resolvedMediaClientConfig, pickerFacadeConfig, pickerFacadeInstance, config;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$props = _this.props, mediaState = _this$props.mediaState, analyticsName = _this$props.analyticsName;
                _context.next = 3;
                return provider;

              case 3:
                mediaProvider = _context.sent;

                if (!(!mediaProvider || !mediaProvider.uploadParams)) {
                  _context.next = 6;
                  break;
                }

                return _context.abrupt("return");

              case 6:
                _context.next = 8;
                return mediaProvider.uploadMediaClientConfig;

              case 8:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 13;
                  break;
                }

                _context.next = 12;
                return mediaProvider.viewMediaClientConfig;

              case 12:
                _context.t0 = _context.sent;

              case 13:
                resolvedMediaClientConfig = _context.t0;

                if (resolvedMediaClientConfig) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt("return");

              case 16:
                pickerFacadeConfig = {
                  mediaClientConfig: resolvedMediaClientConfig,
                  errorReporter: mediaState.options.errorReporter || new _utils.ErrorReporter(),
                  featureFlags: mediaState.mediaOptions && mediaState.mediaOptions.featureFlags
                };
                /**
                 * As the first MediaPicker component to be migrated to React, we want to scope the amount of changes logic changed/moved on Editor side.
                 * To achieve this we agreed on using `PickerFacade` 'customMediaPicker' type, since we only need this instance to reuse the logic when we subscribe
                 * for all the different events in MediaPicker (onPreviewUpdate, onError, onProcessing, etc).
                 * The `dummyMediaPickerObject` provided here serves as a workaround for the old picker api that `PickerFacade` will try to use.
                 * But we don't want this to do anything since it's all part of the new React component (`Clipboard` component in this case).
                 * Eventually PickerFacade will be removed and replaced with a new abstraction explained here https://product-fabric.atlassian.net/browse/MS-1937
                 */

                _context.next = 19;
                return new _pickerFacade.default('customMediaPicker', pickerFacadeConfig, dummyMediaPickerObject, analyticsName).init();

              case 19:
                pickerFacadeInstance = _context.sent;

                /**
                 * Based on the `initPickers` method in `MediaPluginState` we need these 2 `onNewMedia` subscriptions.
                 * First one in order to trigger the entire process of uploading a file for when `onPreviewUpdate` is called
                 * Second one in order to track all analytics as before.
                 */
                pickerFacadeInstance.onNewMedia(mediaState.insertFile);
                pickerFacadeInstance.setUploadParams(mediaProvider.uploadParams);
                config = {
                  uploadParams: mediaProvider.uploadParams
                };

                _this.setState({
                  pickerFacadeInstance: pickerFacadeInstance,
                  config: config,
                  mediaClientConfig: resolvedMediaClientConfig
                });

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
    return _this;
  }

  (0, _createClass2.default)(PickerFacadeProvider, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.mediaState.options.providerFactory.subscribe('mediaProvider', this.handleMediaProvider);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.mediaState.options.providerFactory.unsubscribe('mediaProvider', this.handleMediaProvider);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          mediaClientConfig = _this$state.mediaClientConfig,
          config = _this$state.config,
          pickerFacadeInstance = _this$state.pickerFacadeInstance;

      if (!mediaClientConfig || !config || !pickerFacadeInstance) {
        return null;
      }

      return this.props.children({
        mediaClientConfig: mediaClientConfig,
        config: config,
        pickerFacadeInstance: pickerFacadeInstance
      });
    }
  }]);
  return PickerFacadeProvider;
}(_react.default.Component);

exports.default = PickerFacadeProvider;
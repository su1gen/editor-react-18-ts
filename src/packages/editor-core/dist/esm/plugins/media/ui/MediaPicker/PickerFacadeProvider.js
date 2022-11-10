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
import { ErrorReporter } from '@atlaskit/editor-common/utils';
import PickerFacade from '../../picker-facade';
var dummyMediaPickerObject = {
  on: function on() {},
  removeAllListeners: function removeAllListeners() {},
  emit: function emit() {},
  destroy: function destroy() {},
  setUploadParams: function setUploadParams() {}
};

var PickerFacadeProvider = /*#__PURE__*/function (_React$Component) {
  _inherits(PickerFacadeProvider, _React$Component);

  var _super = _createSuper(PickerFacadeProvider);

  function PickerFacadeProvider() {
    var _this;

    _classCallCheck(this, PickerFacadeProvider);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {});

    _defineProperty(_assertThisInitialized(_this), "handleMediaProvider", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(_name, provider) {
        var _this$props, mediaState, analyticsName, mediaProvider, resolvedMediaClientConfig, pickerFacadeConfig, pickerFacadeInstance, config;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
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
                  errorReporter: mediaState.options.errorReporter || new ErrorReporter(),
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
                return new PickerFacade('customMediaPicker', pickerFacadeConfig, dummyMediaPickerObject, analyticsName).init();

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

  _createClass(PickerFacadeProvider, [{
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
}(React.Component);

export { PickerFacadeProvider as default };
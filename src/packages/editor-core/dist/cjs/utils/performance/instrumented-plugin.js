"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstrumentedPlugin = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _utils = require("@atlaskit/editor-common/utils");

var _saferTransactions = require("./safer-transactions");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var InstrumentedPlugin = /*#__PURE__*/function (_SafePlugin) {
  (0, _inherits2.default)(InstrumentedPlugin, _SafePlugin);

  var _super = _createSuper(InstrumentedPlugin);

  function InstrumentedPlugin(spec) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var transactionTracker = arguments.length > 2 ? arguments[2] : undefined;
    (0, _classCallCheck2.default)(this, InstrumentedPlugin);
    var _options$transactionT = options.transactionTracking,
        transactionTracking = _options$transactionT === void 0 ? {
      enabled: false
    } : _options$transactionT,
        _options$uiTracking = options.uiTracking,
        uiTracking = _options$uiTracking === void 0 ? {
      enabled: false
    } : _options$uiTracking,
        _options$saferDispatc = options.saferDispatchedTransactions,
        saferDispatchedTransactions = _options$saferDispatc === void 0 ? false : _options$saferDispatc,
        dispatchAnalyticsEvent = options.dispatchAnalyticsEvent;
    var shouldOverrideApply = transactionTracking.enabled && transactionTracker || saferDispatchedTransactions;

    if (shouldOverrideApply && spec.state) {
      var originalApply = spec.state.apply.bind(spec.state);

      spec.state.apply = function (aTr, value, oldState, newState) {
        var self = (0, _assertThisInitialized2.default)(_this);
        var tr = saferDispatchedTransactions ? new Proxy(aTr, (0, _saferTransactions.freezeUnsafeTransactionProperties)({
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          pluginKey: self.key
        })) : aTr;
        var shouldTrackTransactions = transactionTracker === null || transactionTracker === void 0 ? void 0 : transactionTracker.shouldTrackTransaction(transactionTracking);

        if (!shouldTrackTransactions || !transactionTracker) {
          return originalApply(tr, value, oldState, newState);
        }

        var _transactionTracker$g = transactionTracker.getMeasureHelpers(transactionTracking),
            startMeasure = _transactionTracker$g.startMeasure,
            stopMeasure = _transactionTracker$g.stopMeasure;

        var measure = "\uD83E\uDD89".concat(self.key, "::apply");
        startMeasure(measure);
        var result = originalApply(tr, value, oldState, newState);
        stopMeasure(measure);
        return result;
      };
    }

    if (uiTracking.enabled && spec.view) {
      var originalView = spec.view.bind(spec);

      spec.view = function (editorView) {
        var self = (0, _assertThisInitialized2.default)(_this);
        var measure = "\uD83E\uDD89".concat(self.key, "::view::update");
        var view = originalView(editorView);

        if (view.update) {
          var originalUpdate = view.update;

          view.update = function (view, state) {
            (0, _utils.startMeasure)(measure);
            originalUpdate(view, state);
            (0, _utils.stopMeasure)(measure, function () {});
          };
        }

        return view;
      };
    }

    return _this = _super.call(this, spec);
  }

  (0, _createClass2.default)(InstrumentedPlugin, null, [{
    key: "fromPlugin",
    value: function fromPlugin(plugin, options, transactionTracker) {
      return new InstrumentedPlugin(plugin.spec, options, transactionTracker);
    }
  }]);
  return InstrumentedPlugin;
}(_safePlugin.SafePlugin);

exports.InstrumentedPlugin = InstrumentedPlugin;
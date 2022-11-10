import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import { freezeUnsafeTransactionProperties } from './safer-transactions';
export var InstrumentedPlugin = /*#__PURE__*/function (_SafePlugin) {
  _inherits(InstrumentedPlugin, _SafePlugin);

  var _super = _createSuper(InstrumentedPlugin);

  function InstrumentedPlugin(spec) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var transactionTracker = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, InstrumentedPlugin);

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
        var self = _assertThisInitialized(_this);

        var tr = saferDispatchedTransactions ? new Proxy(aTr, freezeUnsafeTransactionProperties({
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
        var self = _assertThisInitialized(_this);

        var measure = "\uD83E\uDD89".concat(self.key, "::view::update");
        var view = originalView(editorView);

        if (view.update) {
          var originalUpdate = view.update;

          view.update = function (view, state) {
            startMeasure(measure);
            originalUpdate(view, state);
            stopMeasure(measure, function () {});
          };
        }

        return view;
      };
    }

    return _this = _super.call(this, spec);
  }

  _createClass(InstrumentedPlugin, null, [{
    key: "fromPlugin",
    value: function fromPlugin(plugin, options, transactionTracker) {
      return new InstrumentedPlugin(plugin.spec, options, transactionTracker);
    }
  }]);

  return InstrumentedPlugin;
}(SafePlugin);
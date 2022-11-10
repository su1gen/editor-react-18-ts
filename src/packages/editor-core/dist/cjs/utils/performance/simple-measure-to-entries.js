"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleMeasurementLogger = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _trackTransactions = require("./track-transactions");

var EVENT_NAMES = [_trackTransactions.EVENT_NAME_STATE_APPLY, _trackTransactions.EVENT_NAME_UPDATE_STATE, _trackTransactions.EVENT_NAME_VIEW_STATE_UPDATED, _trackTransactions.EVENT_NAME_ON_CHANGE, _trackTransactions.EVENT_NAME_DISPATCH_TRANSACTION];
/**
 * A class that logs and collates measurement entries until
 * EVENT_NAME_DISPATCHTRANSACTION is detected.
 *
 * At that point, it will group together all the entries
 * logged and fire a callback with all entries packaged
 * into a PerformanceObserverEntryList.
 *
 * We are able to make use of this method as the measurements
 * which occur during dispatchTransactions are synchronous.
 */

var SimpleMeasurementLogger = /*#__PURE__*/(0, _createClass2.default)(function SimpleMeasurementLogger() {
  var _this = this;

  (0, _classCallCheck2.default)(this, SimpleMeasurementLogger);
  (0, _defineProperty2.default)(this, "currentBatch", []);
  (0, _defineProperty2.default)(this, "pluginNameCache", new Set());
  (0, _defineProperty2.default)(this, "setPluginNames", function (names) {
    _this.pluginNameCache = new Set(names);
  });
  (0, _defineProperty2.default)(this, "setOnObservation", function (callback) {
    _this.observationCallback = callback;
  });
  (0, _defineProperty2.default)(this, "createPerformanceEntry", function (reading) {
    return {
      entryType: 'mark',
      name: reading.name,
      startTime: reading.startTime,
      duration: reading.duration,
      toJSON: function toJSON() {
        return JSON.stringify({
          entryType: 'mark',
          name: reading.name,
          startTime: reading.startTime,
          duration: reading.duration
        });
      }
    };
  });
  (0, _defineProperty2.default)(this, "convertToEntryList", function (batch) {
    return {
      getEntries: function getEntries() {
        return batch;
      },
      // We ignore type because we only store type of mark in batch
      getEntriesByName: function getEntriesByName(name, type) {
        return batch.filter(function (entry) {
          return entry.name === name;
        });
      },
      getEntriesByType: function getEntriesByType(type) {
        return batch;
      }
    };
  });
  (0, _defineProperty2.default)(this, "observed", function (reading) {
    // Given that this is only used for tracking transactions and
    // transactions are synchronous, we can assume that anything measured
    // between EVENT_NAME_DISPATCHTRANSACTION is encapsulated.
    var name = reading.name; // Transaction tracking event are prefixed with Owl emoji

    if (name.startsWith('🦉')) {
      var _name$split$;

      // check if its logging InstrumentedPlugin.state.apply()
      var pluginName = ((_name$split$ = name.split(':')[0]) === null || _name$split$ === void 0 ? void 0 : _name$split$.split('🦉')[1]) || '';

      var isPluginApply = _this.pluginNameCache.has(pluginName);

      var isTransactionMeasurement = EVENT_NAMES.includes(name);

      if (!isTransactionMeasurement && process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn("SimpleMeasurementLogger: unknown transaction event name '".concat(name, "'"));
      }

      if (isPluginApply || isTransactionMeasurement) {
        _this.currentBatch.push(_this.createPerformanceEntry(reading));
      }
    } // Trigger a report


    if (name === _trackTransactions.EVENT_NAME_DISPATCH_TRANSACTION) {
      // convert the batch into a bunch of entries
      if (_this.observationCallback) {
        var _entries = _this.convertToEntryList((0, _toConsumableArray2.default)(_this.currentBatch));

        _this.observationCallback(_entries);
      }

      _this.currentBatch = [];
    }
  });
});
exports.SimpleMeasurementLogger = SimpleMeasurementLogger;
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _createClass from "@babel/runtime/helpers/createClass";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { EVENT_NAME_DISPATCH_TRANSACTION, EVENT_NAME_STATE_APPLY, EVENT_NAME_UPDATE_STATE, EVENT_NAME_VIEW_STATE_UPDATED, EVENT_NAME_ON_CHANGE } from './track-transactions';
var EVENT_NAMES = [EVENT_NAME_STATE_APPLY, EVENT_NAME_UPDATE_STATE, EVENT_NAME_VIEW_STATE_UPDATED, EVENT_NAME_ON_CHANGE, EVENT_NAME_DISPATCH_TRANSACTION];
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

export var SimpleMeasurementLogger = /*#__PURE__*/_createClass(function SimpleMeasurementLogger() {
  var _this = this;

  _classCallCheck(this, SimpleMeasurementLogger);

  _defineProperty(this, "currentBatch", []);

  _defineProperty(this, "pluginNameCache", new Set());

  _defineProperty(this, "setPluginNames", function (names) {
    _this.pluginNameCache = new Set(names);
  });

  _defineProperty(this, "setOnObservation", function (callback) {
    _this.observationCallback = callback;
  });

  _defineProperty(this, "createPerformanceEntry", function (reading) {
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

  _defineProperty(this, "convertToEntryList", function (batch) {
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

  _defineProperty(this, "observed", function (reading) {
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


    if (name === EVENT_NAME_DISPATCH_TRANSACTION) {
      // convert the batch into a bunch of entries
      if (_this.observationCallback) {
        var _entries = _this.convertToEntryList(_toConsumableArray(_this.currentBatch));

        _this.observationCallback(_entries);
      }

      _this.currentBatch = [];
    }
  });
});
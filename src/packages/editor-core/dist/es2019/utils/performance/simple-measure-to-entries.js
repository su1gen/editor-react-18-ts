import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { EVENT_NAME_DISPATCH_TRANSACTION, EVENT_NAME_STATE_APPLY, EVENT_NAME_UPDATE_STATE, EVENT_NAME_VIEW_STATE_UPDATED, EVENT_NAME_ON_CHANGE } from './track-transactions';
const EVENT_NAMES = [EVENT_NAME_STATE_APPLY, EVENT_NAME_UPDATE_STATE, EVENT_NAME_VIEW_STATE_UPDATED, EVENT_NAME_ON_CHANGE, EVENT_NAME_DISPATCH_TRANSACTION];
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

export class SimpleMeasurementLogger {
  constructor() {
    _defineProperty(this, "currentBatch", []);

    _defineProperty(this, "pluginNameCache", new Set());

    _defineProperty(this, "setPluginNames", names => {
      this.pluginNameCache = new Set(names);
    });

    _defineProperty(this, "setOnObservation", callback => {
      this.observationCallback = callback;
    });

    _defineProperty(this, "createPerformanceEntry", reading => {
      return {
        entryType: 'mark',
        name: reading.name,
        startTime: reading.startTime,
        duration: reading.duration,
        toJSON: () => JSON.stringify({
          entryType: 'mark',
          name: reading.name,
          startTime: reading.startTime,
          duration: reading.duration
        })
      };
    });

    _defineProperty(this, "convertToEntryList", batch => {
      return {
        getEntries: () => batch,
        // We ignore type because we only store type of mark in batch
        getEntriesByName: (name, type) => batch.filter(entry => entry.name === name),
        getEntriesByType: type => batch
      };
    });

    _defineProperty(this, "observed", reading => {
      // Given that this is only used for tracking transactions and
      // transactions are synchronous, we can assume that anything measured
      // between EVENT_NAME_DISPATCHTRANSACTION is encapsulated.
      const {
        name
      } = reading; // Transaction tracking event are prefixed with Owl emoji

      if (name.startsWith('🦉')) {
        var _name$split$;

        // check if its logging InstrumentedPlugin.state.apply()
        const pluginName = ((_name$split$ = name.split(':')[0]) === null || _name$split$ === void 0 ? void 0 : _name$split$.split('🦉')[1]) || '';
        const isPluginApply = this.pluginNameCache.has(pluginName);
        const isTransactionMeasurement = EVENT_NAMES.includes(name);

        if (!isTransactionMeasurement && process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`SimpleMeasurementLogger: unknown transaction event name '${name}'`);
        }

        if (isPluginApply || isTransactionMeasurement) {
          this.currentBatch.push(this.createPerformanceEntry(reading));
        }
      } // Trigger a report


      if (name === EVENT_NAME_DISPATCH_TRANSACTION) {
        // convert the batch into a bunch of entries
        if (this.observationCallback) {
          const entries = this.convertToEntryList([...this.currentBatch]);
          this.observationCallback(entries);
        }

        this.currentBatch = [];
      }
    });
  }

}
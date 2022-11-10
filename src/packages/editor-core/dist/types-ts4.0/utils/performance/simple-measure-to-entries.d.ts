interface Reading {
    name: string;
    duration: number;
    startTime: number;
}
declare type ObservationCallback = (entries: PerformanceObserverEntryList) => void;
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
export declare class SimpleMeasurementLogger {
    private currentBatch;
    private pluginNameCache;
    private observationCallback?;
    setPluginNames: (names: string[]) => void;
    setOnObservation: (callback: ObservationCallback) => void;
    private createPerformanceEntry;
    private convertToEntryList;
    observed: (reading: Reading) => void;
}
export {};

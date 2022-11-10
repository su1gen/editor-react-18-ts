import { SEVERITY } from '@atlaskit/editor-common/utils';
interface Opts {
    dispatchAverage?: (data: {
        mean: number;
        median: number;
        sampleSize: number;
    }, severity: SEVERITY) => void;
    dispatchSample?: (sample: number, severity: SEVERITY) => void;
    onSampleStart?: () => void;
    onSampleEnd?: (time: number, info: {
        isSlow: boolean;
        severity: SEVERITY;
    }) => void;
    onSlowInput?: (time: number) => void;
    samplingRate: number;
    slowThreshold: number;
    normalThreshold: number;
    degradedThreshold: number;
}
export default class InputLatencyTracker {
    private samples;
    private total;
    private currentStart;
    private samplingRate;
    private slowThreshold;
    private normalThreshold;
    private degradedThreshold;
    private dispatchAverage;
    private dispatchSample;
    private onSampleStart;
    private onSampleEnd;
    private onSlowInput;
    constructor({ samplingRate, slowThreshold, normalThreshold, degradedThreshold, dispatchAverage, dispatchSample, onSampleStart, onSampleEnd, onSlowInput, }: Opts);
    start(): void;
    end(): void;
    flush(): void;
    private dispatch;
    private push;
    private severity;
    private getLast;
    private getMean;
    private getMedian;
}
export {};

import type { TypeAheadStatsModifier } from './types';
export declare class StatsModifier implements TypeAheadStatsModifier {
    startedAt: number;
    endedAt: number;
    keyCount: {
        arrowUp: number;
        arrowDown: number;
    };
    constructor();
    increaseArrowUp: () => void;
    increaseArrowDown: () => void;
    serialize: () => {
        startedAt: number;
        endedAt: number;
        keyCount: {
            arrowUp: number;
            arrowDown: number;
        };
    };
}

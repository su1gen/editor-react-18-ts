import { TransactionTracking } from '../../types/performance-tracking';
export declare const EVENT_NAME_STATE_APPLY = "\uD83E\uDD89 EditorView::state::apply";
export declare const EVENT_NAME_UPDATE_STATE = "\uD83E\uDD89 EditorView::updateState";
export declare const EVENT_NAME_VIEW_STATE_UPDATED = "\uD83E\uDD89 EditorView::onEditorViewStateUpdated";
export declare const EVENT_NAME_ON_CHANGE = "\uD83E\uDD89 ReactEditorView::onChange";
export declare const EVENT_NAME_DISPATCH_TRANSACTION = "\uD83E\uDD89 ReactEditorView::dispatchTransaction";
export declare const DEFAULT_USE_PERFORMANCE_MARK = false;
interface MeasureHelpers {
    startMeasure: (measureName: string) => void;
    stopMeasure: (measureName: string, onMeasureComplete?: (duration: number, startTime: number) => void) => void;
}
interface SimpleEntry {
    name: string;
    duration: number;
    startTime: number;
}
declare type MeasureListener = (entry: SimpleEntry) => void;
export declare class TransactionTracker {
    private dispatchCallCounter;
    private readonly measureMap;
    private readonly measureListeners;
    addMeasureListener(listener: MeasureListener): void;
    removeMeasureListener(listener: MeasureListener): void;
    shouldTrackTransaction(options: TransactionTracking): boolean;
    bumpDispatchCounter: (options: TransactionTracking) => number;
    getMeasureHelpers: (options: TransactionTracking) => MeasureHelpers;
    private startMeasureSimple;
    private stopMeasureSimple;
}
export {};

import { MediaState } from '../types';
export declare class MediaTaskManager {
    private pendingTask;
    private taskMap;
    cancelPendingTask: (id: string) => void;
    waitForPendingTasks: (timeout?: number | undefined, lastTask?: Promise<MediaState | null> | undefined) => Promise<MediaState | null>;
    resumePendingTask: (id: string) => void;
    addPendingTask: (task: Promise<any>, id?: string | undefined) => Promise<MediaState | null>;
}

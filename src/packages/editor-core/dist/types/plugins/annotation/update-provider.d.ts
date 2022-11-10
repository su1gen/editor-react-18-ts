/// <reference types="node" />
import { EventEmitter } from 'events';
export declare type UpdateEvent = 'create' | 'delete' | 'resolve' | 'unresolve';
export declare type VisibilityEvent = 'setvisibility';
export declare class AnnotationUpdateEmitter extends EventEmitter {
    on(event: VisibilityEvent, listener: (isVisible: boolean) => void): this;
    on(event: UpdateEvent, listener: (annotationId: string) => void): this;
}

import { ServiceConfig } from '@atlaskit/util-service-support';
import type { CollabEventTelepointerData as TelepointerData, CollabParticipant as Participant } from '@atlaskit/editor-common/collab';
export type { CollabEvent, CollabEventData, CollabEditProvider, } from '@atlaskit/editor-common/collab';
export type { TelepointerData, Participant };
export interface DocumentResponse {
    version: number;
    doc: any;
}
export interface StepResponse {
    version: number;
    steps: any[];
}
export declare type MixedResponse = DocumentResponse & StepResponse;
export interface Config extends ServiceConfig {
    docId: string;
    userId: string;
}
/**
 * Same as PubSub client types (don't want a direct dep though)
 */
export declare type ARI = string;
export declare type AVI = string;
export interface PubSubOnEvent<T = any> {
    (event: string, data: T): void;
}
export interface PubSubClient {
    on(eventAvi: string, listener: PubSubOnEvent): PubSubClient;
    off(eventAvi: string, listener: PubSubOnEvent): PubSubClient;
    join(aris: ARI[]): Promise<PubSubClient>;
    leave(aris: ARI[]): Promise<PubSubClient>;
}
export declare enum PubSubSpecialEventType {
    ERROR = "ERROR",
    CONNECTED = "CONNECTED",
    RECONNECT = "RECONNECT"
}

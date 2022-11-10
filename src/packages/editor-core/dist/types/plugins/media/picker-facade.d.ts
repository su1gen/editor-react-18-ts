import { UploadPreviewUpdateEventPayload, UploadParams, UploadErrorEventPayload, UploadEndEventPayload } from '@atlaskit/media-picker/types';
import { MediaClientConfig } from '@atlaskit/media-core';
import type { ErrorReportingHandler } from '@atlaskit/editor-common/utils';
import { MediaFeatureFlags } from '@atlaskit/media-common/mediaFeatureFlags';
import { MediaState, CustomMediaPicker, MobileUploadEndEventPayload } from './types';
export declare type PickerType = 'clipboard' | 'dropzone' | 'customMediaPicker';
export declare type ExtendedComponentConfigs = {
    customMediaPicker: CustomMediaPicker;
    dropzone: null;
    clipboard: null;
};
export declare type PickerFacadeConfig = {
    mediaClientConfig: MediaClientConfig;
    errorReporter: ErrorReportingHandler;
    featureFlags?: MediaFeatureFlags;
};
export declare type MediaStateEvent = MediaState;
export declare type MediaStateEventListener = (evt: MediaStateEvent) => void;
export declare type MediaStateEventSubscriber = (listener: MediaStateEventListener) => void;
export declare type NewMediaEvent = (state: MediaState, onStateChanged: MediaStateEventSubscriber, pickerType?: string) => void;
export default class PickerFacade {
    readonly config: PickerFacadeConfig;
    readonly pickerConfig?: CustomMediaPicker | null | undefined;
    private picker?;
    private onDragListeners;
    private pickerType;
    private onStartListeners;
    private eventListeners;
    private analyticsName;
    erroredFiles: Set<string>;
    constructor(pickerType: PickerType, config: PickerFacadeConfig, pickerConfig?: CustomMediaPicker | null | undefined, analyticsName?: string);
    init(): Promise<PickerFacade>;
    get type(): PickerType;
    get mediaPicker(): CustomMediaPicker | undefined;
    destroy(): void;
    setUploadParams(params: UploadParams): void;
    onNewMedia(cb: NewMediaEvent): void;
    onDrag(cb: (state: 'enter' | 'leave') => any): void;
    handleUploadPreviewUpdate: (event: UploadPreviewUpdateEventPayload) => void;
    private subscribeStateChanged;
    handleUploadError: ({ error, fileId }: UploadErrorEventPayload) => void;
    handleMobileUploadEnd: (event: MobileUploadEndEventPayload) => void;
    handleReady: (event: UploadEndEventPayload) => void;
}

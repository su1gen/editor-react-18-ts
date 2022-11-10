import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { isImagePreview } from '@atlaskit/media-picker';
export default class PickerFacade {
  constructor(pickerType, config, pickerConfig, analyticsName) {
    _defineProperty(this, "onDragListeners", []);

    _defineProperty(this, "onStartListeners", []);

    _defineProperty(this, "eventListeners", {});

    _defineProperty(this, "handleUploadPreviewUpdate", event => {
      const {
        file,
        preview
      } = event; //check if upload-error was called before upload-preview-update

      const isErroredFile = this.erroredFiles.has(file.id);
      const {
        dimensions,
        scaleFactor
      } = isImagePreview(preview) ? preview : {
        dimensions: undefined,
        scaleFactor: undefined
      };
      const state = {
        id: file.id,
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type,
        collection: file.collectionName,
        dimensions,
        scaleFactor,
        status: isErroredFile ? 'error' : undefined
      };
      this.eventListeners[file.id] = [];
      this.onStartListeners.forEach(cb => cb(state, evt => this.subscribeStateChanged(file, evt), this.analyticsName || this.pickerType));
    });

    _defineProperty(this, "subscribeStateChanged", (file, onStateChanged) => {
      const subscribers = this.eventListeners[file.id];

      if (!subscribers) {
        return;
      }

      subscribers.push(onStateChanged);
    });

    _defineProperty(this, "handleUploadError", ({
      error,
      fileId
    }) => {
      const listeners = this.eventListeners[fileId];
      this.erroredFiles.add(fileId);

      if (!listeners) {
        return;
      }

      listeners.forEach(cb => cb({
        id: fileId,
        status: 'error',
        error: error && {
          description: error.description,
          name: error.name
        }
      })); // remove listeners

      delete this.eventListeners[fileId];
    });

    _defineProperty(this, "handleMobileUploadEnd", event => {
      const {
        file
      } = event;
      const listeners = this.eventListeners[file.id];

      if (!listeners) {
        return;
      }

      listeners.forEach(cb => cb({
        id: file.id,
        status: 'mobile-upload-end',
        fileMimeType: file.type,
        collection: file.collectionName,
        publicId: file.publicId
      }));
    });

    _defineProperty(this, "handleReady", event => {
      const {
        file
      } = event;
      const listeners = this.eventListeners[file.id];

      if (!listeners) {
        return;
      }

      listeners.forEach(cb => cb({
        id: file.id,
        status: 'ready'
      })); // remove listeners

      delete this.eventListeners[file.id];
    });

    this.config = config;
    this.pickerConfig = pickerConfig;
    this.pickerType = pickerType;
    this.analyticsName = analyticsName;
    this.erroredFiles = new Set();
  }

  async init() {
    let picker;

    if (this.pickerType === 'customMediaPicker') {
      picker = this.picker = this.pickerConfig;
    }

    if (!picker) {
      return this;
    }

    picker.on('upload-preview-update', this.handleUploadPreviewUpdate);
    picker.on('upload-end', this.handleReady);
    picker.on('upload-error', this.handleUploadError);
    picker.on('mobile-upload-end', this.handleMobileUploadEnd);
    return this;
  }

  get type() {
    return this.pickerType;
  }

  get mediaPicker() {
    return this.picker;
  }

  destroy() {
    const {
      picker
    } = this;

    if (!picker) {
      return;
    }

    picker.removeAllListeners('upload-preview-update');
    picker.removeAllListeners('upload-end');
    picker.removeAllListeners('upload-error');
    this.onStartListeners = [];
    this.onDragListeners = [];
  }

  setUploadParams(params) {
    if (this.picker) {
      this.picker.setUploadParams(params);
    }
  }

  onNewMedia(cb) {
    this.onStartListeners.push(cb);
  }

  onDrag(cb) {
    this.onDragListeners.push(cb);
  }

}
import { stateKey } from './plugin-key';

var imageUploadAction = function imageUploadAction(tr, action) {
  return tr.setMeta(stateKey, action);
};

export var startUpload = function startUpload(event) {
  return function (tr) {
    return imageUploadAction(tr, {
      name: 'START_UPLOAD',
      event: event
    });
  };
};
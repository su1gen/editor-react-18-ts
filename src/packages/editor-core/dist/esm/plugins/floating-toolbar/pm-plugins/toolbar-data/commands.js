import { createCommand } from './plugin-factory';
export var showConfirmDialog = function showConfirmDialog(buttonIndex) {
  return createCommand({
    type: 'SHOW_CONFIRM_DIALOG',
    data: {
      buttonIndex: buttonIndex
    }
  }, function (tr) {
    return tr.setMeta('addToHistory', false);
  });
};
export var hideConfirmDialog = function hideConfirmDialog() {
  return createCommand({
    type: 'HIDE_CONFIRM_DIALOG'
  }, function (tr) {
    return tr.setMeta('addToHistory', false);
  });
};
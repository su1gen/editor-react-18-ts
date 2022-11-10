import { createCommand } from './plugin-factory';
export const showConfirmDialog = buttonIndex => createCommand({
  type: 'SHOW_CONFIRM_DIALOG',
  data: {
    buttonIndex
  }
}, tr => tr.setMeta('addToHistory', false));
export const hideConfirmDialog = () => createCommand({
  type: 'HIDE_CONFIRM_DIALOG'
}, tr => tr.setMeta('addToHistory', false));
import { MobileDimensionsActionTypes } from './actions';
import { createCommand } from './plugin-factory';
export const setKeyboardHeight = keyboardHeight => createCommand({
  type: MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT,
  keyboardHeight
});
export const setWindowHeight = windowHeight => createCommand({
  type: MobileDimensionsActionTypes.SET_WINDOW_HEIGHT,
  windowHeight
});
export const setMobilePaddingTop = paddingTop => createCommand({
  type: MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP,
  paddingTop
});
export const setIsExpanded = isExpanded => createCommand({
  type: MobileDimensionsActionTypes.SET_IS_EXPANDED,
  isExpanded
});
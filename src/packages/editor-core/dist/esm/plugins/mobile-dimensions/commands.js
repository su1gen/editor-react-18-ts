import { MobileDimensionsActionTypes } from './actions';
import { createCommand } from './plugin-factory';
export var setKeyboardHeight = function setKeyboardHeight(keyboardHeight) {
  return createCommand({
    type: MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT,
    keyboardHeight: keyboardHeight
  });
};
export var setWindowHeight = function setWindowHeight(windowHeight) {
  return createCommand({
    type: MobileDimensionsActionTypes.SET_WINDOW_HEIGHT,
    windowHeight: windowHeight
  });
};
export var setMobilePaddingTop = function setMobilePaddingTop(paddingTop) {
  return createCommand({
    type: MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP,
    paddingTop: paddingTop
  });
};
export var setIsExpanded = function setIsExpanded(isExpanded) {
  return createCommand({
    type: MobileDimensionsActionTypes.SET_IS_EXPANDED,
    isExpanded: isExpanded
  });
};
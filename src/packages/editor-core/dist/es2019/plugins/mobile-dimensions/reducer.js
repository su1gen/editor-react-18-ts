import { MobileDimensionsActionTypes } from './actions';
export default function (state, action) {
  switch (action.type) {
    case MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT:
      return { ...state,
        keyboardHeight: action.keyboardHeight
      };

    case MobileDimensionsActionTypes.SET_WINDOW_HEIGHT:
      return { ...state,
        windowHeight: action.windowHeight
      };

    case MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP:
      return { ...state,
        mobilePaddingTop: action.paddingTop
      };

    case MobileDimensionsActionTypes.SET_IS_EXPANDED:
      return { ...state,
        isExpanded: action.isExpanded
      };
  }

  return state;
}
import { PastePluginActionTypes as ActionTypes } from './actions';
export const reducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS:
      {
        return { ...state,
          pastedMacroPositions: { ...state.pastedMacroPositions,
            ...action.pastedMacroPositions
          }
        };
      }

    case ActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS:
      {
        const filteredMacroPositions = Object.fromEntries(Object.entries(state.pastedMacroPositions).filter(([key]) => !action.pastedMacroPositionKeys.includes(key)));
        return { ...state,
          pastedMacroPositions: filteredMacroPositions
        };
      }

    default:
      return state;
  }
};
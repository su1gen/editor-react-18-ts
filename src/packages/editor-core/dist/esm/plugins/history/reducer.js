import { HistoryActionTypes } from './actions';

var reducer = function reducer(state, action) {
  switch (action.type) {
    case HistoryActionTypes.UPDATE:
      return {
        canUndo: action.canUndo,
        canRedo: action.canRedo
      };
  }

  return state;
};

export default reducer;
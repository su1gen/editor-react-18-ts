"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _actions = require("./actions");

var reducer = function reducer(state, action) {
  switch (action.type) {
    case _actions.HistoryActionTypes.UPDATE:
      return {
        canUndo: action.canUndo,
        canRedo: action.canRedo
      };
  }

  return state;
};

var _default = reducer;
exports.default = _default;
export var ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["UPDATE_INLINE_COMMENT_STATE"] = 0] = "UPDATE_INLINE_COMMENT_STATE";
  ACTIONS[ACTIONS["SET_INLINE_COMMENT_DRAFT_STATE"] = 1] = "SET_INLINE_COMMENT_DRAFT_STATE";
  ACTIONS[ACTIONS["INLINE_COMMENT_UPDATE_MOUSE_STATE"] = 2] = "INLINE_COMMENT_UPDATE_MOUSE_STATE";
  ACTIONS[ACTIONS["INLINE_COMMENT_CLEAR_DIRTY_MARK"] = 3] = "INLINE_COMMENT_CLEAR_DIRTY_MARK";
  ACTIONS[ACTIONS["ADD_INLINE_COMMENT"] = 4] = "ADD_INLINE_COMMENT";
  ACTIONS[ACTIONS["INLINE_COMMENT_SET_VISIBLE"] = 5] = "INLINE_COMMENT_SET_VISIBLE";
  ACTIONS[ACTIONS["CLOSE_COMPONENT"] = 6] = "CLOSE_COMPONENT";
})(ACTIONS || (ACTIONS = {}));
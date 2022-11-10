/** Allows the possibility of overriding interaction type values in unit tests via jest.mock or spyOn. */
export var setInteractionType = function setInteractionType(value) {
  return value;
};
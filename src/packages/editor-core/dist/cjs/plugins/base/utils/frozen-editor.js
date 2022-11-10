"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setInteractionType = void 0;

/** Allows the possibility of overriding interaction type values in unit tests via jest.mock or spyOn. */
var setInteractionType = function setInteractionType(value) {
  return value;
};

exports.setInteractionType = setInteractionType;
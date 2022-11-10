"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PubSubSpecialEventType = void 0;

/**
 * Same as PubSub client types (don't want a direct dep though)
 */
var PubSubSpecialEventType;
exports.PubSubSpecialEventType = PubSubSpecialEventType;

(function (PubSubSpecialEventType) {
  PubSubSpecialEventType["ERROR"] = "ERROR";
  PubSubSpecialEventType["CONNECTED"] = "CONNECTED";
  PubSubSpecialEventType["RECONNECT"] = "RECONNECT";
})(PubSubSpecialEventType || (exports.PubSubSpecialEventType = PubSubSpecialEventType = {}));
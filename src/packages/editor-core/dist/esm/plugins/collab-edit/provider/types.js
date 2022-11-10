/**
 * Same as PubSub client types (don't want a direct dep though)
 */
export var PubSubSpecialEventType;

(function (PubSubSpecialEventType) {
  PubSubSpecialEventType["ERROR"] = "ERROR";
  PubSubSpecialEventType["CONNECTED"] = "CONNECTED";
  PubSubSpecialEventType["RECONNECT"] = "RECONNECT";
})(PubSubSpecialEventType || (PubSubSpecialEventType = {}));
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Direction = void 0;
exports.isBackward = isBackward;
exports.isForward = isForward;
var Direction;
exports.Direction = Direction;

(function (Direction) {
  Direction["UP"] = "up";
  Direction["RIGHT"] = "right";
  Direction["DOWN"] = "down";
  Direction["LEFT"] = "left";
  Direction["BACKWARD"] = "backward";
  Direction["FORWARD"] = "forward";
})(Direction || (exports.Direction = Direction = {}));

function isBackward(dir) {
  return [Direction.UP, Direction.LEFT, Direction.BACKWARD].indexOf(dir) !== -1;
}

function isForward(dir) {
  return [Direction.RIGHT, Direction.DOWN, Direction.FORWARD].indexOf(dir) !== -1;
}
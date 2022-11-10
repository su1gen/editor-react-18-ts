"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = void 0;

var logger = function logger(msg) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'color:blue;font-weight:bold;';
  // eslint-disable-next-line no-console
  console.log("%cCollab-Edit: ".concat(msg), style);

  if (data) {
    // eslint-disable-next-line no-console
    console.log(data);
  }
};

exports.logger = logger;
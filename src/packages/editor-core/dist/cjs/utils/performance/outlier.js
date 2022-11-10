"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outlier = void 0;

var _percentile = require("./percentile");

var outlier = function outlier(input, factor) {
  var q1 = (0, _percentile.percentile)(input, 0.25);
  var q3 = (0, _percentile.percentile)(input, 0.75);

  if (typeof q1 === 'undefined' || typeof q3 === 'undefined') {
    return;
  }

  var iqr = q3 - q1;
  return q3 + iqr * factor;
};

exports.outlier = outlier;
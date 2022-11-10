import { percentile } from './percentile';
export var outlier = function outlier(input, factor) {
  var q1 = percentile(input, 0.25);
  var q3 = percentile(input, 0.75);

  if (typeof q1 === 'undefined' || typeof q3 === 'undefined') {
    return;
  }

  var iqr = q3 - q1;
  return q3 + iqr * factor;
};
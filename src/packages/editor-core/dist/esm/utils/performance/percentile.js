export var percentile = function percentile(input, fraction) {
  var sorted = input.sort(function (a, b) {
    return a - b;
  });
  var position = sorted.length * fraction;
  var base = Math.floor(position);
  var rest = position - base;

  if (rest > 0) {
    return sorted[base];
  }

  var item = sorted[base - 1];
  var next = sorted[base];

  if (typeof item !== 'undefined' && typeof next !== 'undefined') {
    return (item + next) / 2;
  }
};
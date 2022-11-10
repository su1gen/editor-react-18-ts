export const snapTo = (target, points) => {
  return points.length === 0 ? // extreme last case if there are no points somehow
  target : points.reduce((point, closest) => {
    return Math.abs(closest - target) < Math.abs(point - target) ? closest : point;
  });
};
export const handleSides = ['left', 'right'];
export const alignmentLayouts = ['align-start', 'align-end'];
export const imageAlignmentMap = {
  left: 'start',
  right: 'end'
};
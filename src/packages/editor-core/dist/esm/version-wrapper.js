export var name = "@atlaskit/editor-core";
export var version = "175.0.0";
export var nextMajorVersion = function nextMajorVersion() {
  return [Number(version.split('.')[0]) + 1, 0, 0].join('.');
};
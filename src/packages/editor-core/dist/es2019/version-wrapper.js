export const name = "@atlaskit/editor-core";
export const version = "175.0.0";
export const nextMajorVersion = () => {
  return [Number(version.split('.')[0]) + 1, 0, 0].join('.');
};
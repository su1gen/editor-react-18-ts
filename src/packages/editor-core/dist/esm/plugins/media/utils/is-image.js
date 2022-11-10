export var isImage = function isImage(fileType) {
  return !!fileType && (fileType.indexOf('image/') > -1 || fileType.indexOf('video/') > -1);
};
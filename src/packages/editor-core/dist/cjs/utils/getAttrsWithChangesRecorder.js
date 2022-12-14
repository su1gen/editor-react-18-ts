"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getAttrsWithChangesRecorder;

/**
 * Create a new getAttrs handler who will wrap the original function,
 * and store the changes internally to be used for other
 * tools like Analytics later in the code.
 *
 * @param getAttrs - Function who gets the new attributes
 * @return object
 * @property handler - New handler to get indentation attributes (It wraps the original)
 * @property getChanges - Return all the stored changes.
 * @property clear - Clear the changes
 */
function getAttrsWithChangesRecorder(getAttrs, options) {
  var changes = [];

  function getAttrsWithChangesRecorder(prevAttrs, node) {
    var newAttrs = getAttrs(prevAttrs, node);
    changes.push({
      node: node,
      prevAttrs: prevAttrs,
      newAttrs: newAttrs,
      options: options
    });
    return newAttrs;
  }

  return {
    getAttrs: getAttrsWithChangesRecorder,
    getAndResetAttrsChanges: function getAndResetAttrsChanges() {
      var oldChanges = changes;
      changes = [];
      return oldChanges;
    }
  };
}
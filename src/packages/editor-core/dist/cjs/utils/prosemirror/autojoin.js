"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autoJoinTr = autoJoinTr;

var _prosemirrorTransform = require("prosemirror-transform");

/**
 * Checks whether two adjacent nodes can be joined. If so, the document
 * will be updated to join those nodes. If not, the original transaction
 * remains untouched.
 *
 * Nodes are considered joinable if the `isJoinable` predicate returns true or,
 * if an array of strings was passed, if their node type name is in that array.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L597-L610
 */
function autoJoinTr(tr, isJoinable) {
  if (Array.isArray(isJoinable)) {
    var types = isJoinable;

    isJoinable = function isJoinable(node) {
      return types.indexOf(node.type.name) > -1;
    };
  }

  var ranges = [];

  for (var i = 0; i < tr.mapping.maps.length; i++) {
    var map = tr.mapping.maps[i];

    for (var j = 0; j < ranges.length; j++) {
      ranges[j] = map.map(ranges[j]);
    }

    map.forEach(function (_s, _e, from, to) {
      return ranges.push(from, to);
    });
  } // Figure out which joinable points exist inside those ranges,
  // by checking all node boundaries in their parent nodes.


  var joinable = [];

  for (var _i = 0; _i < ranges.length; _i += 2) {
    var from = ranges[_i];
    var to = ranges[_i + 1];
    var $from = tr.doc.resolve(from);
    var depth = $from.sharedDepth(to);
    var parent = $from.node(depth);

    for (var index = $from.indexAfter(depth), pos = $from.after(depth + 1); pos <= to; ++index) {
      var _after = parent.maybeChild(index);

      if (!_after) {
        break;
      }

      if (index && joinable.indexOf(pos) === -1) {
        var _before = parent.child(index - 1);

        if (_before.type === _after.type && isJoinable(_before, _after)) {
          joinable.push(pos);
        }
      }

      pos += _after.nodeSize;
    }
  } // Join the joinable points


  joinable.sort(function (a, b) {
    return a - b;
  });

  for (var _i2 = joinable.length - 1; _i2 >= 0; _i2--) {
    if ((0, _prosemirrorTransform.canJoin)(tr.doc, joinable[_i2])) {
      tr.join(joinable[_i2]);
    }
  }
}
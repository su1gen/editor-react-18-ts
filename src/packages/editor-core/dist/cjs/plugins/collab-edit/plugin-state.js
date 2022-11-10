"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidPos = exports.TELEPOINTER_DIM_CLASS = exports.PluginState = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _prosemirrorTransform = require("prosemirror-transform");

var _utils = require("@atlaskit/editor-common/utils");

var _participants = require("./participants");

var _utils2 = require("./utils");

var isReplaceStep = function isReplaceStep(step) {
  return step instanceof _prosemirrorTransform.ReplaceStep;
};

var TELEPOINTER_DIM_CLASS = 'telepointer-dim';
/**
 * Returns position where it's possible to place a decoration.
 */

exports.TELEPOINTER_DIM_CLASS = TELEPOINTER_DIM_CLASS;

var getValidPos = function getValidPos(tr, pos) {
  var endOfDocPos = tr.doc.nodeSize - 2;

  if (pos <= endOfDocPos) {
    var resolvedPos = tr.doc.resolve(pos);

    var backwardSelection = _prosemirrorState.Selection.findFrom(resolvedPos, -1, true); // if there's no correct cursor position before the `pos`, we try to find it after the `pos`


    var forwardSelection = _prosemirrorState.Selection.findFrom(resolvedPos, 1, true);

    return backwardSelection ? backwardSelection.from : forwardSelection ? forwardSelection.from : pos;
  }

  return endOfDocPos;
};

exports.getValidPos = getValidPos;

var PluginState = /*#__PURE__*/function () {
  function PluginState(decorations, participants, sessionId) {
    var collabInitalised = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var onError = arguments.length > 4 ? arguments[4] : undefined;
    (0, _classCallCheck2.default)(this, PluginState);
    (0, _defineProperty2.default)(this, "onError", function (error) {
      return console.error(error);
    });
    this.decorationSet = decorations;
    this.participants = participants;
    this.sid = sessionId;
    this.isReady = collabInitalised;
    this.onError = onError || this.onError;
  }

  (0, _createClass2.default)(PluginState, [{
    key: "decorations",
    get: // eslint-disable-next-line no-console
    function get() {
      return this.decorationSet;
    }
  }, {
    key: "activeParticipants",
    get: function get() {
      return this.participants;
    }
  }, {
    key: "sessionId",
    get: function get() {
      return this.sid;
    }
  }, {
    key: "getInitial",
    value: function getInitial(sessionId) {
      var participant = this.participants.get(sessionId);
      return participant ? participant.name.substring(0, 1).toUpperCase() : 'X';
    }
  }, {
    key: "apply",
    value: function apply(tr) {
      var _this = this;

      var participants = this.participants,
          sid = this.sid,
          isReady = this.isReady;
      var presenceData = tr.getMeta('presence');
      var telepointerData = tr.getMeta('telepointer');
      var sessionIdData = tr.getMeta('sessionId');
      var collabInitialised = tr.getMeta('collabInitialised');

      if (typeof collabInitialised !== 'boolean') {
        collabInitialised = isReady;
      }

      if (sessionIdData) {
        sid = sessionIdData.sid;
      }

      var add = [];
      var remove = [];

      if (presenceData) {
        var _presenceData$joined = presenceData.joined,
            joined = _presenceData$joined === void 0 ? [] : _presenceData$joined,
            _presenceData$left = presenceData.left,
            left = _presenceData$left === void 0 ? [] : _presenceData$left;
        participants = participants.remove(left.map(function (i) {
          return i.sessionId;
        }));
        participants = participants.add(joined); // Remove telepointers for users that left

        left.forEach(function (i) {
          var pointers = (0, _utils2.findPointers)(i.sessionId, _this.decorationSet);

          if (pointers) {
            remove = remove.concat(pointers);
          }
        });
      }

      if (telepointerData) {
        var sessionId = telepointerData.sessionId;

        if (participants.get(sessionId) && sessionId !== sid) {
          var oldPointers = (0, _utils2.findPointers)(telepointerData.sessionId, this.decorationSet);

          if (oldPointers) {
            remove = remove.concat(oldPointers);
          }

          var endOfDocPos = tr.doc.nodeSize - 2;
          var _telepointerData$sele = telepointerData.selection,
              anchor = _telepointerData$sele.anchor,
              head = _telepointerData$sele.head;
          var rawFrom = anchor < head ? anchor : head;
          var rawTo = anchor >= head ? anchor : head;

          if (rawFrom > endOfDocPos) {
            rawFrom = endOfDocPos;
          }

          if (rawTo > endOfDocPos) {
            rawTo = endOfDocPos;
          }

          var isSelection = rawTo - rawFrom > 0;
          var from = 1;
          var to = 1;

          try {
            from = getValidPos(tr, isSelection ? Math.max(rawFrom - 1, 0) : rawFrom);
            to = isSelection ? getValidPos(tr, rawTo) : from;
          } catch (err) {
            this.onError(err);
          }

          add = add.concat((0, _utils2.createTelepointers)(from, to, sessionId, isSelection, this.getInitial(sessionId)));
        }
      }

      if (tr.docChanged) {
        // Adjust decoration positions to changes made by the transaction
        try {
          this.decorationSet = this.decorationSet.map(tr.mapping, tr.doc, {
            // Reapplies decorators those got removed by the state change
            onRemove: function onRemove(spec) {
              if (spec.pointer && spec.pointer.sessionId && spec.key === "telepointer-".concat(spec.pointer.sessionId)) {
                var step = tr.steps.filter(isReplaceStep)[0];

                if (step) {
                  var _sessionId = spec.pointer.sessionId;
                  var _ref = step,
                      size = _ref.slice.content.size,
                      _from = _ref.from;
                  var pos = getValidPos(tr, size ? Math.min(_from + size, tr.doc.nodeSize - 3) : Math.max(_from, 1));
                  add = add.concat((0, _utils2.createTelepointers)(pos, pos, _sessionId, false, _this.getInitial(_sessionId)));
                }
              }
            }
          });
        } catch (err) {
          this.onError(err);
        } // Remove any selection decoration within the change range,
        // takes care of the issue when after pasting we end up with a dead selection


        tr.steps.filter(isReplaceStep).forEach(function (s) {
          var _ref2 = s,
              from = _ref2.from,
              to = _ref2.to;

          _this.decorationSet.find(from, to).forEach(function (deco) {
            // `type` is private, `from` and `to` are public in latest version
            // `from` != `to` means it's a selection
            if (deco.from !== deco.to) {
              remove.push(deco);
            }
          });
        });
      }

      var selection = tr.selection;
      this.decorationSet.find().forEach(function (deco) {
        if (deco.type.toDOM) {
          var hasTelepointerDimClass = deco.type.toDOM.classList.contains(TELEPOINTER_DIM_CLASS);

          if (deco.from === selection.from && deco.to === selection.to) {
            if (!hasTelepointerDimClass) {
              deco.type.toDOM.classList.add(TELEPOINTER_DIM_CLASS);
            } // Browser condition here to fix ED-14722 where telepointer
            // decorations with side -1 in Firefox causes backspace issues.
            // This is likely caused by contenteditable quirks in Firefox


            if (!_utils.browser.gecko) {
              deco.type.side = -1;
            }
          } else {
            if (hasTelepointerDimClass) {
              deco.type.toDOM.classList.remove(TELEPOINTER_DIM_CLASS);
            }

            deco.type.side = 0;
          }
        }
      });

      if (remove.length) {
        this.decorationSet = this.decorationSet.remove(remove);
      }

      if (add.length) {
        this.decorationSet = this.decorationSet.add(tr.doc, add);
      } // This piece needs to be after the decorationSet adjustments,
      // otherwise it's always one step behind where the cursor is


      if (telepointerData) {
        var _sessionId2 = telepointerData.sessionId;

        if (participants.get(_sessionId2)) {
          var positionForScroll = (0, _utils2.getPositionOfTelepointer)(_sessionId2, this.decorationSet);

          if (positionForScroll) {
            participants = participants.updateCursorPos(_sessionId2, positionForScroll);
          }
        }
      }

      var nextState = new PluginState(this.decorationSet, participants, sid, collabInitialised);
      return PluginState.eq(nextState, this) ? this : nextState;
    }
  }], [{
    key: "eq",
    value: function eq(a, b) {
      return a.participants === b.participants && a.sessionId === b.sessionId && a.isReady === b.isReady;
    }
  }, {
    key: "init",
    value: function init(config) {
      var doc = config.doc,
          onError = config.onError;
      return new PluginState(_prosemirrorView.DecorationSet.create(doc, []), new _participants.Participants(), undefined, undefined, onError);
    }
  }]);
  return PluginState;
}();

exports.PluginState = PluginState;
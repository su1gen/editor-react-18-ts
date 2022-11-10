"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _index = require("./index");

var _plugin = require("../plugin");

// max number of decorations to apply at once
var batchIncrement = 100; // position range to apply decorations between before alternating above or below viewport

var posIncrement = 2000;

/**
 * Provides support for applying search match highlight decorations in batches
 */
var BatchDecorations = /*#__PURE__*/function () {
  function BatchDecorations() {
    (0, _classCallCheck2.default)(this, BatchDecorations);
  }

  (0, _createClass2.default)(BatchDecorations, [{
    key: "stop",
    value: function stop() {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
      }
    }
    /**
     * Applies the decorations needed for the current search results
     * It does so async, splitting them up into batches to help with performance
     */

  }, {
    key: "applyAllSearchDecorations",
    value: function () {
      var _applyAllSearchDecorations = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(editorView, containerElement, addDecorations, removeDecorations) {
        var pmElement, positions, startPos, endPos, viewportStartPos, viewportEndPos, dir, before, after, diff;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.stop();
                this.addDecorations = addDecorations;
                this.removeDecorations = removeDecorations;

                if (containerElement) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return");

              case 5:
                pmElement = containerElement.querySelector('.ProseMirror');

                if (pmElement) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return");

              case 8:
                positions = this.calcDecorationPositions(editorView, containerElement, pmElement);
                startPos = positions.startPos, endPos = positions.endPos, viewportStartPos = positions.viewportStartPos, viewportEndPos = positions.viewportEndPos;
                dir = 0;
                before = viewportStartPos;
                after = viewportEndPos - posIncrement;
                _context.next = 15;
                return this.updateDecorationsBetween(editorView, viewportStartPos, viewportEndPos);

              case 15:
                if (!(before > startPos || after < endPos)) {
                  _context.next = 28;
                  break;
                }

                if (!(dir++ % 2 === 0 && before > startPos || after >= endPos)) {
                  _context.next = 23;
                  break;
                }

                diff = before - startPos;
                before = Math.max(before - posIncrement, startPos);
                _context.next = 21;
                return this.updateDecorationsBetween(editorView, before, before + Math.min(diff, posIncrement));

              case 21:
                _context.next = 26;
                break;

              case 23:
                after = Math.min(after + posIncrement, endPos);
                _context.next = 26;
                return this.updateDecorationsBetween(editorView, after, Math.min(after + posIncrement, endPos));

              case 26:
                _context.next = 15;
                break;

              case 28:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function applyAllSearchDecorations(_x, _x2, _x3, _x4) {
        return _applyAllSearchDecorations.apply(this, arguments);
      }

      return applyAllSearchDecorations;
    }()
  }, {
    key: "updateDecorationsBetween",
    value: function () {
      var _updateDecorationsBetween = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(editorView, startPos, endPos) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.removeDecorationsBetween(editorView, startPos, endPos);

              case 2:
                _context2.next = 4;
                return this.addDecorationsBetween(editorView, startPos, endPos);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function updateDecorationsBetween(_x5, _x6, _x7) {
        return _updateDecorationsBetween.apply(this, arguments);
      }

      return updateDecorationsBetween;
    }()
  }, {
    key: "addDecorationsBetween",
    value: function () {
      var _addDecorationsBetween = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(editorView, startPos, endPos) {
        var _this = this;

        var selection, _getPluginState, matches, decorationSet, matchesBetween, selectionMatch, selectionIndex;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                selection = editorView.state.selection;
                _getPluginState = (0, _plugin.getPluginState)(editorView.state), matches = _getPluginState.matches, decorationSet = _getPluginState.decorationSet;

                if (!(matches.length === 0)) {
                  _context3.next = 4;
                  break;
                }

                return _context3.abrupt("return");

              case 4:
                matchesBetween = matches.filter(function (m) {
                  return m.start >= startPos && (endPos === undefined || m.start < endPos);
                });
                selectionMatch = matches.find(function (match) {
                  return match.start >= selection.from;
                });
                selectionIndex = matchesBetween.findIndex(function (match) {
                  return match === selectionMatch;
                });
                _context3.next = 9;
                return this.batchRequests(function (counter) {
                  var matchesToDecorate = matchesBetween.slice(counter, counter + batchIncrement);

                  if (matchesToDecorate.length === 0) {
                    return false;
                  }

                  var useSelectionIndex = selectionIndex >= counter && selectionIndex < counter + batchIncrement;

                  if (selectionMatch && useSelectionIndex) {
                    var selectionMatchDecoration = (0, _index.findDecorationFromMatch)(decorationSet, selectionMatch);

                    if (selectionMatchDecoration) {
                      matchesToDecorate.splice(selectionIndex % batchIncrement, 1);
                      useSelectionIndex = false;
                    }
                  }

                  if (_this.addDecorations) {
                    _this.addDecorations((0, _index.createDecorations)(useSelectionIndex ? selectionIndex % batchIncrement : -1, matchesToDecorate));
                  }
                }, {
                  increment: batchIncrement,
                  until: matchesBetween.length
                });

              case 9:
                return _context3.abrupt("return", _context3.sent);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function addDecorationsBetween(_x8, _x9, _x10) {
        return _addDecorationsBetween.apply(this, arguments);
      }

      return addDecorationsBetween;
    }()
  }, {
    key: "removeDecorationsBetween",
    value: function () {
      var _removeDecorationsBetween = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(editorView, startPos, endPos) {
        var _this2 = this;

        var _getPluginState2, decorationSet, decorations;

        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _getPluginState2 = (0, _plugin.getPluginState)(editorView.state), decorationSet = _getPluginState2.decorationSet;
                decorations = decorationSet.find(startPos, endPos);

                if (!(decorations.length === 0)) {
                  _context4.next = 4;
                  break;
                }

                return _context4.abrupt("return");

              case 4:
                _context4.next = 6;
                return this.batchRequests(function (counter) {
                  var decorationsToRemove = decorations.slice(counter, counter + batchIncrement);

                  if (decorationsToRemove.length === 0) {
                    return false;
                  } // only get those decorations whose from >= startPos


                  for (var i = 0; i < decorationsToRemove.length; i++) {
                    if (decorationsToRemove[i].from >= startPos) {
                      break;
                    }

                    decorationsToRemove = decorationsToRemove.slice(1);
                  }

                  if (_this2.removeDecorations) {
                    _this2.removeDecorations(decorationsToRemove);
                  }
                }, {
                  increment: batchIncrement,
                  until: decorations.length
                });

              case 6:
                return _context4.abrupt("return", _context4.sent);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function removeDecorationsBetween(_x11, _x12, _x13) {
        return _removeDecorationsBetween.apply(this, arguments);
      }

      return removeDecorationsBetween;
    }()
    /**
     * Calculates Prosemirror start and end positions we want to apply the decorations
     * between
     * Also calculates the positions the are the start and end of the user's viewport
     * so we can apply decorations there first and work outwards
     */

  }, {
    key: "calcDecorationPositions",
    value: function calcDecorationPositions(editorView, containerElement, pmElement) {
      var containerRect = containerElement.getBoundingClientRect();
      var pmRect = pmElement.getBoundingClientRect();
      var viewportStartPos = this.getStartPos(editorView, 0, pmRect.left);
      var viewportEndPos = this.getEndPos(editorView, containerRect.top + containerRect.height, pmRect.left);
      return {
        viewportStartPos: viewportStartPos,
        viewportEndPos: viewportEndPos,
        startPos: 1,
        endPos: editorView.state.doc.nodeSize
      };
    }
  }, {
    key: "getStartPos",
    value: function getStartPos(editorView, y, x) {
      var startPos = editorView.posAtCoords({
        top: y,
        left: x
      });
      return startPos ? startPos.pos : 1;
    }
  }, {
    key: "getEndPos",
    value: function getEndPos(editorView, y, x) {
      var maxPos = editorView.state.doc.nodeSize;
      var endPos = editorView.posAtCoords({
        top: y,
        left: x
      });
      return endPos ? endPos.pos : maxPos;
    }
    /**
     * Util to batch function calls by animation frames
     * A counter will start at 0 and increment by provided value until reaches limit
     * Passed in fn receives the counter as a param, return false to skip waiting
     * for the animation frame for the next call
     */

  }, {
    key: "batchRequests",
    value: function batchRequests(fn, opts) {
      var _this3 = this;

      var counter = 0;
      var increment = opts.increment,
          until = opts.until;
      return new Promise(function (resolve) {
        var batchedFn = function batchedFn() {
          var result = fn(counter);

          while (result === false && counter < until) {
            counter += increment;
            result = fn(counter);
          }

          if (counter < until) {
            counter += increment;
            _this3.rafId = requestAnimationFrame(batchedFn);
          } else {
            _this3.rafId = undefined;
            resolve();
          }
        };

        _this3.rafId = requestAnimationFrame(batchedFn);
      });
    }
  }]);
  return BatchDecorations;
}();

var batchDecorations = new BatchDecorations();
var _default = batchDecorations;
exports.default = _default;
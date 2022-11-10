import { Decoration } from 'prosemirror-view';
import { TextSelection } from 'prosemirror-state';
import { selectedSearchMatchClass, searchMatchClass } from '../styles';
export function getSelectedText(selection) {
  var text = '';
  var selectedContent = selection.content().content;

  for (var i = 0; i < selectedContent.childCount; i++) {
    text += selectedContent.child(i).textContent;
  }

  return text;
}
export var createDecorations = function createDecorations(selectedIndex, matches) {
  return matches.map(function (_ref, i) {
    var start = _ref.start,
        end = _ref.end;
    return createDecoration(start, end, i === selectedIndex);
  });
};
export var createDecoration = function createDecoration(start, end, isSelected) {
  var className = searchMatchClass;

  if (isSelected) {
    className += " ".concat(selectedSearchMatchClass);
  }

  return Decoration.inline(start, end, {
    class: className
  });
};
export function findMatches(content, searchText, shouldMatchCase) {
  var contentIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var matches = [];
  var searchTextLength = searchText.length;
  var textGrouping = null;

  var collectMatch = function collectMatch(textGrouping) {
    if (!textGrouping) {
      return;
    }

    var text = textGrouping.text,
        relativePos = textGrouping.pos;
    var pos = contentIndex + relativePos;

    if (!shouldMatchCase) {
      searchText = searchText.toLowerCase();
      text = text.toLowerCase();
    }

    var index = text.indexOf(searchText);

    while (index !== -1) {
      // Find the next substring from the end of the first, so that they don't overlap
      var end = index + searchTextLength; // Add the substring index to the position of the node

      matches.push({
        start: pos + index,
        end: pos + end
      });
      index = text.indexOf(searchText, end);
    }
  };

  if (searchTextLength > 0) {
    content.descendants(function (node, pos) {
      if (node.isText) {
        if (textGrouping === null) {
          textGrouping = {
            text: node.text,
            pos: pos
          };
        } else {
          textGrouping.text = textGrouping.text + node.text;
        }
      } else {
        collectMatch(textGrouping);
        textGrouping = null;
      }
    }); // if there's a dangling text grouping and no non-text node to trigger collectMatch, manually collectMatch

    if (textGrouping) {
      collectMatch(textGrouping);
    }
  }

  return matches;
}
/**
 * Finds index of first item in matches array that comes after user's cursor pos.
 * If `backward` is `true`, finds index of first item that comes before instead.
 */

export function findSearchIndex(selectionPos, matches) {
  var backward = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (backward) {
    var matchIndex = matches.findIndex(function (match) {
      return match.start >= selectionPos;
    }) - 1;

    if (matchIndex < 0) {
      matchIndex = matches.length - 1; // wrap around from the end
    }

    return matchIndex;
  }

  return Math.max(matches.findIndex(function (match) {
    return match.start >= selectionPos;
  }), 0);
}
export var nextIndex = function nextIndex(currentIndex, total) {
  return (currentIndex + 1) % total;
};
export var prevIndex = function prevIndex(currentIndex, total) {
  return (currentIndex - 1 + total) % total;
};
export var getSelectionForMatch = function getSelectionForMatch(selection, doc, index, matches) {
  var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

  if (matches[index]) {
    return TextSelection.create(doc, matches[index].start + offset);
  }

  return selection;
};
export var findDecorationFromMatch = function findDecorationFromMatch(decorationSet, match) {
  if (!match) {
    return;
  }

  var decorations = decorationSet.find(match.start, match.end);
  return decorations.length ? decorations.find( // decorationSet.find() returns any decorations that touch the specifided
  // positions, but we want to be stricter
  function (decoration) {
    return decoration.from === match.start && decoration.to === match.end;
  }) : undefined;
};
export var removeDecorationsFromSet = function removeDecorationsFromSet(decorationSet, decorationsToRemove, doc) {
  var prevDecorations = decorationSet.find(); // it is essential that we copy the decorations otherwise in some rare cases
  // prosemirror-view will update our decorationsToRemove array to contain nulls
  // instead of Decorations which ruins our check for lost decorations below

  decorationSet = decorationSet.remove(decorationsToRemove.map(function (decoration) {
    return (// copy exists but isn't on the type definition
      decoration.copy(decoration.from, decoration.to)
    );
  }));
  var newDecorations = decorationSet.find(); // there is a bug in prosemirror-view where it can't cope with deleting inline
  // decorations from a set in some cases (where there are multiple levels of nested
  // children arrays), and it deletes more decorations than it should
  // todo: ticket link

  var lostDecorations = findLostAdjacentDecorations(decorationsToRemove, prevDecorations, newDecorations);

  if (lostDecorations.length > 0) {
    decorationSet = decorationSet.add(doc, lostDecorations);
  }

  return decorationSet;
};
export var removeMatchesFromSet = function removeMatchesFromSet(decorationSet, matches, doc) {
  var decorationsToRemove = matches.filter(function (match) {
    return !!match;
  }).map(function (match) {
    return findDecorationFromMatch(decorationSet, match);
  });
  decorationsToRemove.forEach(function (decoration) {
    if (decoration) {
      decorationSet = removeDecorationsFromSet(decorationSet, [decoration], doc);
    }
  });
  return decorationSet;
};
/**
 * Finds decorations in prevDecorations that are not in newDecorations or decorationsToRemove
 * These decorations have been lost by Prosemirror during an over eager decoration removal
 * We need to be smart to cope with thousands of decorations without crashing everything
 */

export var findLostAdjacentDecorations = function findLostAdjacentDecorations(decorationsToRemove, prevDecorations, newDecorations) {
  var lostDecorations = [];

  if (prevDecorations.length - decorationsToRemove.length > newDecorations.length) {
    var position = decorationsToRemove.length > 0 ? decorationsToRemove[0].from : 0;
    var prevDecorationsStartIdx = findIndexBeforePosition(prevDecorations, position);
    var newDecorationsStartIdx = findIndexBeforePosition(newDecorations, position);
    var startIdx = Math.min(prevDecorationsStartIdx, newDecorationsStartIdx);
    var prevDecorationsToCheck = prevDecorations.slice(startIdx);
    var newDecorationsToCheck = newDecorations.slice(startIdx);
    var uniqueInPrev = [];
    var numToFind = prevDecorationsToCheck.length - newDecorationsToCheck.length;
    var foundAll = false;
    var newDecorationsIdxOffset = 0;

    var _loop = function _loop(i) {
      var prevDecoration = prevDecorationsToCheck[i]; // this was a legit removal, skip and continue

      if (decorationsToRemove.find(function (decoration) {
        return decoration.from === prevDecoration.from;
      })) {
        newDecorationsIdxOffset -= 1;
        return "continue";
      }

      var j = i + newDecorationsIdxOffset; // this is a lost decoration

      if (j >= newDecorationsToCheck.length) {
        uniqueInPrev.push(prevDecoration);

        if (uniqueInPrev.length === numToFind) {
          foundAll = true;
        }
      }

      for (; j < newDecorationsToCheck.length; j++) {
        var newDecoration = newDecorationsToCheck[j]; // decoration found in both arrays, skip and continue

        if (prevDecoration.from === newDecoration.from) {
          break;
        } // this is a lost decoration


        if (newDecoration.from > prevDecoration.from || j === newDecorationsToCheck.length - 1) {
          uniqueInPrev.push(prevDecoration);
          newDecorationsIdxOffset -= 1;

          if (uniqueInPrev.length === numToFind) {
            foundAll = true;
          }

          break;
        }
      }

      if (foundAll) {
        return "break";
      }
    };

    for (var i = 0; i < prevDecorationsToCheck.length; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
      if (_ret === "break") break;
    } // make sure we ignore any that we wanted to delete


    lostDecorations = uniqueInPrev.filter(function (decoration) {
      return !decorationsToRemove.find(function (decorationToRemove) {
        return decoration.from === decorationToRemove.from;
      });
    });
  }

  return lostDecorations;
};
/**
 * Searches through array in bumps of 100 to return the index of the first
 * decoration whose 'from' value is before or equal to the position
 */

export var findIndexBeforePosition = function findIndexBeforePosition(items, position) {
  // jump in batches to cope with arrays with thousands of decorations
  var increment = 100;
  var index = 0;

  for (var i = items.length - 1; i >= 0; i -= increment) {
    if (items[i].from < position) {
      // now we have found the 100 range, we can narrow it down to exact index
      index = i;

      for (var j = i; j <= items.length - 1; j++) {
        if (items[j].from <= position) {
          index = j;
        } else {
          break;
        }
      }

      break;
    }

    if (i < 100 && i > 0) {
      i = 100;
    }
  }

  return index;
};
/**
 * Determines whether a find/replace text Match will be changed as a result
 * of a Step modification to the document. This is evaluated by checking
 * both mapped and unmapped versions of the Step as in different cases the
 * matches will match.
 *
 * **Note:** Match state received here is after step has been applied.
 */

export var isMatchAffectedByStep = function isMatchAffectedByStep(match, step, tr) {
  var from = step.from,
      to = step.to,
      slice = step.slice;
  var sliceSize = slice.content.size;
  return from + sliceSize >= match.start && to - sliceSize <= match.end || tr.mapping.map(from) + sliceSize >= match.start && tr.mapping.map(to) - sliceSize <= match.end;
};
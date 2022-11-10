import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// queues a match at a given position in the document
var matched = function matched(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    resolving: [].concat(_toConsumableArray(state.resolving), [{
      start: action.start,
      end: action.end,
      match: action.match
    }])
  });
}; // store the replacement for a match


var resolved = function resolved(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    matches: [].concat(_toConsumableArray(state.matches), [{
      replacement: action.replacement,
      matchString: action.matchString
    }])
  });
}; // indicates a replacement in the document has been completed, and removes the match from both resolving and matches


var finish = function finish(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    resolving: state.resolving.filter(function (resolving) {
      return resolving.match[0] !== action.matchString;
    }),
    matches: state.matches.filter(function (matching) {
      return matching.matchString !== action.matchString;
    })
  });
};

var reduce = function reduce(state, action) {
  switch (action.action) {
    case 'matched':
      return matched(state, action);

    case 'resolved':
      return resolved(state, action);

    case 'finish':
      return finish(state, action);

    default:
      return state;
  }
};

export default reduce;
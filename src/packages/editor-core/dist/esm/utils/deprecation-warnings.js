function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import { nextMajorVersion } from '../version-wrapper';

var deprecationWarnings = function deprecationWarnings(className, props, deprecations) {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  var nextVersion = nextMajorVersion();

  var _iterator = _createForOfIteratorHelper(deprecations),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var deprecation = _step.value;
      var property = deprecation.property,
          _deprecation$type = deprecation.type,
          type = _deprecation$type === void 0 ? 'enabled by default' : _deprecation$type,
          _deprecation$descript = deprecation.description,
          description = _deprecation$descript === void 0 ? '' : _deprecation$descript,
          _deprecation$conditio = deprecation.condition,
          condition = _deprecation$conditio === void 0 ? function () {
        return true;
      } : _deprecation$conditio;

      if (props.hasOwnProperty(property)) {
        if (condition(props)) {
          // eslint-disable-next-line no-console
          console.warn("".concat(property, " property for ").concat(className, " is deprecated. ").concat(description, " [Will be ").concat(type, " in editor-core@").concat(nextVersion, "]"));
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
};

export default deprecationWarnings;
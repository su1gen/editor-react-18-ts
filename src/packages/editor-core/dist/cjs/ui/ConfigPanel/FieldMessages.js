"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactIntlNext = require("react-intl-next");

var _form = require("@atlaskit/form");

var _types = require("./types");

var _messages = require("./messages");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// sidestep XSS issues
function makeMarkup(fragment, key) {
  var nodeName = fragment.nodeName,
      nodeType = fragment.nodeType,
      childNodes = fragment.childNodes,
      textContent = fragment.textContent;

  if (nodeType === Node.TEXT_NODE) {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: key
    }, textContent);
  } // NOTE: NodeList doesn't have .map


  var children = [];
  childNodes.forEach(function (childNode, i) {
    var markup = makeMarkup(childNode, String(i));

    if (markup) {
      children.push(markup);
    }
  });

  switch (nodeName) {
    case 'B':
      return /*#__PURE__*/_react.default.createElement("b", {
        key: key
      }, children);

    case 'I':
      return /*#__PURE__*/_react.default.createElement("i", {
        key: key
      }, children);

    case 'STRONG':
      return /*#__PURE__*/_react.default.createElement("strong", {
        key: key
      }, children);

    case 'EM':
      return /*#__PURE__*/_react.default.createElement("em", {
        key: key
      }, children);

    case 'CODE':
      return /*#__PURE__*/_react.default.createElement("code", {
        key: key
      }, children);
  }

  if (children.length === 1) {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, {
      key: key
    }, children[0]);
  }

  if (children.length) {
    return /*#__PURE__*/_react.default.createElement("span", {
      key: key
    }, children);
  }

  return null;
}

function Description(_ref) {
  var description = _ref.description;
  var markup = (0, _react.useMemo)(function () {
    var dom = new DOMParser().parseFromString(description, 'text/html');
    return makeMarkup(dom);
  }, [description]);
  return /*#__PURE__*/_react.default.createElement(_form.HelperMessage, null, markup);
}

var FieldMessages = function FieldMessages(_ref2) {
  var error = _ref2.error,
      description = _ref2.description,
      intl = _ref2.intl;

  if (!error && description) {
    return /*#__PURE__*/_react.default.createElement(Description, {
      description: description
    });
  }

  switch (error) {
    case _types.ValidationError.Required:
      return /*#__PURE__*/_react.default.createElement(_form.ErrorMessage, null, intl.formatMessage(_messages.messages.required));

    case _types.ValidationError.Invalid:
      return /*#__PURE__*/_react.default.createElement(_form.ErrorMessage, null, intl.formatMessage(_messages.messages.invalid));

    case _types.FieldTypeError.isMultipleAndRadio:
      return /*#__PURE__*/_react.default.createElement(_form.ErrorMessage, null, intl.formatMessage(_messages.messages.isMultipleAndRadio));

    default:
      return null;
  }
};

var _default = (0, _reactIntlNext.injectIntl)(FieldMessages);

exports.default = _default;
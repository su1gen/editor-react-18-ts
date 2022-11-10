import React, { Fragment, useMemo } from 'react';
import { injectIntl } from 'react-intl-next';
import { ErrorMessage, HelperMessage } from '@atlaskit/form';
import { ValidationError, FieldTypeError } from './types';
import { messages } from './messages'; // sidestep XSS issues

function makeMarkup(fragment, key) {
  var nodeName = fragment.nodeName,
      nodeType = fragment.nodeType,
      childNodes = fragment.childNodes,
      textContent = fragment.textContent;

  if (nodeType === Node.TEXT_NODE) {
    return /*#__PURE__*/React.createElement(Fragment, {
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
      return /*#__PURE__*/React.createElement("b", {
        key: key
      }, children);

    case 'I':
      return /*#__PURE__*/React.createElement("i", {
        key: key
      }, children);

    case 'STRONG':
      return /*#__PURE__*/React.createElement("strong", {
        key: key
      }, children);

    case 'EM':
      return /*#__PURE__*/React.createElement("em", {
        key: key
      }, children);

    case 'CODE':
      return /*#__PURE__*/React.createElement("code", {
        key: key
      }, children);
  }

  if (children.length === 1) {
    return /*#__PURE__*/React.createElement(Fragment, {
      key: key
    }, children[0]);
  }

  if (children.length) {
    return /*#__PURE__*/React.createElement("span", {
      key: key
    }, children);
  }

  return null;
}

function Description(_ref) {
  var description = _ref.description;
  var markup = useMemo(function () {
    var dom = new DOMParser().parseFromString(description, 'text/html');
    return makeMarkup(dom);
  }, [description]);
  return /*#__PURE__*/React.createElement(HelperMessage, null, markup);
}

var FieldMessages = function FieldMessages(_ref2) {
  var error = _ref2.error,
      description = _ref2.description,
      intl = _ref2.intl;

  if (!error && description) {
    return /*#__PURE__*/React.createElement(Description, {
      description: description
    });
  }

  switch (error) {
    case ValidationError.Required:
      return /*#__PURE__*/React.createElement(ErrorMessage, null, intl.formatMessage(messages.required));

    case ValidationError.Invalid:
      return /*#__PURE__*/React.createElement(ErrorMessage, null, intl.formatMessage(messages.invalid));

    case FieldTypeError.isMultipleAndRadio:
      return /*#__PURE__*/React.createElement(ErrorMessage, null, intl.formatMessage(messages.isMultipleAndRadio));

    default:
      return null;
  }
};

export default injectIntl(FieldMessages);
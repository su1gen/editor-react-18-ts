import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
var _excluded = ["value"];
import _regeneratorRuntime from "@babel/runtime/regenerator";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import React, { useEffect, useState } from 'react';
import { Field } from '@atlaskit/form';
import SmartUserPicker, { hydrateDefaultValues } from '@atlaskit/smart-user-picker';
import { getUserFieldContextProvider } from '@atlaskit/editor-common/extensions';
import UnhandledType from './UnhandledType';
import { validate as _validate } from '../utils';
import FieldMessages from '../FieldMessages';

function makeCompat(defaultValue) {
  if (!defaultValue) {
    return null;
  }

  if (Array.isArray(defaultValue)) {
    return defaultValue.map(function (id) {
      return {
        type: 'user',
        id: id
      };
    });
  }

  return {
    type: 'user',
    id: defaultValue
  };
}

function makeSafe(value) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    var ids = [];

    var _iterator = _createForOfIteratorHelper(value),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var id = _step.value.id;
        ids.push(id);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return ids;
  }

  return value.id;
}

var isOptionData = function isOptionData(value) {
  if (!value) {
    return false;
  }

  return (Array.isArray(value) ? value : [value]).every(function (item) {
    return 'name' in item;
  });
};

function SafeSmartUserPicker(_ref) {
  var context = _ref.context,
      field = _ref.field,
      formFieldProps = _ref.formFieldProps,
      autoFocus = _ref.autoFocus,
      onBlur = _ref.onBlur,
      onChange = _ref.onChange;

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      unsafeValue = _useState2[0],
      setUnsafeValue = _useState2[1];

  var siteId = context.siteId,
      principalId = context.principalId,
      fieldId = context.fieldId,
      productKey = context.productKey,
      containerId = context.containerId,
      objectId = context.objectId,
      childObjectId = context.childObjectId,
      productAttributes = context.productAttributes,
      _context$includeUsers = context.includeUsers,
      includeUsers = _context$includeUsers === void 0 ? true : _context$includeUsers;

  var safeValue = formFieldProps.value,
      formFieldPropsRest = _objectWithoutProperties(formFieldProps, _excluded);

  var isMultiple = field.isMultiple,
      placeholder = field.placeholder;

  function onChangeUnsafe(newValue) {
    setUnsafeValue(newValue);
    onChange(makeSafe(newValue));
  }

  useEffect(function () {
    var cancel = false;

    function hydrate() {
      return _hydrate.apply(this, arguments);
    }

    function _hydrate() {
      _hydrate = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var hydrated;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return hydrateDefaultValues(undefined, // no need to override baseUrl
                makeCompat(safeValue), productKey);

              case 2:
                hydrated = _context.sent;

                if (!(cancel || !isOptionData(hydrated))) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return");

              case 5:
                setUnsafeValue(hydrated);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      return _hydrate.apply(this, arguments);
    }

    hydrate();
    return function () {
      cancel = true;
    };
  }, [safeValue, productKey]);
  return /*#__PURE__*/React.createElement(SmartUserPicker, _extends({}, formFieldPropsRest, {
    onChange: onChangeUnsafe,
    autoFocus: autoFocus,
    onBlur: onBlur,
    maxOptions: 10,
    isClearable: true,
    isMulti: isMultiple,
    includeUsers: includeUsers,
    includeGroups: false,
    includeTeams: false,
    fieldId: fieldId,
    principalId: principalId,
    siteId: siteId,
    productKey: productKey,
    objectId: objectId,
    containerId: containerId,
    childObjectId: childObjectId,
    placeholder: placeholder,
    productAttributes: productAttributes,
    value: unsafeValue,
    width: "100%"
  }));
}

export default function UserSelect(_ref2) {
  var name = _ref2.name,
      autoFocus = _ref2.autoFocus,
      extensionManifest = _ref2.extensionManifest,
      field = _ref2.field,
      onFieldChange = _ref2.onFieldChange;

  var _useState3 = useState({}),
      _useState4 = _slicedToArray(_useState3, 2),
      context = _useState4[0],
      setContext = _useState4[1];

  var siteId = context.siteId,
      principalId = context.principalId,
      fieldId = context.fieldId,
      productKey = context.productKey;
  var label = field.label,
      defaultValue = field.defaultValue,
      description = field.description,
      isRequired = field.isRequired,
      options = field.options;
  var type = options.provider.type;
  useEffect(function () {
    var cancel = false;

    function fetchContext() {
      return _fetchContext.apply(this, arguments);
    }

    function _fetchContext() {
      _fetchContext = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var _context2;

        return _regeneratorRuntime.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return getUserFieldContextProvider(extensionManifest, field.options.provider);

              case 3:
                _context3.t0 = _context3.sent;
                _context3.next = 6;
                return (0, _context3.t0)();

              case 6:
                _context2 = _context3.sent;

                if (!cancel) {
                  _context3.next = 9;
                  break;
                }

                return _context3.abrupt("return");

              case 9:
                setContext(_context2);
                _context3.next = 15;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t1 = _context3["catch"](0);
                // eslint-disable-next-line no-console
                console.error(_context3.t1);

              case 15:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, null, [[0, 12]]);
      }));
      return _fetchContext.apply(this, arguments);
    }

    fetchContext();
    return function () {
      cancel = true;
    };
  }, [extensionManifest, field.options.provider]);
  return /*#__PURE__*/React.createElement(Field, {
    name: name,
    label: label,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: function validate(value) {
      return _validate(field, value);
    }
  }, function (_ref3) {
    var fieldProps = _ref3.fieldProps,
        error = _ref3.error;

    // if any of these don't exists, the provider is missing
    if (!siteId || !principalId || !fieldId || !productKey) {
      return /*#__PURE__*/React.createElement(UnhandledType, {
        key: name,
        field: field,
        errorMessage: "Field \"".concat(name, "\" can't be renderered. Missing provider for \"").concat(type, "\".")
      });
    }

    function onChange(newValue) {
      fieldProps.onChange(newValue);
      onFieldChange(name, true);
    }

    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SafeSmartUserPicker, {
      context: context,
      field: field,
      formFieldProps: fieldProps,
      autoFocus: autoFocus || false,
      onBlur: function onBlur() {
        return onFieldChange(name, true);
      },
      onChange: onChange
    }), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    }));
  });
}
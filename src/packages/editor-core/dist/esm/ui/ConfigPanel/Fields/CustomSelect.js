import _extends from "@babel/runtime/helpers/extends";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl-next';
import { messages } from '../messages';
import { Field } from '@atlaskit/form';
import { AsyncCreatableSelect } from '@atlaskit/select';
import { formatOptionLabel } from './SelectItem';
import { getCustomFieldResolver } from '@atlaskit/editor-common/extensions';
import FieldMessages from '../FieldMessages';
import UnhandledType from './UnhandledType';
import { validate as _validate } from '../utils';

function FieldError(_ref) {
  var name = _ref.name,
      field = _ref.field;
  var type = field.options.resolver.type;
  return /*#__PURE__*/React.createElement(UnhandledType, {
    key: name,
    field: field,
    errorMessage: "Field \"".concat(name, "\" can't be rendered. Missing resolver for \"").concat(type, "\".")
  });
}

function CustomSelect(_ref2) {
  var name = _ref2.name,
      autoFocus = _ref2.autoFocus,
      extensionManifest = _ref2.extensionManifest,
      placeholder = _ref2.placeholder,
      field = _ref2.field,
      onFieldChange = _ref2.onFieldChange,
      parameters = _ref2.parameters,
      intl = _ref2.intl;
  var fieldDefaultValue = field.defaultValue,
      description = field.description,
      isMultiple = field.isMultiple,
      isRequired = field.isRequired,
      label = field.label,
      options = field.options;

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      resolver = _useState4[0],
      setResolver = _useState4[1];

  var _useState5 = useState([]),
      _useState6 = _slicedToArray(_useState5, 2),
      defaultOptions = _useState6[0],
      setDefaultOptions = _useState6[1];

  var _useState7 = useState(undefined),
      _useState8 = _slicedToArray(_useState7, 2),
      defaultValue = _useState8[0],
      setDefaultValue = _useState8[1];

  useEffect(function () {
    var cancel = false;

    function fetchResolver() {
      return _fetchResolver.apply(this, arguments);
    }

    function _fetchResolver() {
      _fetchResolver = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var _resolver, _options;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                setLoading(true);
                _context.prev = 1;
                _context.next = 4;
                return getCustomFieldResolver(extensionManifest, field.options.resolver);

              case 4:
                _resolver = _context.sent;

                if (!cancel) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return");

              case 7:
                setResolver(function () {
                  return _resolver;
                }); // fetch the default values

                _context.next = 10;
                return _resolver(undefined, fieldDefaultValue, parameters);

              case 10:
                _options = _context.sent;
                setDefaultOptions(_options);

                if (!cancel) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("return");

              case 14:
                // filter returned values to match the defaultValue
                if (fieldDefaultValue && isMultiple) {
                  setDefaultValue(_options.filter(function (option) {
                    return fieldDefaultValue.includes(option.value);
                  }));
                }

                if (fieldDefaultValue && !isMultiple) {
                  setDefaultValue(_options.find(function (option) {
                    return fieldDefaultValue === option.value;
                  }));
                }

                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](1);
                // eslint-disable-next-line no-console
                console.error(_context.t0);

              case 21:
                setLoading(false);

              case 22:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[1, 18]]);
      }));
      return _fetchResolver.apply(this, arguments);
    }

    fetchResolver();
    return function () {
      cancel = true;
    };
  }, [extensionManifest, field.options.resolver, fieldDefaultValue, isMultiple, parameters]);

  function _formatCreateLabel(value) {
    if (!value) {
      return null;
    }

    var message = intl.formatMessage(messages.createOption);
    return "".concat(message, " \"").concat(value, "\"");
  }

  var isCreatable = options.isCreatable;
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
    return /*#__PURE__*/React.createElement(React.Fragment, null, resolver && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AsyncCreatableSelect, _extends({}, fieldProps, {
      onChange: function onChange(value) {
        fieldProps.onChange(value); // We assume onChange is called whenever values actually changed
        // for isDirty

        onFieldChange(name, true);
      } // @see DST-2386 & ED-12503
      ,
      enableAnimation: false // add type cast to avoid adding a "IsMulti" generic prop (TODO: ED-12072)
      ,
      isMulti: isMultiple || false,
      isClearable: true,
      isValidNewOption: function isValidNewOption(value) {
        return isCreatable && value;
      },
      validationState: error ? 'error' : 'default',
      defaultOptions: defaultOptions,
      formatCreateLabel: function formatCreateLabel(value) {
        return _formatCreateLabel(value);
      },
      formatOptionLabel: formatOptionLabel,
      loadOptions: function loadOptions(searchTerm) {
        return resolver(searchTerm, fieldDefaultValue, parameters);
      },
      autoFocus: autoFocus,
      placeholder: placeholder
    })), /*#__PURE__*/React.createElement(FieldMessages, {
      error: error,
      description: description
    })), !loading && !resolver && /*#__PURE__*/React.createElement(FieldError, {
      name: name,
      field: field
    }));
  });
}

export default injectIntl(CustomSelect);
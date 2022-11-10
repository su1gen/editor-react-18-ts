"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _reactIntlNext = require("react-intl-next");

var _messages = require("../messages");

var _form = require("@atlaskit/form");

var _select = require("@atlaskit/select");

var _SelectItem = require("./SelectItem");

var _extensions = require("@atlaskit/editor-common/extensions");

var _FieldMessages = _interopRequireDefault(require("../FieldMessages"));

var _UnhandledType = _interopRequireDefault(require("./UnhandledType"));

var _utils = require("../utils");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function FieldError(_ref) {
  var name = _ref.name,
      field = _ref.field;
  var type = field.options.resolver.type;
  return /*#__PURE__*/_react.default.createElement(_UnhandledType.default, {
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

  var _useState = (0, _react.useState)(true),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      loading = _useState2[0],
      setLoading = _useState2[1];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      resolver = _useState4[0],
      setResolver = _useState4[1];

  var _useState5 = (0, _react.useState)([]),
      _useState6 = (0, _slicedToArray2.default)(_useState5, 2),
      defaultOptions = _useState6[0],
      setDefaultOptions = _useState6[1];

  var _useState7 = (0, _react.useState)(undefined),
      _useState8 = (0, _slicedToArray2.default)(_useState7, 2),
      defaultValue = _useState8[0],
      setDefaultValue = _useState8[1];

  (0, _react.useEffect)(function () {
    var cancel = false;

    function fetchResolver() {
      return _fetchResolver.apply(this, arguments);
    }

    function _fetchResolver() {
      _fetchResolver = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
        var _resolver, _options;

        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                setLoading(true);
                _context.prev = 1;
                _context.next = 4;
                return (0, _extensions.getCustomFieldResolver)(extensionManifest, field.options.resolver);

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

    var message = intl.formatMessage(_messages.messages.createOption);
    return "".concat(message, " \"").concat(value, "\"");
  }

  var isCreatable = options.isCreatable;
  return /*#__PURE__*/_react.default.createElement(_form.Field, {
    name: name,
    label: label,
    isRequired: isRequired,
    defaultValue: defaultValue,
    validate: function validate(value) {
      return (0, _utils.validate)(field, value);
    }
  }, function (_ref3) {
    var fieldProps = _ref3.fieldProps,
        error = _ref3.error;
    return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, resolver && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_select.AsyncCreatableSelect, (0, _extends2.default)({}, fieldProps, {
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
      formatOptionLabel: _SelectItem.formatOptionLabel,
      loadOptions: function loadOptions(searchTerm) {
        return resolver(searchTerm, fieldDefaultValue, parameters);
      },
      autoFocus: autoFocus,
      placeholder: placeholder
    })), /*#__PURE__*/_react.default.createElement(_FieldMessages.default, {
      error: error,
      description: description
    })), !loading && !resolver && /*#__PURE__*/_react.default.createElement(FieldError, {
      name: name,
      field: field
    }));
  });
}

var _default = (0, _reactIntlNext.injectIntl)(CustomSelect);

exports.default = _default;
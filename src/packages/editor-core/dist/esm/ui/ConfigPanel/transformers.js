import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _typeof from "@babel/runtime/helpers/typeof";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import _regeneratorRuntime from "@babel/runtime/regenerator";
import { isFieldset, isDateRange, isTabGroup, isTabField, isExpand, getFieldSerializer, getFieldDeserializer } from '@atlaskit/editor-common/extensions';
import { getNameFromDuplicateField, isDuplicateField } from './utils';

var isOption = function isOption(option) {
  return option && _typeof(option) === 'object' && 'label' in option && 'value' in option;
};

var isOptions = function isOptions(options) {
  return Array.isArray(options) && options.every(isOption);
};

/** maps the typed-values from the Form values object */
function extract(value, field, options) {
  if (isOptions(value)) {
    return value.map(function (item) {
      return item.value;
    });
  } else if (isOption(value)) {
    return value.value;
  } else if (isDateRange(value)) {
    return value;
  } else if (value !== undefined && field.type === 'number') {
    if (value === '') {
      return;
    }

    return Number(value);
  } // Workaround for https://product-fabric.atlassian.net/browse/DST-2701
  else if (options !== null && options !== void 0 && options.useDefaultValue && value === undefined && 'defaultValue' in field) {
    return field.defaultValue;
  }

  return value;
}

export var findDuplicateFields = function findDuplicateFields(fields) {
  return findDuplicateFieldsInternal(flattenFields(fields));
};

var findDuplicateFieldsInternal = function findDuplicateFieldsInternal(fields) {
  var allowDuplicatesMap = {};
  return fields.find(function (field) {
    if (isExpand(field)) {
      return findDuplicateFieldsInternal(field.fields);
    } else if (isTabGroup(field)) {
      return field.fields.find(function (tabField) {
        return findDuplicateFieldsInternal(tabField.fields);
      });
    } else if (allowDuplicatesMap[field.name] === undefined) {
      allowDuplicatesMap[field.name] = !!field.allowDuplicates;
      return;
    } else if (!field.allowDuplicates || !allowDuplicatesMap[field.name]) {
      return field;
    }

    return;
  });
};

export var serialize = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(manifest, data, fields) {
    var options,
        result,
        _options$depth,
        depth,
        parentType,
        flattenedFields,
        fillResults,
        parameters,
        hasDuplicateFields,
        _args2 = arguments;

    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            options = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {};
            result = [];
            _options$depth = options.depth, depth = _options$depth === void 0 ? 0 : _options$depth, parentType = options.parentType;
            flattenedFields = flattenFields(fields);
            fillResults = flattenedFields.map( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(field) {
                var tabGroupData, tabData, expandData, fieldsetData, value;
                return _regeneratorRuntime.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        if (!isTabGroup(field)) {
                          _context.next = 7;
                          break;
                        }

                        _context.next = 3;
                        return serializeTabGroupField(manifest, field, data);

                      case 3:
                        tabGroupData = _context.sent;
                        result.push.apply(result, _toConsumableArray(tabGroupData));
                        _context.next = 30;
                        break;

                      case 7:
                        if (!isTabField(field)) {
                          _context.next = 14;
                          break;
                        }

                        _context.next = 10;
                        return serializeTabField(manifest, field, data);

                      case 10:
                        tabData = _context.sent;
                        result.push.apply(result, _toConsumableArray(tabData));
                        _context.next = 30;
                        break;

                      case 14:
                        if (!isExpand(field)) {
                          _context.next = 21;
                          break;
                        }

                        _context.next = 17;
                        return serializeExpandField(manifest, field, data);

                      case 17:
                        expandData = _context.sent;
                        result.push.apply(result, _toConsumableArray(expandData));
                        _context.next = 30;
                        break;

                      case 21:
                        if (!(isFieldset(field) && depth === 0)) {
                          _context.next = 28;
                          break;
                        }

                        _context.next = 24;
                        return serializeFieldset(manifest, field, data, depth);

                      case 24:
                        fieldsetData = _context.sent;

                        if (fieldsetData) {
                          result.push(fieldsetData);
                        }

                        _context.next = 30;
                        break;

                      case 28:
                        value = extract(data[field.name], field, {
                          useDefaultValue: true
                        }); // ignore undefined values

                        if (value !== undefined) {
                          result.push(_defineProperty({}, field.name, value));
                        }

                      case 30:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function (_x4) {
                return _ref2.apply(this, arguments);
              };
            }());
            _context2.next = 7;
            return Promise.all(fillResults);

          case 7:
            // Crunch fields down to parameters
            parameters = result.reduce(function (obj, current) {
              for (var _key in current) {
                obj[_key] = current[_key];
              }

              return obj;
            }, {}); // Fix up duplicate values (currently only for fieldsets)

            hasDuplicateFields = parentType === 'fieldset' && !!flattenedFields.find(function (field) {
              return field.allowDuplicates;
            });

            if (!hasDuplicateFields) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", serializeMergeDuplicateFieldData(parameters, data, flattenedFields));

          case 11:
            return _context2.abrupt("return", parameters);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function serialize(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var serializeFieldset = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(manifest, field, data, depth) {
    var fieldSerializer, fieldsetFields, fieldParams, extracted;
    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return getFieldSerializer(manifest, field.options.transformer);

          case 3:
            fieldSerializer = _context3.sent;
            _context3.next = 10;
            break;

          case 6:
            _context3.prev = 6;
            _context3.t0 = _context3["catch"](0);

            if (!(data[field.name] !== undefined)) {
              _context3.next = 10;
              break;
            }

            throw _context3.t0;

          case 10:
            if (fieldSerializer) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt("return");

          case 12:
            fieldsetFields = field.fields;
            fieldParams = extract(data[field.name], field, {
              useDefaultValue: true
            }) || {};
            _context3.next = 16;
            return serialize(manifest, fieldParams, fieldsetFields, {
              depth: depth + 1,
              parentType: 'fieldset'
            });

          case 16:
            extracted = _context3.sent;
            return _context3.abrupt("return", _defineProperty({}, field.name, fieldSerializer(extracted)));

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 6]]);
  }));

  return function serializeFieldset(_x5, _x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();

var serializeExpandField = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(manifest, field, data) {
    var expandData, value, results, fieldName;
    return _regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            expandData = field.hasGroupedValues ? data[field.name] || {} : data;
            _context4.next = 3;
            return serialize(manifest, expandData, field.fields, {
              parentType: 'expand'
            });

          case 3:
            value = _context4.sent;
            results = [];

            if (!field.hasGroupedValues) {
              for (fieldName in value) {
                results.push(_defineProperty({}, fieldName, value[fieldName]));
              }
            } else {
              results.push(_defineProperty({}, field.name, value));
            }

            return _context4.abrupt("return", results);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function serializeExpandField(_x9, _x10, _x11) {
    return _ref5.apply(this, arguments);
  };
}();

var resolveTabValues = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(manifest, tabField, groupData) {
    var tabFieldParams;
    return _regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            tabFieldParams = tabField.hasGroupedValues ? groupData[tabField.name] || {} : groupData;
            _context5.next = 3;
            return serialize(manifest, tabFieldParams, tabField.fields, {
              parentType: 'tab'
            });

          case 3:
            return _context5.abrupt("return", _context5.sent);

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function resolveTabValues(_x12, _x13, _x14) {
    return _ref6.apply(this, arguments);
  };
}();

var serializeTabGroupField = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6(manifest, field, data) {
    var tabs, results, value, i, tabField, tabFieldParameters, fieldName, _fieldName;

    return _regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            tabs = field.fields;
            results = [];
            value = {};
            i = 0;

          case 4:
            if (!(i < tabs.length)) {
              _context6.next = 13;
              break;
            }

            tabField = tabs[i];
            _context6.next = 8;
            return resolveTabValues(manifest, tabField, field.hasGroupedValues ? data[field.name] || {} : data);

          case 8:
            tabFieldParameters = _context6.sent;

            if (tabField.hasGroupedValues) {
              // Keep namespaced by tab
              value[tabField.name] = tabFieldParameters;
            } else {
              // Copy into tabGroup value
              for (fieldName in tabFieldParameters) {
                value[fieldName] = tabFieldParameters[fieldName];
              }
            }

          case 10:
            i++;
            _context6.next = 4;
            break;

          case 13:
            // Now for tabGroup...
            if (field.hasGroupedValues) {
              results.push(_defineProperty({}, field.name, value));
            } else {
              for (_fieldName in value) {
                results.push(_defineProperty({}, _fieldName, value));
              }
            }

            return _context6.abrupt("return", results);

          case 15:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));

  return function serializeTabGroupField(_x15, _x16, _x17) {
    return _ref7.apply(this, arguments);
  };
}();

var serializeTabField = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(manifest, field, data) {
    var results, tabField, tabFieldParameters, fieldName;
    return _regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            results = [];
            tabField = field;
            _context7.next = 4;
            return resolveTabValues(manifest, tabField, data);

          case 4:
            tabFieldParameters = _context7.sent;

            if (tabField.hasGroupedValues) {
              // Keep namespaced by tab
              results.push(_defineProperty({}, tabField.name, tabFieldParameters));
            } else {
              // Copy into tabGroup value
              for (fieldName in tabFieldParameters) {
                results.push(_defineProperty({}, fieldName, tabFieldParameters[fieldName]));
              }
            }

            return _context7.abrupt("return", results);

          case 7:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function serializeTabField(_x18, _x19, _x20) {
    return _ref8.apply(this, arguments);
  };
}();

var serializeMergeDuplicateFieldData = function serializeMergeDuplicateFieldData(parameters, formData, flattenedFields) {
  // Weed out all the non-duplicate field names
  var allDuplicateFieldNames = Object.keys(formData).filter(function (key) {
    return isDuplicateField(key);
  });
  return flattenedFields.reduce(function (newParams, field) {
    var paramValue = parameters[field.name];

    if (!field.allowDuplicates && paramValue !== undefined) {
      newParams[field.name] = paramValue;
    } else {
      // extract the given duplicate values through the field
      var duplicateValues = allDuplicateFieldNames.filter(function (name) {
        return getNameFromDuplicateField(name) === field.name;
      }).map(function (duplicateFieldName) {
        return extract(formData[duplicateFieldName], field, {
          useDefaultValue: true
        });
      }); // Merge and ensure that all values are worth serializing

      var mergedValues = [paramValue].concat(_toConsumableArray(duplicateValues)).filter(function (value) {
        return value !== undefined;
      });

      if (mergedValues.length > 0) {
        // Replace so the duplicate field values are saved under the
        // fieldName as an array
        newParams[field.name] = mergedValues;
      }
    }

    return newParams;
  }, {});
};

function injectDefaultValues(data, fields) {
  var copy = _toConsumableArray(convertToParametersArray(data));

  var _iterator = _createForOfIteratorHelper(fields),
      _step;

  try {
    var _loop = function _loop() {
      var field = _step.value;
      var name = field.name;
      var fieldIndex = copy.findIndex(function (item) {
        return Object.entries(item)[0][0] === name;
      });

      if (fieldIndex >= 0 && !isFieldset(field)) {
        return "continue";
      }

      if (isFieldset(field)) {
        var fieldsetFields = field.fields;

        if (fieldIndex >= 0) {
          var fieldValue = Object.entries(copy[fieldIndex])[0][1];
          copy[fieldIndex] = _defineProperty({}, name, injectDefaultValues(fieldValue, fieldsetFields));
        } else {
          copy.push(_defineProperty({}, name, injectDefaultValues({}, fieldsetFields)));
        }
      }

      if ('defaultValue' in field) {
        copy.push(_defineProperty({}, name, field.defaultValue));
      }
    };

    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return convertToParametersObject(copy);
}
/**
 * Flattens the given FieldDefinition[] so it resembles the expected data
 * structure in result Parameters.
 */


var flattenFields = function flattenFields(fields) {
  var flattenAccumulator = function flattenAccumulator(accumulator, field) {
    if (isTabGroup(field)) {
      if (field.hasGroupedValues) {
        accumulator.push(field);
      } else {
        var flattenedTabs = field.fields.reduce(function (tabAccumulator, tab) {
          return tabAccumulator.concat(tab.hasGroupedValues ? tab : tab.fields.reduce(flattenAccumulator, []));
        }, []);
        accumulator.push.apply(accumulator, _toConsumableArray(flattenedTabs));
      }
    } else if (isExpand(field)) {
      if (field.hasGroupedValues) {
        accumulator.push(field);
      } else {
        var flattenedExpand = field.fields.reduce(flattenAccumulator, []);
        accumulator.push.apply(accumulator, _toConsumableArray(flattenedExpand));
      }
    } else {
      accumulator.push(field);
    }

    return accumulator;
  };

  return fields.reduce(flattenAccumulator, []);
};

export var deserialize = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8(manifest, data, fields) {
    var depth,
        dataArray,
        result,
        errors,
        flattenedFields,
        _iterator2,
        _step2,
        _loop2,
        _ret2,
        _args9 = arguments;

    return _regeneratorRuntime.wrap(function _callee8$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            depth = _args9.length > 3 && _args9[3] !== undefined ? _args9[3] : 0;
            dataArray = convertToParametersArray(data);
            result = [];
            errors = [];
            flattenedFields = flattenFields(fields);
            _iterator2 = _createForOfIteratorHelper(dataArray);
            _context9.prev = 6;
            _loop2 = /*#__PURE__*/_regeneratorRuntime.mark(function _loop2() {
              var item, _Object$entries$, name, originalValue, field, value, fieldDeserializer;

              return _regeneratorRuntime.wrap(function _loop2$(_context8) {
                while (1) {
                  switch (_context8.prev = _context8.next) {
                    case 0:
                      item = _step2.value;
                      _Object$entries$ = _slicedToArray(Object.entries(item)[0], 2), name = _Object$entries$[0], originalValue = _Object$entries$[1];
                      field = flattenedFields.find(function (field) {
                        return field.name === getNameFromDuplicateField(name);
                      });

                      if (!(field === undefined)) {
                        _context8.next = 5;
                        break;
                      }

                      return _context8.abrupt("return", "continue");

                    case 5:
                      value = extract(originalValue, field);

                      if (!(value === undefined)) {
                        _context8.next = 8;
                        break;
                      }

                      return _context8.abrupt("return", "continue");

                    case 8:
                      if (!(isFieldset(field) && depth === 0)) {
                        _context8.next = 24;
                        break;
                      }

                      _context8.next = 11;
                      return getFieldDeserializer(manifest, field.options.transformer);

                    case 11:
                      fieldDeserializer = _context8.sent;

                      if (!fieldDeserializer) {
                        _context8.next = 24;
                        break;
                      }

                      _context8.prev = 13;
                      value = fieldDeserializer(value);
                      _context8.next = 21;
                      break;

                    case 17:
                      _context8.prev = 17;
                      _context8.t0 = _context8["catch"](13);
                      errors.push(_defineProperty({}, name, _context8.t0 instanceof Error ? _context8.t0.message : String(_context8.t0)));
                      return _context8.abrupt("return", "continue");

                    case 21:
                      _context8.next = 23;
                      return deserialize(manifest, value, field.fields, depth + 1);

                    case 23:
                      value = _context8.sent;

                    case 24:
                      result.push(_defineProperty({}, name, value));

                    case 25:
                    case "end":
                      return _context8.stop();
                  }
                }
              }, _loop2, null, [[13, 17]]);
            });

            _iterator2.s();

          case 9:
            if ((_step2 = _iterator2.n()).done) {
              _context9.next = 16;
              break;
            }

            return _context9.delegateYield(_loop2(), "t0", 11);

          case 11:
            _ret2 = _context9.t0;

            if (!(_ret2 === "continue")) {
              _context9.next = 14;
              break;
            }

            return _context9.abrupt("continue", 14);

          case 14:
            _context9.next = 9;
            break;

          case 16:
            _context9.next = 21;
            break;

          case 18:
            _context9.prev = 18;
            _context9.t1 = _context9["catch"](6);

            _iterator2.e(_context9.t1);

          case 21:
            _context9.prev = 21;

            _iterator2.f();

            return _context9.finish(21);

          case 24:
            result = convertToParametersObject(result);

            if (errors.length > 0) {
              result.errors = convertToParametersObject(errors);
            }

            return _context9.abrupt("return", injectDefaultValues(result, flattenedFields));

          case 27:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee8, null, [[6, 18, 21, 24]]);
  }));

  return function deserialize(_x21, _x22, _x23) {
    return _ref9.apply(this, arguments);
  };
}();

var convertToParametersObject = function convertToParametersObject() {
  var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  if (!Array.isArray(parameters)) {
    return parameters;
  }

  return parameters.reduce(function (obj, current) {
    for (var _key2 in current) {
      var keys = Object.keys(obj);
      var resultKey = _key2;
      var idx = 1;

      while (keys.indexOf(resultKey) >= 0) {
        resultKey = "".concat(getNameFromDuplicateField(_key2), ":").concat(idx);
        idx++;
      }

      obj[resultKey] = current[_key2];
    }

    return obj;
  }, {});
};

var convertToParametersArray = function convertToParametersArray() {
  var parameters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  if (Array.isArray(parameters)) {
    return parameters;
  }

  var dataArray = [];

  for (var name in parameters) {
    dataArray.push(_defineProperty({}, name, parameters[name]));
  }

  return dataArray;
};
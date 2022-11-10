"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FieldsLoader;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _useStateFromPromise3 = require("../../utils/react-hooks/use-state-from-promise");

var _ConfigPanel = _interopRequireDefault(require("./ConfigPanel"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var getFieldsDefinitionFn = function getFieldsDefinitionFn(extensionManifest, nodeKey) {
  if (extensionManifest && extensionManifest.modules.nodes && extensionManifest.modules.nodes[nodeKey] && extensionManifest.modules.nodes[nodeKey].getFieldsDefinition) {
    return extensionManifest.modules.nodes[nodeKey].getFieldsDefinition;
  }
}; // having the default value in the props instead of a reference will cause excessive rerenders


var defaultEmptyObject = {};

var FieldDefinitionsPromiseResolver = function FieldDefinitionsPromiseResolver(props) {
  var extensionManifest = props.extensionManifest,
      nodeKey = props.nodeKey,
      extensionParameters = props.extensionParameters,
      setErrorMessage = props.setErrorMessage;

  var _useState = (0, _react.useState)(undefined),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      fields = _useState2[0],
      setFields = _useState2[1]; // Resolve the promise
  // useStateFromPromise() has an issue which isn't compatible with
  // DynamicFieldDefinitions when it returns a function as setState()
  // will immediately run the function returned and pass it the currentState.


  (0, _react.useEffect)(function () {
    if (!extensionManifest) {
      return;
    }

    var promiseFn = getFieldsDefinitionFn(extensionManifest, nodeKey);

    if (typeof promiseFn !== 'function') {
      setFields(undefined);
      return;
    }

    promiseFn(extensionParameters).catch(function (err) {
      if (err && typeof err.message === 'string') {
        setErrorMessage(err.message);
      }

      setFields(undefined);
    }).then(function (value) {
      if (Array.isArray(value)) {
        // value: FieldDefinition[]
        setFields(value);
      } else if (typeof value === 'function') {
        try {
          // value: DynamicFieldDefinitions
          var dynamicFields = value(extensionParameters);
          setFields(dynamicFields);
        } catch (err) {
          if (err instanceof Error) {
            setErrorMessage(err.message);
          }

          setFields(undefined);
        }
      } else {
        // value: undefined
        setFields(undefined);
      }
    });
  }, [extensionManifest, nodeKey, extensionParameters, setErrorMessage]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, props.children(fields));
};

function FieldsLoader(_ref) {
  var extensionType = _ref.extensionType,
      extensionKey = _ref.extensionKey,
      nodeKey = _ref.nodeKey,
      extensionProvider = _ref.extensionProvider,
      _ref$extensionParamet = _ref.extensionParameters,
      extensionParameters = _ref$extensionParamet === void 0 ? defaultEmptyObject : _ref$extensionParamet,
      _ref$parameters = _ref.parameters,
      parameters = _ref$parameters === void 0 ? defaultEmptyObject : _ref$parameters,
      autoSave = _ref.autoSave,
      autoSaveTrigger = _ref.autoSaveTrigger,
      autoSaveReject = _ref.autoSaveReject,
      closeOnEsc = _ref.closeOnEsc,
      showHeader = _ref.showHeader,
      onChange = _ref.onChange,
      onCancel = _ref.onCancel;

  var _useStateFromPromise = (0, _useStateFromPromise3.useStateFromPromise)(function () {
    return extensionProvider.getExtension(extensionType, extensionKey);
  }, [extensionProvider, extensionType, extensionKey]),
      _useStateFromPromise2 = (0, _slicedToArray2.default)(_useStateFromPromise, 1),
      extensionManifest = _useStateFromPromise2[0];

  var _useState3 = (0, _react.useState)(null),
      _useState4 = (0, _slicedToArray2.default)(_useState3, 2),
      errorMessage = _useState4[0],
      setErrorMessage = _useState4[1];

  return /*#__PURE__*/_react.default.createElement(FieldDefinitionsPromiseResolver, {
    setErrorMessage: setErrorMessage,
    extensionManifest: extensionManifest,
    nodeKey: nodeKey,
    extensionParameters: extensionParameters
  }, function (fields) {
    return /*#__PURE__*/_react.default.createElement(_ConfigPanel.default, {
      extensionManifest: extensionManifest,
      isLoading: !extensionManifest || errorMessage === null && !fields,
      fields: fields,
      parameters: parameters,
      autoSave: autoSave,
      autoSaveTrigger: autoSaveTrigger,
      autoSaveReject: autoSaveReject,
      closeOnEsc: closeOnEsc,
      showHeader: showHeader,
      onChange: onChange,
      onCancel: onCancel,
      errorMessage: errorMessage
    });
  });
}
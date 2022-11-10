"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConfirmationModal = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _standardButton = _interopRequireDefault(require("@atlaskit/button/standard-button"));

var _modalDialog = _interopRequireWildcard(require("@atlaskit/modal-dialog"));

var _messages = _interopRequireDefault(require("./messages"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ConfirmationModalImpl = function ConfirmationModalImpl(props) {
  var onConfirm = props.onConfirm,
      onClose = props.onClose,
      options = props.options,
      formatMessage = props.intl.formatMessage,
      testId = props.testId;
  var heading = (options === null || options === void 0 ? void 0 : options.title) || formatMessage(_messages.default.confirmModalDefaultHeading);
  var okButtonLabel = (options === null || options === void 0 ? void 0 : options.okButtonLabel) || formatMessage(_messages.default.confirmModalOK);
  var cancelButtonLabel = (options === null || options === void 0 ? void 0 : options.cancelButtonLabel) || formatMessage(_messages.default.confirmModalCancel);
  return /*#__PURE__*/_react.default.createElement(_modalDialog.ModalTransition, null, options && /*#__PURE__*/_react.default.createElement(_modalDialog.default, {
    onClose: onClose,
    testId: testId
  }, /*#__PURE__*/_react.default.createElement(_modalDialog.ModalHeader, null, /*#__PURE__*/_react.default.createElement(_modalDialog.ModalTitle, {
    appearance: "warning"
  }, heading)), /*#__PURE__*/_react.default.createElement(_modalDialog.ModalBody, null, /*#__PURE__*/_react.default.createElement("p", null, options.message)), /*#__PURE__*/_react.default.createElement(_modalDialog.ModalFooter, null, /*#__PURE__*/_react.default.createElement(_standardButton.default, {
    appearance: "default",
    onClick: onClose,
    testId: testId ? "".concat(testId, "-cancel-button") : undefined
  }, cancelButtonLabel), /*#__PURE__*/_react.default.createElement(_standardButton.default, {
    appearance: "warning",
    onClick: onConfirm,
    testId: testId ? "".concat(testId, "-confirm-button") : undefined
  }, okButtonLabel))));
};

var ConfirmationModal = (0, _reactIntlNext.injectIntl)(ConfirmationModalImpl);
exports.ConfirmationModal = ConfirmationModal;
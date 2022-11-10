import React from 'react';
import { injectIntl } from 'react-intl-next';
import Button from '@atlaskit/button/standard-button';
import Modal, { ModalTransition, ModalBody, ModalTitle, ModalHeader, ModalFooter } from '@atlaskit/modal-dialog';
import messages from './messages';

const ConfirmationModalImpl = props => {
  const {
    onConfirm,
    onClose,
    options,
    intl: {
      formatMessage
    },
    testId
  } = props;
  const heading = (options === null || options === void 0 ? void 0 : options.title) || formatMessage(messages.confirmModalDefaultHeading);
  const okButtonLabel = (options === null || options === void 0 ? void 0 : options.okButtonLabel) || formatMessage(messages.confirmModalOK);
  const cancelButtonLabel = (options === null || options === void 0 ? void 0 : options.cancelButtonLabel) || formatMessage(messages.confirmModalCancel);
  return /*#__PURE__*/React.createElement(ModalTransition, null, options && /*#__PURE__*/React.createElement(Modal, {
    onClose: onClose,
    testId: testId
  }, /*#__PURE__*/React.createElement(ModalHeader, null, /*#__PURE__*/React.createElement(ModalTitle, {
    appearance: "warning"
  }, heading)), /*#__PURE__*/React.createElement(ModalBody, null, /*#__PURE__*/React.createElement("p", null, options.message)), /*#__PURE__*/React.createElement(ModalFooter, null, /*#__PURE__*/React.createElement(Button, {
    appearance: "default",
    onClick: onClose,
    testId: testId ? `${testId}-cancel-button` : undefined
  }, cancelButtonLabel), /*#__PURE__*/React.createElement(Button, {
    appearance: "warning",
    onClick: onConfirm,
    testId: testId ? `${testId}-confirm-button` : undefined
  }, okButtonLabel))));
};

export const ConfirmationModal = injectIntl(ConfirmationModalImpl);
import React, { useEffect } from 'react';
import { HelperMessage } from '@atlaskit/form';
export default function (_ref) {
  var errorMessage = _ref.errorMessage;
  useEffect(function () {
    // eslint-disable-next-line no-console
    console.error(errorMessage);
  }, [errorMessage]);
  return /*#__PURE__*/React.createElement(HelperMessage, null, errorMessage);
}
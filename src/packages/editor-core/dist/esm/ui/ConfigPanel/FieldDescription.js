import React from 'react';
import { HelperMessage } from '@atlaskit/form';

var FieldDescription = function FieldDescription(_ref) {
  var error = _ref.error,
      description = _ref.description;

  if (error || !description) {
    return null;
  }

  return /*#__PURE__*/React.createElement(HelperMessage, null, description);
};

export default FieldDescription;
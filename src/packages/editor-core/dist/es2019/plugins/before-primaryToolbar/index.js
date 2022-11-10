import React from 'react';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

const beforePrimaryToolbar = props => ({
  name: 'beforePrimaryToolbar',

  primaryToolbarComponent() {
    return /*#__PURE__*/React.createElement(BeforePrimaryToolbarWrapper, {
      beforePrimaryToolbarComponents: props.beforePrimaryToolbarComponents
    });
  }

});

export default beforePrimaryToolbar;
import React from 'react';
import { BeforePrimaryToolbarWrapper } from './ui/BeforePrimaryToolbarWrapper';

var beforePrimaryToolbar = function beforePrimaryToolbar(props) {
  return {
    name: 'beforePrimaryToolbar',
    primaryToolbarComponent: function primaryToolbarComponent() {
      return /*#__PURE__*/React.createElement(BeforePrimaryToolbarWrapper, {
        beforePrimaryToolbarComponents: props.beforePrimaryToolbarComponents
      });
    }
  };
};

export default beforePrimaryToolbar;
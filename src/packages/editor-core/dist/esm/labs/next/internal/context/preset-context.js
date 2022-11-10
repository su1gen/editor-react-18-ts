import React from 'react';
var PresetContext = /*#__PURE__*/React.createContext([]);
var PresetProvider = PresetContext.Provider;

var usePresetContext = function usePresetContext() {
  return React.useContext(PresetContext);
};

export { PresetProvider, usePresetContext };
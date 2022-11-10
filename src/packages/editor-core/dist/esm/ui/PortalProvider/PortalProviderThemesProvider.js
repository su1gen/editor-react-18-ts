import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import AtlaskitTheme from '@atlaskit/theme/components';
import { CHANNEL } from '@atlaskit/theme/constants';
import { ThemeProvider } from '@emotion/react';
export function PortalProviderThemeProviders(props) {
  var children = props.children,
      mode = props.mode;
  var styledComponentsAndEmotionTheme = React.useMemo( // This return value should only be one of the following
  // - { [CHANNEL]: { mode },
  // - { theme: { [CHANNEL]: { mode } }
  // However, it appears that consumers have inconsistent expectations
  // regarding the shape.
  // This can be revisited in future work, and for the purposes of
  // fixing https://product-fabric.atlassian.net/browse/ED-14956
  // we are merging the two shapes consumers expect.
  function () {
    var _ref;

    return _ref = {}, _defineProperty(_ref, CHANNEL, {
      mode: mode
    }), _defineProperty(_ref, "theme", _defineProperty({}, CHANNEL, {
      mode: mode
    })), _ref;
  }, [mode]);
  var atlaskitTheme = React.useCallback(function () {
    return {
      mode: mode
    };
  }, [mode]);
  return /*#__PURE__*/React.createElement(ThemeProvider, {
    theme: styledComponentsAndEmotionTheme
  }, /*#__PURE__*/React.createElement(AtlaskitTheme.Provider, {
    value: atlaskitTheme
  }, children));
}
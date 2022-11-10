import * as colors from '@atlaskit/theme/colors';
import { hexToRgba } from '@atlaskit/adf-schema';
import { token } from '@atlaskit/tokens';
var background = {
  danger: {
    default: {
      light: 'inherit',
      dark: 'inherit'
    },
    hover: {
      light: token('color.background.neutral.subtle.hovered', colors.N30A),
      dark: token('color.background.neutral.subtle.hovered', colors.N30A)
    },
    active: {
      light: token('color.background.neutral.pressed', "".concat(hexToRgba(colors.B75, 0.6))),
      dark: token('color.background.neutral.pressed', "".concat(hexToRgba(colors.B75, 0.6)))
    }
  }
};
var color = {
  danger: {
    default: {
      light: token('color.icon', colors.N400),
      dark: token('color.icon', colors.DN400)
    },
    hover: {
      light: token('color.icon.danger', colors.R400),
      dark: token('color.icon.danger', colors.R400)
    },
    active: {
      light: token('color.icon.danger', colors.R400),
      dark: token('color.icon.danger', colors.R400)
    }
  }
};

var getStyles = function getStyles(property, _ref) {
  var _ref$appearance = _ref.appearance,
      appearance = _ref$appearance === void 0 ? 'default' : _ref$appearance,
      _ref$state = _ref.state,
      state = _ref$state === void 0 ? 'default' : _ref$state,
      _ref$mode = _ref.mode,
      mode = _ref$mode === void 0 ? 'light' : _ref$mode;

  if (!property[appearance] || !property[appearance][state]) {
    return 'initial';
  }

  return property[appearance][state][mode];
};

export var iconOnlySpacing = {
  '&&': {
    padding: '0px',

    /**
      Increased specificity here because css for .hyperlink-open-link defined in
      packages/editor/editor-core/src/ui/ContentStyles/index.tsx file
      overrides padding left-right 2px with 4px.
    */
    '&&[href]': {
      padding: '0 2px'
    }
  },
  '& > span': {
    margin: '0px'
  }
};
export var getButtonStyles = function getButtonStyles(props) {
  return {
    background: getStyles(background, props),
    color: getStyles(color, props)
  };
};
"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.iconOnlySpacing = exports.getButtonStyles = void 0;

var colors = _interopRequireWildcard(require("@atlaskit/theme/colors"));

var _adfSchema = require("@atlaskit/adf-schema");

var _tokens = require("@atlaskit/tokens");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var background = {
  danger: {
    default: {
      light: 'inherit',
      dark: 'inherit'
    },
    hover: {
      light: (0, _tokens.token)('color.background.neutral.subtle.hovered', colors.N30A),
      dark: (0, _tokens.token)('color.background.neutral.subtle.hovered', colors.N30A)
    },
    active: {
      light: (0, _tokens.token)('color.background.neutral.pressed', "".concat((0, _adfSchema.hexToRgba)(colors.B75, 0.6))),
      dark: (0, _tokens.token)('color.background.neutral.pressed', "".concat((0, _adfSchema.hexToRgba)(colors.B75, 0.6)))
    }
  }
};
var color = {
  danger: {
    default: {
      light: (0, _tokens.token)('color.icon', colors.N400),
      dark: (0, _tokens.token)('color.icon', colors.DN400)
    },
    hover: {
      light: (0, _tokens.token)('color.icon.danger', colors.R400),
      dark: (0, _tokens.token)('color.icon.danger', colors.R400)
    },
    active: {
      light: (0, _tokens.token)('color.icon.danger', colors.R400),
      dark: (0, _tokens.token)('color.icon.danger', colors.R400)
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

var iconOnlySpacing = {
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
exports.iconOnlySpacing = iconOnlySpacing;

var getButtonStyles = function getButtonStyles(props) {
  return {
    background: getStyles(background, props),
    color: getStyles(color, props)
  };
};

exports.getButtonStyles = getButtonStyles;
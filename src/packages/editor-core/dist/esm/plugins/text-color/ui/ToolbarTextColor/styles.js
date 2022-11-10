import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

import { css } from '@emotion/react';
import { borderRadius } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

var createSteppedRainbow = function createSteppedRainbow(colors) {
  return "\n    linear-gradient(\n      to right,\n      ".concat(colors.map(function (color, i) {
    var inc = 100 / colors.length;
    var pos = i + 1;

    if (i === 0) {
      return "".concat(color, " ").concat(pos * inc, "%,");
    }

    if (i === colors.length - 1) {
      return "".concat(color, " ").concat((pos - 1) * inc, "%");
    }

    return "\n            ".concat(color, " ").concat((pos - 1) * inc, "%,\n            ").concat(color, " ").concat(pos * inc, "%,\n          ");
  }).join('\n'), "\n    );\n    ");
};

var rainbow = createSteppedRainbow([colors.P300, colors.T300, colors.Y400, colors.R400]);
var disabledRainbow = createSteppedRainbow([colors.N80, colors.N60, colors.N40, colors.N60]);
export var textColorIconWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n"])));
export var textColorIconBar = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 16px;\n  margin: auto;\n  width: 12px;\n  height: 3px;\n  border-radius: ", ";\n  background: ", ";\n"])), borderRadius() + 'px', rainbow);
export var backgroundDisabled = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  background: ", ";\n"])), disabledRainbow);
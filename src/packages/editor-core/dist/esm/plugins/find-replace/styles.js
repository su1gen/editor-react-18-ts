import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// TODO: https://product-fabric.atlassian.net/browse/DSP-4290
import { css } from '@emotion/react';
import { B75, B200 } from '@atlaskit/theme/colors';
export var searchMatchClass = 'search-match';
export var selectedSearchMatchClass = 'selected-search-match';
export var findReplaceStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  .", " {\n    background-color: ", ";\n  }\n\n  .", " {\n    background-color: ", ";\n    color: white;\n  }\n"])), searchMatchClass, B75, selectedSearchMatchClass, B200);
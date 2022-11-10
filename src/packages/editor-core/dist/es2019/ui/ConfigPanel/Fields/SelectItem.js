/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Avatar from '@atlaskit/avatar';
import { gridSize } from '@atlaskit/theme/constants';
const itemWrapper = css`
  display: flex;
  align-items: center;

  small {
    margin: 0;
    display: block;
    color: currentColor;
  }
`;
const iconWrapper = css`
  line-height: 1;
`;
const iconWrapperMenu = css`
  align-self: flex-start;
  margin-top: 3px;
`;

const getIconSize = (context, description) => {
  if (context === 'value' || !description) {
    return 'xsmall';
  }

  return 'small';
};

export const formatOptionLabel = ({
  label,
  icon,
  description
}, {
  context
}) => {
  return jsx("div", {
    css: itemWrapper
  }, jsx("span", {
    css: [iconWrapper, context === 'menu' && iconWrapperMenu]
  }, typeof icon === 'string' ? jsx(Avatar, {
    src: icon,
    size: getIconSize(context, description),
    appearance: "square"
  }) : icon), jsx("div", {
    style: {
      paddingLeft: icon ? gridSize() : 0
    }
  }, jsx("p", null, label, description && context !== 'value' && jsx("small", null, description))));
};
import _extends from "@babel/runtime/helpers/extends";

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Component } from 'react';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import { getExtensionLozengeData } from '@atlaskit/editor-common/utils';
import { placeholderFallback, placeholderFallbackParams, styledImage } from './styles';
export const capitalizeFirstLetter = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export const ICON_SIZE = 24;
export default class ExtensionLozenge extends Component {
  render() {
    const {
      node
    } = this.props;
    const imageData = getExtensionLozengeData({
      node,
      type: 'image'
    });

    if (imageData && node.type.name !== 'extension') {
      return this.renderImage(imageData);
    }

    const iconData = getExtensionLozengeData({
      node,
      type: 'icon'
    });
    return this.renderFallback(iconData);
  }

  renderImage(lozengeData) {
    const {
      extensionKey
    } = this.props.node.attrs;
    const {
      url,
      ...rest
    } = lozengeData;
    return jsx("img", _extends({
      css: styledImage,
      src: url
    }, rest, {
      alt: extensionKey
    }));
  }

  renderFallback(lozengeData) {
    const {
      parameters,
      extensionKey
    } = this.props.node.attrs;
    const {
      name
    } = this.props.node.type;
    const params = parameters && parameters.macroParams;
    const title = parameters && parameters.extensionTitle || parameters && parameters.macroMetadata && parameters.macroMetadata.title || extensionKey;
    const isBlockExtension = name === 'extension';
    return jsx("div", {
      css: placeholderFallback
    }, lozengeData && !isBlockExtension ? this.renderImage({
      height: ICON_SIZE,
      width: ICON_SIZE,
      ...lozengeData
    }) : jsx(EditorFileIcon, {
      label: title
    }), jsx("span", {
      className: "extension-title"
    }, capitalizeFirstLetter(title)), params && !isBlockExtension && jsx("span", {
      css: placeholderFallbackParams
    }, Object.keys(params).map(key => key && ` | ${key} = ${params[key].value}`)));
  }

}
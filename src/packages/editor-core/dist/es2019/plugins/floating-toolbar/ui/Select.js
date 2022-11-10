import React, { useRef } from 'react';
import Select from '@atlaskit/select';
export default function Search(props) {
  const selectRef = useRef(null);
  const {
    width = 200
  } = props;
  const style = React.useMemo(() => ({
    container: base => ({ ...base,
      width
    }),
    menuPortal: base => {
      var _selectRef$current;

      const controlWrapper = selectRef === null || selectRef === void 0 ? void 0 : (_selectRef$current = selectRef.current) === null || _selectRef$current === void 0 ? void 0 : _selectRef$current.select.select.controlRef.parentNode;
      const menuPortalStyles = controlWrapper && props.setDisableParentScroll ? {
        // since the portal is now outside, we need to position it as before
        top: controlWrapper.offsetTop,
        left: controlWrapper.offsetLeft,
        height: controlWrapper.offsetHeight,
        width
      } : {};
      return { ...base,
        ...menuPortalStyles
      };
    }
  }), // eslint-disable-next-line react-hooks/exhaustive-deps
  [width]);

  const onMenuOpen = () => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(true);
    }
  };

  const onMenuClose = () => {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(false);
    }
  };

  return /*#__PURE__*/React.createElement(Select, {
    ref: selectRef,
    options: props.options,
    value: props.defaultValue,
    onChange: props.onChange,
    placeholder: props.placeholder,
    spacing: "compact",
    menuPlacement: "auto",
    filterOption: props.filterOption,
    styles: style,
    menuPortalTarget: props.mountPoint,
    onMenuOpen: onMenuOpen,
    onMenuClose: onMenuClose
  });
}
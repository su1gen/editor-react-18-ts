/** @jsx jsx */
import React, { useMemo, useState, useEffect } from 'react';
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import { separatorStyles, wrapperStyle, buttonGroupStyle } from '../../../../ui/styles';
import { useFormattingIcons, useHasFormattingActived } from './hooks/formatting-icons';
import { useClearIcon } from './hooks/clear-formatting-icon';
import { useResponsiveToolbarButtons, useResponsiveIconTypeMenu } from './hooks/responsive-toolbar-buttons';
import { SingleToolbarButtons } from './single-toolbar-buttons';
import { MoreButton } from './more-button';
import { FormattingTextDropdownMenu } from './dropdown-menu';
import { toolbarMessages } from './toolbar-messages';
import { usePreviousObjectState, compareItemsArrays, isArrayContainsContent } from '../../utils';
import Announcer from '../../../../utils/announcer/announcer';

const ToolbarFormatting = ({
  shouldUseResponsiveToolbar,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  editorView,
  toolbarSize,
  isReducedSpacing,
  isToolbarDisabled,
  intl
}) => {
  const editorState = useMemo(() => editorView.state, [editorView.state]);
  const [message, setMessage] = useState('');
  const defaultIcons = useFormattingIcons({
    editorState,
    intl,
    isToolbarDisabled
  });
  const clearIcon = useClearIcon({
    editorState,
    intl
  });
  const menuIconTypeList = useResponsiveIconTypeMenu({
    toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar
  });
  const hasFormattingActive = useHasFormattingActived({
    editorState: editorView.state,
    iconTypeList: menuIconTypeList
  });
  const {
    dropdownItems,
    singleItems
  } = useResponsiveToolbarButtons({
    icons: defaultIcons,
    toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar
  });
  const clearFormattingStatus = intl.formatMessage(toolbarMessages.textFormattingOff);
  const superscriptOffSubscriptOnStatus = intl.formatMessage(toolbarMessages.superscriptOffSubscriptOn);
  const subscriptOffSuperscriptOnStatus = intl.formatMessage(toolbarMessages.subscriptOffSuperscriptOn);
  const activeItems = [...dropdownItems, ...singleItems].filter(item => item.isActive);
  const prevActiveItems = usePreviousObjectState(activeItems);
  const fromSuperscriptToSubscript = isArrayContainsContent(activeItems, 'Subscript') && isArrayContainsContent(prevActiveItems, 'Superscript');
  const fromSubscriptToSuperscript = isArrayContainsContent(activeItems, 'Superscript') && isArrayContainsContent(prevActiveItems, 'Subscript');
  let comparedItems;
  let screenReaderMessage = '';

  if (prevActiveItems && activeItems.length > prevActiveItems.length) {
    comparedItems = compareItemsArrays(activeItems, prevActiveItems);
    screenReaderMessage = intl.formatMessage(toolbarMessages.on, {
      formattingType: comparedItems[0].content
    });
  } else {
    comparedItems = compareItemsArrays(prevActiveItems, activeItems);

    if (comparedItems && comparedItems.length) {
      var _activeItems$;

      screenReaderMessage = intl.formatMessage(toolbarMessages.off, {
        formattingType: comparedItems[0].content
      });

      if (((_activeItems$ = activeItems[0]) === null || _activeItems$ === void 0 ? void 0 : _activeItems$.content) === 'Code') {
        screenReaderMessage = intl.formatMessage(toolbarMessages.codeOn, {
          textFormattingOff: (prevActiveItems === null || prevActiveItems === void 0 ? void 0 : prevActiveItems.length) > 1 ? clearFormattingStatus : screenReaderMessage
        });
      }

      if (fromSuperscriptToSubscript) {
        screenReaderMessage = superscriptOffSubscriptOnStatus;
      }

      if (fromSubscriptToSuperscript) {
        screenReaderMessage = subscriptOffSuperscriptOnStatus;
      }
    }
  } // handle 'Clear formatting' status for screen readers


  if (!(activeItems !== null && activeItems !== void 0 && activeItems.length) && (prevActiveItems === null || prevActiveItems === void 0 ? void 0 : prevActiveItems.length) > 1) {
    screenReaderMessage = clearFormattingStatus;
  }

  const items = useMemo(() => {
    if (!clearIcon) {
      return dropdownItems;
    }

    return [...dropdownItems, clearIcon];
  }, [clearIcon, dropdownItems]);
  const moreFormattingButtonLabel = intl.formatMessage(toolbarMessages.moreFormatting);
  useEffect(() => {
    if (screenReaderMessage) {
      setMessage(screenReaderMessage);
    }
  }, [screenReaderMessage]);
  return jsx("span", {
    css: buttonGroupStyle
  }, message && jsx(Announcer, {
    ariaLive: "assertive",
    text: message,
    ariaRelevant: "additions",
    delay: 250
  }), jsx(SingleToolbarButtons, {
    items: singleItems,
    editorView: editorView,
    isReducedSpacing: isReducedSpacing
  }), jsx("span", {
    css: wrapperStyle
  }, isToolbarDisabled ? jsx("div", null, jsx(MoreButton, {
    label: moreFormattingButtonLabel,
    isReducedSpacing: isReducedSpacing,
    isDisabled: true,
    isSelected: false,
    "aria-expanded": undefined,
    "aria-pressed": undefined
  })) : jsx(FormattingTextDropdownMenu, {
    popupsMountPoint: popupsMountPoint,
    popupsBoundariesElement: popupsBoundariesElement,
    popupsScrollableElement: popupsScrollableElement,
    editorView: editorView,
    isReducedSpacing: isReducedSpacing,
    moreButtonLabel: moreFormattingButtonLabel,
    hasFormattingActive: hasFormattingActive,
    items: items
  }), jsx("span", {
    css: separatorStyles
  })));
};

class Toolbar extends React.PureComponent {
  render() {
    const {
      popupsMountPoint,
      popupsScrollableElement,
      toolbarSize,
      isReducedSpacing,
      editorView,
      isToolbarDisabled,
      shouldUseResponsiveToolbar,
      intl
    } = this.props;
    return jsx(ToolbarFormatting, {
      popupsMountPoint: popupsMountPoint,
      popupsScrollableElement: popupsScrollableElement,
      toolbarSize: toolbarSize,
      isReducedSpacing: isReducedSpacing,
      editorView: editorView,
      isToolbarDisabled: isToolbarDisabled,
      shouldUseResponsiveToolbar: shouldUseResponsiveToolbar,
      intl: intl
    });
  }

}

export default injectIntl(Toolbar);
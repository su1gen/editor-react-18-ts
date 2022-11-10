import { IntlShape } from 'react-intl-next';
import { Command } from '../../../types';
import { OptionConfig } from './types';
import { IconDropdownOptionProps } from './LinkToolbarIconDropdown';
export declare const getIconDropdownOption: (intl: IntlShape, dispatchCommand: (command: Command) => void, { disabled, onClick, selected, appearance, testId, tooltip }: OptionConfig) => IconDropdownOptionProps;

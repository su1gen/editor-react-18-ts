import { IntlShape } from 'react-intl-next';
import { Command } from '../../../types';
import { OptionConfig } from './types';
import { ButtonOptionProps } from './LinkToolbarButtonGroup';
export declare const getButtonGroupOption: (intl: IntlShape, dispatchCommand: (command: Command) => void, { disabled, onClick, selected, appearance, testId, tooltip }: OptionConfig) => ButtonOptionProps;

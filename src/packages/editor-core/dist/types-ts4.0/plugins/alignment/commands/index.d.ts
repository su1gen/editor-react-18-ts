import { Command } from '../../../types/command';
import { AlignmentState } from '../pm-plugins/types';
export declare const isAlignable: (align?: AlignmentState | undefined) => Command;
export declare const changeAlignment: (align?: AlignmentState | undefined) => Command;

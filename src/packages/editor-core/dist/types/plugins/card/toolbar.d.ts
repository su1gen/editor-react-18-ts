import { Command } from '../../types';
import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { CardOptions } from '@atlaskit/editor-common/card';
import { LinkPickerOptions } from '../hyperlink/types';
export declare const removeCard: Command;
export declare const visitCardLink: Command;
export declare const openLinkSettings: Command;
export declare const floatingToolbar: (cardOptions: CardOptions, platform?: import("json-ld-types").JsonLd.Primitives.Platforms | undefined, linkPickerOptions?: LinkPickerOptions | undefined) => FloatingToolbarHandler;

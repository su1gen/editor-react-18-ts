import { HigherOrderCommand } from '../../types/command';
import { InputSource } from './enums';
declare type AttachInputMeta = (inputSource: InputSource) => HigherOrderCommand;
export declare const attachInputMeta: AttachInputMeta;
export {};

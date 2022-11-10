import React, { AriaAttributes, Ref } from 'react';
declare type AnnouncerProps = {
    ref?: Ref<HTMLDivElement>;
    /** Set 'false' for announcing only changed text
     * (not announce duplicate part of string after second render),
     * and 'true' for announcing all the string after each render */
    ariaAtomic?: AriaAttributes['aria-atomic'];
    /** Set politeness settings */
    ariaLive?: AriaAttributes['aria-live'];
    /** Used to describe what types of changes have occurred to an aria-live region */
    ariaRelevant?: AriaAttributes['aria-relevant'];
    /** Role used to set attribute role. See more details https://dequeuniversity.com/library/aria/liveregion-playground#configOptions */
    role?: 'status' | 'log' | 'alert' | 'timer' | 'marquee';
    /** Text message that will be announced */
    text: string;
    /** Debounce delay.
     *  Set delay (ms) to prevent announce the same string multiple times.
     *  It can be useful for cases when the parent component re-renders with the same announcer's text. */
    delay?: number;
};
declare const _default: React.NamedExoticComponent<AnnouncerProps>;
export default _default;

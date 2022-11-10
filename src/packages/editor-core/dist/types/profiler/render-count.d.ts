import React from 'react';
export declare enum ProfiledComponentIds {
    editor = "Editor",
    appearance = "FullPageEditor",
    reactEditorView = "ReactEditorView",
    contentArea = "FullPageContentArea",
    toolbar = "FullPageToolbar",
    mention = "MentionNodeView"
}
declare type RenderCountProfilerProps = {
    componentId: keyof typeof ProfiledComponentIds;
};
export declare const RenderCountProfiler: React.FC<RenderCountProfilerProps>;
export {};

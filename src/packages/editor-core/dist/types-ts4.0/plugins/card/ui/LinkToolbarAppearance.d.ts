import React from 'react';
import PropTypes from 'prop-types';
import { IntlShape } from 'react-intl-next';
import { EditorState } from 'prosemirror-state';
import { CardPlatform } from '@atlaskit/smart-card';
import { CardContext } from '@atlaskit/link-provider';
import { EditorView } from 'prosemirror-view';
import { CardAppearance } from '@atlaskit/editor-common/provider-factory';
export interface LinkToolbarAppearanceProps {
    intl: IntlShape;
    currentAppearance?: CardAppearance;
    editorState: EditorState;
    editorView?: EditorView;
    url?: string;
    allowEmbeds?: boolean;
    platform?: CardPlatform;
}
export declare class LinkToolbarAppearance extends React.Component<LinkToolbarAppearanceProps, {}> {
    static contextTypes: {
        contextAdapter: PropTypes.Requireable<object>;
    };
    renderDropdown: (view?: EditorView<any> | undefined, cardContext?: CardContext | undefined) => JSX.Element | null;
    render(): JSX.Element | null;
}

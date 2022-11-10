import React from 'react';
import PropTypes from 'prop-types';
export default class WithHelpTrigger extends React.Component<{
    render: (openHelp: () => void) => React.ReactNode;
}, any> {
    static contextTypes: {
        editorActions: PropTypes.Validator<object>;
    };
    openHelp: () => void;
    render(): React.ReactNode;
}

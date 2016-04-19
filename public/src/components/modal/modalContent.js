import React, { Component, PropTypes } from 'react';

class ModalContent extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }

    render()
    {
        let { content } = this.props;
        return (
            <div className="content flexContainer">
                {content}
            </div>
        );
    }
}

ModalContent.propTypes = {
    content: PropTypes.element.isRequired,
    style: PropTypes.object
};

export default ModalContent;

import React, { Component, PropTypes } from 'react';

class ModalHeader extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }

    render()
    {
        let { title, style } = this.props;
        return (
            <div className="header" style={style}>
                <span>{title}</span>
                <span className="cancle" onClick={this.props.close}>X</span>
            </div>
        );
    }
}

ModalHeader.propTypes = {
    title: PropTypes.string.isRequired,
    style: PropTypes.object,
    close: PropTypes.func.isRequired
};

export default ModalHeader;

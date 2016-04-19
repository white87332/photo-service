import React, { Component, PropTypes } from 'react';

class ModalFooter extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }
    
    render()
    {
        let { style } = this.props;
        return (
            <div className="footer" style={style}>
                <button className="btn" onClick={this.props.close}>close</button>
                <button className="btn" onClick={this.props.submit}>submit</button>
            </div>
        );
    }
}

ModalFooter.propTypes = {
    close: PropTypes.func.isRequired,
    submit: PropTypes.func.isRequired,
    style: PropTypes.object
};

export default ModalFooter;

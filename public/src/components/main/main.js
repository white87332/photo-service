import './main.scss';
import React, { Component } from 'react';

class Main extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }

    render()
    {
        return (
            <div className="main">
                {this.props.children}
            </div>
        );
    }
}

export default Main;

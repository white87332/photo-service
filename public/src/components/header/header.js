import './header.scss';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as fileActions from '../../actions/file.js';

function mapStateToProps(state)
{
    return {
        contextMenu: state.file.contextMenu
    };
}

function mapDispatchToProps(dispatch)
{
    return {
        actions: {
            fileActions: bindActionCreators(fileActions, dispatch)
        }
    };
}

class Header extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }

    resetMenuAndItemColor()
    {
        let { fileContextMenuToggle, fileItemSelect } = this.props.actions.fileActions;
        if(this.props.contextMenu.style.show)
        {
            fileContextMenuToggle({style:{show: false}});
        }

        if(this.props.itemSelected !== null)
        {
            fileItemSelect();
        }
    }

    render()
    {
        return (
            <header onClick={this.resetMenuAndItemColor.bind(this)}>
                header
            </header>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);

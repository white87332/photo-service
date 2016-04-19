import './footer.scss';
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

class Footer extends Component
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
            <footer onClick={this.resetMenuAndItemColor.bind(this)}>
                footer
            </footer>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);

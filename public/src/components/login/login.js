import './login.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Modal from '../modal/modal';
import * as userActions from '../../actions/user.js';

function mapStateToProps(state)
{
    return {};
}

function mapDispatchToProps(dispatch)
{
    return {
        actions: {
            userActions: bindActionCreators(userActions, dispatch),
        }
    };
}

class Login extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }

    propHeader()
    {
        return {
            title: 'Welcome to iSunCLOUD',
            style: {
                textAlign: 'center'
            }
        };
    }

    propContent()
    {
        let style = {};
        return {
            content:(<div className="inputArea" style={style}>
                        <div>
                            <div>name</div>
                            <div><input type="text" className="name" name="name" defaultValue="white87332@gmail.com"/></div>
                        </div>
                        <div>
                            <div>password</div>
                            <div><input type="password" className="pwd" name="pwd" defaultValue="ji53122039JI"/></div>
                        </div>
                    </div>)
        };
    }

    propFooter()
    {
        return {
            style: {}
        };
    }

    componentWillMount()
    {
        if(sessionStorage.getItem("user") !== null)
        {
            browserHistory.push('/photo/fileList');
        }
    }

    submit()
    {
        let name = document.querySelectorAll('.reactModal .name')[0].value;
        let pwd = document.querySelectorAll('.reactModal .pwd')[0].value;
        let { userLogin } = this.props.actions.userActions;
        userLogin(name, pwd, (err, data) =>
        {
            if(err === null)
            {
                sessionStorage.setItem('user', JSON.stringify(data));
                browserHistory.push('/photo/fileList');
            }
            else
            {

            }
        });
    }

    render()
    {
        return (
            <div className="login">
                <Modal
                    header={this.propHeader()}
                    content={this.propContent()}
                    footer={this.propFooter()}
                    submit={this.submit.bind(this)} />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

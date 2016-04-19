import './modal.scss';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import ModalHeader from './modalHeader';
import ModalContent from './modalContent';
import ModalFooter from './modalFooter';

class Modal extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            display: 'none',
            init: true,
            close: false,
            destory: false
        };
    }

    componentDidMount()
    {
        this.node = document.createElement('div');
        this.node.className = 'reactModal';
        document.body.appendChild(this.node);
        this.componentDidUpdate();
    }

    componentWillUnmount()
    {
        document.body.removeChild(this.node);
    }

    componentDidUpdate()
    {
        let { coverClasses, contentClasses } = this.setStyleAndClass();
        render(
            <div className={coverClasses}>
                <div className={contentClasses}>
                    <div className="context">
                        <ModalHeader {...this.props.header} close={this.close.bind(this)}/>
                        <ModalContent {...this.props.content} />
                        <ModalFooter {...this.props.footer} submit={this.props.submit} close={this.close.bind(this)}/>
                    </div>
                </div>
            </div>, this.node
        );

        this.checkInitEntry();
        this.checkDestory();
    }

    checkInitEntry()
    {
        if(this.state.init)
        {
            // add modalOpen, open class
            setTimeout(() => {
                this.setState({
                    display: 'block',
                    init: false
                });
            }, 10);
        }
    }

    checkDestory()
    {
        if(this.state.destory)
        {
            setTimeout(() => {
                document.body.removeChild(this.node);
            }, 450);
        }
    }

    close()
    {
        this.setState({
            display: 'none',
            close: true,
            destory: true
        });
    }

    setStyleAndClass()
    {
        let coverClasses, contentClasses;
        if(this.state.display === 'none' && this.state.init)
        {
            coverClasses = classNames('modal');
            contentClasses = classNames('content');
        }
        else if(this.state.display === 'none' && this.state.close)
        {
            coverClasses = classNames('modal', 'modalClose');
            contentClasses = classNames('content', 'close');
        }
        else if(this.state.display === 'block')
        {
            coverClasses = classNames('modal', 'modalOpen');
            contentClasses = classNames('content', 'open');
        }

        return { coverClasses, contentClasses };
    }

    render()
    {
        return React.DOM.noscript();
    }
}

Modal.propTypes = {
    submit: PropTypes.func.isRequired
};

export default Modal;

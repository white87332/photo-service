import React, { Component, PropTypes } from 'react';

class FileListItemMenu extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {};
    }

    delete(e)
    {
        let { fids } = this.props.file;
        let { parentContextMenuDelete } = this.props.methods;
        parentContextMenuDelete(fids);
    }

    render()
    {
        let { name, dataUrl } = this.props.file;
        let { top, left } = this.props.style;
        let style = {
            top: top + "px",
            left: left + "px"
        };

        return (
            <div className="fileContextMenu" style={style}>
                <div>
                    <a download={name} ref="aHref" href={dataUrl}>下載</a>
                </div>
                <div>
                    <a onClick={this.delete.bind(this)}>刪除</a>
                </div>
            </div>
        );
    }
}

FileListItemMenu.propTypes = {
    file: PropTypes.object.isRequired,
    methods: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired
};

export default FileListItemMenu;

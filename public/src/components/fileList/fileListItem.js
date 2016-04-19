import React, { Component, PropTypes } from 'react';
import LazyLoad from 'react-lazyload';
import { URL_FILE } from '../../constants/constants';
import { on, off } from '../../utils/event';

class FileListItem extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            nameStyle: null,
            itemStyle: null
        };
    }

    selectItem(e)
    {
        e.stopPropagation(); //清除冒泡事件
        let { parentItemSelect } = this.props.methods;
        let { fid } = this.props;
        parentItemSelect({fid});
    }

    selectItemPreview(e)
    {
        e.stopPropagation(); //清除冒泡事件
        e.preventDefault(); //清除預設事件
        let { parentItemSelect } = this.props.methods;
        let { fid } = this.props;
        parentItemSelect({fid});
    }

    itemContextMenu(e)
    {
        e.stopPropagation(); //清除冒泡事件
        e.preventDefault(); //清除預設事件
        let mousePositionX = (e.pageX || e.clientX + document.body.scrollLeft);
        let mousePositionY = (e.pageY || e.clientY + document.body.scrollTop);
        let { fid, name } = this.props;
        let { parentContextMenu } = this.props.methods;
        let fids = [fid];
        let itemData = {
            file: { name, fids, dataUrl: URL_FILE + fid },
            style: { show: true, top: mousePositionY, left: mousePositionX}
        };
        parentContextMenu(itemData);
    }

    imgError()
    {
        this.refs.img.src = "./asset/img/404.png";
    }

    mouseDown(e)
    {
        e.stopPropagation(); //清除冒泡事件
        return false;
    }

    dragStart(e)
    {
        this.setState({
            itemStyle: { backgroundColor:"rgba(128, 128, 128, 0.4)" },
            nameStyle: { backgroundColor:"rgba(0, 90, 187, 0.9)", color:"#fff" }
        });
    }

    dragEnd(e)
    {
        let itemPositionX = (e.pageX || e.clientX + document.body.scrollLeft);
        let itemPositionY = (e.pageY || e.clientY + document.body.scrollTop);

        this.setState({
            itemStyle: null,
            nameStyle: null
        });
    }

    renderImg()
    {
        let { fid, dataUrl, act, preview, mimetype } = this.props;

        // image
        dataUrl = (act === 'add')? dataUrl : dataUrl += "/thumbnail";

        // vidoe
        // let src = (act === 'add')? preview : URL_FILE + fid;
        // if (this.props.mimetype.indexOf("video") !== -1)
        // {
        //     let video = <video className="video-js" poster={dataUrl} controls>
        //                     <source src={src} type={mimetype} />
        //                 </video>;
        //     return video;
        // }
        // else
        // {
            return <LazyLoad>
                        <img className="image" onError={this.imgError.bind(this)} ref="img" src={dataUrl} />
                    </LazyLoad>;
        // }
    }

    renderIcon()
    {
        if (this.props.mimetype.indexOf("video") !== -1)
        {
            return <i className="fa fa-file-video-o"></i>;
        }
        else
        {
            return <i className="fa fa-file-image-o"></i>;
        }
    }

    render()
    {
        // 不知為何透過 selectItem 重設會無法下載, 只好改由 state 做 render
        let { itemStyle, nameStyle } = (this.state.itemStyle === null && this.state.nameStyle === null)? this.props.style : this.state;
        let { fid, name, selectedKeys } = this.props;

        if(selectedKeys.length > 0)
        {
            // 有反白的不需要右鍵選單
            if(selectedKeys.indexOf(fid) !== -1)
            {
                return  <div className="fileListItem"
                            ref="fileItem"

                            onClick={this.selectItem.bind(this)}
                            onDoubleClick={this.selectItemPreview.bind(this)}>

                            <div className="item" style={itemStyle}>
                                {this.renderImg.call(this)}
                            </div>
                            <div className="name" style={nameStyle}>
                                {this.renderIcon.call(this)}{name}
                            </div>
                        </div>;
            }
            else
            {
                return  <div className="fileListItem"
                            ref="fileItem"

                            onClick={this.selectItem.bind(this)}
                            onDoubleClick={this.selectItemPreview.bind(this)}
                            onContextMenu={this.itemContextMenu.bind(this)}>

                            <div className="item" style={itemStyle}>
                                {this.renderImg.call(this)}
                            </div>
                            <div className="name" style={nameStyle}>
                                {this.renderIcon.call(this)}{name}
                            </div>
                        </div>;
            }
        }
        else
        {
            return <div className="fileListItem"
                        style={this.state.style}
                        ref="fileItem"

                        onMouseDown={this.mouseDown.bind(this)}
                        onDragStart={this.dragStart.bind(this)}
                        onDragEnd={this.dragEnd.bind(this)}

                        onClick={this.selectItem.bind(this)}
                        onDoubleClick={this.selectItemPreview.bind(this)}
                        onContextMenu={this.itemContextMenu.bind(this)}>

                        <div className="item" style={itemStyle}>
                            {this.renderImg.call(this)}
                        </div>
                        <div className="name" style={nameStyle}>
                            {this.renderIcon.call(this)}{name}
                        </div>
                    </div>;
        }
    }
}

FileListItem.propTypes = {
    fid: PropTypes.string.isRequired,
    hash: PropTypes.string.isRequired,
    dataUrl: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    mimetype: PropTypes.string.isRequired,
    selectableKey: PropTypes.string.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    style: PropTypes.object.isRequired,
    methods: PropTypes.object.isRequired,
    add: PropTypes.string,
    preview: PropTypes.string
};

export default FileListItem;

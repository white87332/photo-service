import './layout.scss';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Dropzone from '../react-dropzone/index';
import Exif from 'exif-js';
import async from 'async';
import Header from '../header/header';
import Footer from '../footer/footer';
import * as fileActions from '../../actions/file.js';
import * as errActions from '../../actions/err.js';
import { imageAndVideoArrayGet, exifAdd, imageThumbnail, videoThumbnail } from '../../utils/file';

function mapStateToProps(state)
{
    return {};
}

function mapDispatchToProps(dispatch)
{
    return {
        actions: {
            fileActions: bindActionCreators(fileActions, dispatch),
            errActions: bindActionCreators(errActions, dispatch)
        }
    };
}

class Layout extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            isDragEnter: false
        };
    }

    dragEnter(e)
    {
        if(!this.state.isDragEnter)
        {
            this.setState({
                isDragEnter: true
            });
        }
    }

    dragLeave(e)
    {
        if(this.state.isDragEnter)
        {
            this.setState({
                isDragEnter: false
            });
        }
    }

    onDrop(files, e)
    {
        e.stopPropagation(); //清除冒泡事件
        e.preventDefault(); //清除預設事件

        this.dragLeave();

        var that = this;
        async.series(
            [
                // imageAndVideoArrayGet
                function(callback)
                {
                    let { newFiles } = imageAndVideoArrayGet(files);
                    files = newFiles;
                    callback(null);
                },

                // add exif data
                function(callback)
                {
                    exifAdd(files, () => {
                        callback(null);
                    });
                },

                // imageThumbnail
                function(callback)
                {
                    imageThumbnail(files, () => {
                        callback(null);
                    });
                },

                // videoThumbnail
                function(callback)
                {
                    videoThumbnail(files, (err, data) => {
                        callback(null);
                    });
                },

                // upload
                function(callback)
                {
                    let { fileUpload, fileThumbnailUpload } = that.props.actions.fileActions;
                    let { errMessage } = that.props.actions.errActions;

                    // first, upload file image
                    // second, upload Thumbnail
                    let filesLength = files.length, i = 0;
                    fileUpload(files, (err, fid, blobObj) =>
                    {
                        i++;
                        if(err === null)
                        {
                            fileThumbnailUpload(fid, blobObj, (err) =>
                            {
                                if(err)
                                {
                                    // errMessage();
                                }
                            });
                        }
                        else
                        {
                            errMessage();
                        }

                        if(filesLength === i)
                        {
                            callback(null);
                        }
                    });
                }
            ]);
    }

    render()
    {
        let animationClass = (this.state.isDragEnter)? "dropzone dragEnter" : "dropzone";
        return (
            <div className="layout">
                <Header />
                <Dropzone
                    className={animationClass}
                    onDrop={this.onDrop.bind(this)}
                    disableClick={true}
                    disablePreview={false}
                    onDragLeave={this.dragLeave.bind(this)}
                    onDragEnter={this.dragEnter.bind(this)}>

                    {this.props.children}
                </Dropzone>
                <Footer />
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

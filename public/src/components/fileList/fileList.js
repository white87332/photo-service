import './fileList.scss';
import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SelectableGroup, createSelectable } from '../react-selectable/index';
import FileListItem from './fileListItem';
import FileListItemMenu from './fileListItemMenu';
import * as fileActions from '../../actions/file';
import { on, off } from '../../utils/event';

const SelectableFileListItem = createSelectable(FileListItem);

function mapStateToProps(state)
{
    return {
        data: state.file.data,
        contextMenu: state.file.contextMenu,
        itemSelected: state.file.itemSelected
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

class FileList extends Component
{
    constructor(props, context)
    {
        super(props, context);
        this.state = {
            selectedKeys: []
        };
    }

    componentWillMount()
    {
        let { fileListGet } = this.props.actions.fileActions;
        fileListGet((err, filesLength) => {

        });
    }

    componentDidMount()
    {
        this.load = false;

        //判斷捲軸到底, 取得下份檔案清單
        // on(window, 'scroll', this.fileListAppend.bind(this));
    }

    fileListAppend()
    {
        //判斷整體網頁的高度
        let bodyHeight = document.body.clientHeight;
        //判斷所見範圍的高度
        let viewportHeight = window.innerHeight;
        //偵測目前捲軸頂點
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        // footerHeight
        let footerHeight = document.getElementsByTagName('footer')[0].getBoundingClientRect().height;

        // 小於一個項目的高度
        if(!this.load && (bodyHeight - viewportHeight - scrollTop - footerHeight) < 180)
        {
            this.load = true;
            let { fileListGet } = this.props.actions.fileActions;
            fileListGet((err, filesLength) =>
            {
                if(filesLength > 0)
                {
                    this.load = false;
                }
                else
                {
                    // 沒資料了, 清除scroll事件
                    off(window, 'scroll');
                }
            });
        }
    }

    onContextMenu(e)
    {
        e.stopPropagation(); //清除冒泡事件
        e.preventDefault(); //清除預設事件

        // 反白選取時的選單, 取消item的右鍵, 由list取位置
        if (this.state.selectedKeys.length > 0)
        {
            let { fileContextMenuToggle } = this.props.actions.fileActions;
            let mousePositionX = (e.pageX || e.clientX + document.body.scrollLeft);
            let mousePositionY = (e.pageY || e.clientY + document.body.scrollTop);
            let fids = this.state.selectedKeys;
            let data = {
                file: { name: null, fids, dataUrl: null },
                style: { show: true, top: mousePositionY, left: mousePositionX }
            };
            // 右鍵選單
            fileContextMenuToggle(data);
        }
        else
        {
            this.resetMenuAndItemColor();
        }
    }

    onClickReset(e)
    {
        this.setState({selectedKeys:[]});
        this.resetMenuAndItemColor();
    }

    resetMenuAndItemColor()
    {
        let { fileContextMenuToggle, fileItemSelect } = this.props.actions.fileActions;
        if(this.props.contextMenu.style.show)
        {
            fileContextMenuToggle({style:{show: false}});
        }

        if(this.props.itemSelected.length > 0)
        {
            fileItemSelect();
        }
    }

    // 反白選擇
    // 1. handleSelection => setState({selectedKeys:selectedKeys})
    // 2. FileListItem => remove onContextMenu
    // 3. push all fids to FileListItemMenu
    // 4. exec act
    // 5. handleSelection => setState({selectedKeys:[]})
    handleSelection (selectedKeys)
    {
        this.setState({selectedKeys:selectedKeys});

        let { fileContextMenuToggle, fileItemSelect } = this.props.actions.fileActions;

        // 右鍵選單
        fileContextMenuToggle({style:{show: false}});

        // 右鍵選單時選擇項目背景換色
        fileItemSelect(selectedKeys);
    }


    parentMouseDownDrag()
    {
        console.log(this.state.selectedKeys);
    }

    // 右鍵選單 => 呈現
    parentContextMenu(data)
    {
        let { fileContextMenuToggle, fileItemSelect } = this.props.actions.fileActions;

        // 右鍵選單
        fileContextMenuToggle(data);

        // 右鍵選單時選擇項目背景換色
        fileItemSelect(data.file.fids);
    }

    // 右鍵選單 => 單檔刪除
    parentContextMenuDelete(fids)
    {
        let { fileDelete, filesDelete } = this.props.actions.fileActions;

        // 反白選擇跟直接項目右鍵的差異
        if(fids.length === 1)
        {
            fileDelete(fids[0], () => {});
        }
        else
        {
            filesDelete(fids, () => {});
        }
    }

    // 選擇項目的背景換色
    parentItemSelect(data)
    {
        let { fileContextMenuToggle, fileItemSelect } = this.props.actions.fileActions;
        let { fid } = data;
        let fids = [];
        fids.push(fid);

        // for mouse down
        this.setState({selectedKeys:fids});

        // 右鍵選單
        fileContextMenuToggle({style:{show: false}});

        // 右鍵選單時選擇項目背景換色
        fileItemSelect(fids);
    }

    // each item
    renderItem()
    {
        let items = null;
        let { fileContextMenuToggle, fileItemSelect } = this.props.actions.fileActions;
        if(this.props.data.length > 0)
        {
            let items = this.props.data.map((data, key) => {
                return <SelectableFileListItem
                            methods={{parentMouseDownDrag: this.parentMouseDownDrag.bind(this), parentContextMenu: this.parentContextMenu.bind(this), parentItemSelect:this.parentItemSelect.bind(this)}}
                            key={data.fid}
                            selectableKey={data.fid}
                            selectedKeys={this.state.selectedKeys}
                            {...data} />;
            });
            return items;
        }
        else
        {
            return items;
        }
    }

    // 右鍵選單
    renderContextMenu()
    {
        let conetxtMenu = null;
        let { fileDelete } = this.props.actions.fileActions;
        if(this.props.contextMenu.style.show)
        {
            conetxtMenu = <FileListItemMenu
                            {...this.props.contextMenu}
                            methods={{parentContextMenuDelete: this.parentContextMenuDelete.bind(this)}} />;
        }
        return conetxtMenu;
    }

    render()
    {
        return (
            <SelectableGroup onSelection={this.handleSelection.bind(this)}>
                <div className="fileListContainer" onClick={this.onClickReset.bind(this)}>
                    <div className="fileList"
                        onContextMenu={this.onContextMenu.bind(this)}
                        onClick={this.onClickReset.bind(this)}>

                        <ReactCSSTransitionGroup className="flexContainer" transitionName="transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
                            {/*item*/}
                            {this.renderItem.call(this)}
                        </ReactCSSTransitionGroup>

                        {/*item menu*/}
                        {this.renderContextMenu.call(this)}
                    </div>
                </div>
            </SelectableGroup>
        );
    }
}

FileList.propTypes = {
    data: PropTypes.array.isRequired,
    contextMenu: PropTypes.object.isRequired,
    itemSelected: PropTypes.any.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(FileList);

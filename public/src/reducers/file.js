import objectAssign from 'object-assign';
import _ from 'lodash';
import * as types from '../constants/actionTypes';

const itemStyle = { backgroundColor: "rgba(0, 0, 0, 0)" };
const nameStyle = { backgroundColor: "rgba(0, 0, 0, 0)", color: "#000" };
const itemSelectedStyle = { backgroundColor:"rgba(128, 128, 128, 0.4)" };
const nameSelectedStyle = { backgroundColor:"rgba(0, 90, 187, 0.9)", color:"#fff" };

const initialState = {
    data: [],
    itemSelected: [],
    contextMenu:
    {
        file: { fids: [], name: null, dataUrl: null},
        style: { show: false, top: 0, left: 0 }
    }
};

export default function file(state = initialState, action = {})
{
    switch (action.type)
    {
        // 上傳檔案 => 新增
        case types.FILE_LIST_ADD:
            let fileData = action.data;
            fileData.style = { itemStyle: itemStyle, nameStyle: nameStyle };
            fileData.fid = new Date().getTime();
            return objectAssign({}, state, {data: [fileData, ...state.data]});

        // 刪除檔案
        case types.FILE_LIST_DEL:
            let fidsDelete = action.data;
            let newDelData = state.data.filter((data) => {
                if(fidsDelete.indexOf(data.fid) === -1)
                {
                    return data;
                }
            });

            return objectAssign({}, state, { data: newDelData });

        // 右鍵選單呈現, 消失
        case types.FILE_CONTEXT_MENU_TOGGLE:
            let contextMenuToggle = _.clone(state.contextMenu);
            let data = {
                file: { fids: [], name: null, dataUrl: null},
                style: { show: false, top: 0, left: 0 }
            };

            // 選單呈現
            if(action.data.style.show)
            {
                data.style.show = true;
                data.style.top = action.data.style.top;
                data.style.left = action.data.style.left;
                data.file.fids = action.data.file.fids;
                data.file.name = action.data.file.name;
                data.file.dataUrl = action.data.file.dataUrl;
            }
            return objectAssign({}, state, { contextMenu: data });

        // 選擇檔案背景換色
        case types.FILE_LIST_ITEM_SELECT:
            let fids = action.data;
            let itemSelected = [];
            let newData = state.data.map((data) => {
                if(fids.indexOf(data.fid) !== -1)
                {
                    itemSelected.push(data.fid);
                    data.style = { itemStyle: itemSelectedStyle, nameStyle: nameSelectedStyle };
                }
                else
                {
                    data.style = { itemStyle: itemStyle, nameStyle: nameStyle };
                }
                return data;
            });

            return objectAssign({}, state, { data: newData, itemSelected: itemSelected });

        // 選擇檔案背景重設
        case types.FILE_LIST_ITEM_SELECT_RESET:
            let resetData = state.data.map((data) => {
                data.style = { itemStyle: itemStyle, nameStyle: nameStyle };
                return data;
            });
            return objectAssign({}, state, { data: resetData, itemSelected: [] });
        default:
            return state;
    }
}

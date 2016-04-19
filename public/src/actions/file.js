import * as types from '../constants/actionTypes';

// fileImageUpload
/**
 * [檔案上傳]
 */
export function fileUpload(files, callback)
{
    return (dispatch, getState) =>
    {
        for (let key in files)
        {
            (function(key)
            {
                dispatch(
                {
                    type: types.FILE_LIST_ADD,
                    data: {
                        name: files[key].name,
                        type: files[key].type,
                        preview: files[key].preview,
                        dataUrl: files[key].dataUrl,
                    }
                });

            })(key);
        }
    };
}

// fileDelete
/**
 * [單檔案刪除]
 * let data = {
 *     file: { fids: [], name: null, dataUrl: null},
 *     style: { show: false, top: 0, left: 0 }
 * };
 */
export function fileDelete(fid, callback)
{
    return (dispatch, getState) =>
    {
        dispatch(
        {
            type: types.FILE_LIST_DEL,
            data: [fid]
        });
    };
}

// filesDelete
/**
 * [多檔案刪除]
 */
export function filesDelete(fids, callback)
{
    return (dispatch, getState) =>
    {
        dispatch(
        {
            type: types.FILE_LIST_DEL,
            data: fids
        });
    };
}

// fileContextMenuShow
/**
 * [右鍵選單]
 */
export function fileContextMenuToggle(itemData = {})
{
    return (dispatch, getState) =>
    {
        dispatch(
        {
            type: types.FILE_CONTEXT_MENU_TOGGLE,
            data: itemData
        });
    };
}

// fileItemSelect
/**
 * [右鍵選單時選擇項目背景換色]
 */
export function fileItemSelect(fids = undefined)
{
    return (dispatch, getState) =>
    {
        if(fids !== undefined)
        {
            dispatch(
            {
                type: types.FILE_LIST_ITEM_SELECT,
                data: fids
            });
        }
        else
        {
            dispatch(
            {
                type: types.FILE_LIST_ITEM_SELECT_RESET,
                data: null
            });
        }
    };
}

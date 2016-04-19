import * as types from '../constants/actionTypes';
import { URL_FILE, URL_FILE_DELETE } from '../constants/constants';
import request from 'superagent';
import async from 'async';

// fileListGet
/**
 * [取得檔案清單]
 */
export function fileListGet(callback)
{
    return (dispatch, getState) =>
    {
        request.get(URL_FILE)
            .end((err, res) =>
            {
                if (err || res.status !== 200 || res.body.result !== 1)
                {
                    callback(true);
                }
                else
                {
                    let filesLength = res.body.data.length;
                    if(filesLength > 0)
                    {
                        dispatch(
                        {
                            type: types.FILE_LIST_GET,
                            data: res.body.data
                        });
                    }

                    callback(null, filesLength);
                }
            });
    };
}

// fileGet
/**
 * [檔案下載]
 */
export function fileGet(fid, name, callback)
{
    return (dispatch, getState) =>
    {
        let bufferData = [];
        let url = URL_FILE + fid;
        request.get(url)
            .responseType("blob")
            .on('progress', (e) =>
            {
                // console.log('progress', e);
            })
            .end((err, res) =>
            {
                if (err || res.status !== 200)
                {
                    callback(true);
                }
                else
                {
                    // let blobObj = new Blob([res.xhr.response], { type: res.type });
                    let url = window.URL.createObjectURL(res.xhr.response);
                }

                // dispatch(
                // {
                //     type: types.FILE_GET,
                //     data: null
                // });
            });
    };
}

// fileImageUpload
/**
 * [檔案上傳]
 */
export function fileUpload(files, callback)
{
    return (dispatch, getState) =>
    {
        let token = getState().user.token;
        for (let key in files)
        {
            (function(key)
            {
                let exifdata = files[key].exifdata;
                let gpsLongitude = "";
                let gpsLatitude = "";
                if (exifdata.GPSLongitude !== null && exifdata.GPSLongitude !== undefined)
                {
                    let degree = exifdata.GPSLongitude[0].numerator;
                    let minutes = exifdata.GPSLongitude[1].numerator / exifdata.GPSLongitude[1].denominator / 60;
                    let seconds = exifdata.GPSLongitude[2].numerator / exifdata.GPSLongitude[2].denominator / 3600;
                    gpsLongitude = degree + minutes + seconds;
                }
                if (exifdata.GPSLatitude !== null && exifdata.GPSLatitude !== undefined)
                {
                    let degree = exifdata.GPSLatitude[0].numerator;
                    let minutes = exifdata.GPSLatitude[1].numerator / exifdata.GPSLatitude[1].denominator / 60;
                    let seconds = exifdata.GPSLatitude[2].numerator / exifdata.GPSLatitude[2].denominator / 3600;
                    gpsLatitude = degree + minutes + seconds;
                }

                let geoposition = "[" + gpsLongitude + "," + gpsLatitude + "]";
                request.post(URL_FILE)
                    .attach('image', files[key])
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer ' + token)
                    .field('ctime', new Date().getTime())
                    .field('geoposition', geoposition)
                    .on('progress', function(e)
                    {
                        // console.log(e.percent);
                        // dispatch(
                        // {
                        //     type: types.FILE_IMAGE_UPLOAD_PROGRESS,
                        //     data: e.percent
                        // });
                    })
                    .end((err, res) =>
                    {
                        if (err || res.status !== 200 || res.body.result !== 1)
                        {
                            callback(true);
                        }
                        else
                        {
                            res.body.data.dataUrl = files[key].dataUrl;
                            res.body.data.preview = files[key].preview;
                            dispatch(
                            {
                                type: types.FILE_LIST_ADD,
                                data: res.body.data
                            });
                            callback(null, res.body.data.fid, files[key].blobObj);
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
    let url = URL_FILE + fid;
    return (dispatch, getState) =>
    {
        request.del(url)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .end((err, res) =>
            {
                if (err || res.status !== 200 || res.body.result !== 1)
                {
                    callback(true);
                }
                else
                {
                    dispatch(
                    {
                        type: types.FILE_LIST_DEL,
                        data: [fid]
                    });
                }
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
        request.put(URL_FILE_DELETE)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send(fids)
            .end((err, res) =>
            {
                if (err || res.status !== 200 || res.body.result !== 1)
                {
                    callback(true);
                }
                else
                {
                    dispatch(
                    {
                        type: types.FILE_LIST_DEL,
                        data: fids
                    });
                }
            });
    };
}

// fileThumbnailUpload
/**
 * [縮圖上傳]
 */
export function fileThumbnailUpload(fid, blobObj, callback)
{
    let url = URL_FILE + fid + "/thumbnail";
    return (dispatch, getState) =>
    {
        request.post(url)
            .attach('image', blobObj)
            .set('Accept', 'application/json')
            .end((err, res) =>
            {
                if (err || res.status !== 200 || res.body.result !== 1)
                {
                    callback(true);
                }
                else
                {
                    callback(null);
                }
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

import Exif from 'exif-js';
import { edgeCheck, ieCheck, safariCheck } from './browser';

// imageAndVideoArrayGet
export function imageAndVideoArrayGet(files)
{
    let newFiles = [];
    let illegalFiles = [];
    for (let key in files)
    {
        if (files[key].type.indexOf("video") !== -1 || files[key].type.indexOf("image") !== -1)
        {
            newFiles.push(files[key]);
        }
        else
        {
            illegalFiles.push(files[key]);
        }
    }
    return {
        newFiles,
        illegalFiles
    };
}

// exifAdd
export function exifAdd(files, callback)
{
    let number = 0;
    let total = files.length;
    for (let key in files)
    {
        key = parseInt(key);
        (function(key)
        {
            Exif.getData(files[key], () =>
            {
                number++;
                if (total === number)
                {
                    callback(null);
                }
            });
        })(key);
    }
}

// imageThumbnail
export function imageThumbnail(files, callback)
{
    let overNumber = 0;
    let total = files.length;
    for (let key in files)
    {
        (function(key)
        {
            if (files[key].type.indexOf("video") !== -1)
            {
                overNumber++;
                if (total === overNumber)
                {
                    callback(null);
                }
            }
            else
            {
                let type = files[key].type;
                let quality = 0.7;
                let img = document.createElement('img');
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                img.src = files[key].preview;
                img.onload = function()
                {
                    let percent = this.width / this.height;
                    if (this.width > this.height)
                    {
                        canvas.width = 320;
                        canvas.height = 320 / percent;
                        ctx.drawImage(img, 0, 0, 320, 320 / percent);
                    }
                    else
                    {
                        canvas.width = 320 * percent;
                        canvas.height = 320;
                        ctx.drawImage(img, 0, 0, 320 * percent, 320);
                    }

                    let dataUrl = canvas.toDataURL(type, quality);
                    files[key].dataUrl = dataUrl;

                    // base64 to blob object
                    let binary = atob(dataUrl.split(',')[1]);
                    let array = [];
                    let binaryLength = binary.length;
                    for (let i = 0; i < binaryLength; i++)
                    {
                        array.push(binary.charCodeAt(i));
                    }
                    files[key].blobObj = new Blob([new Uint8Array(array)],
                    {
                        type: type
                    });

                    overNumber++;
                    if (total === overNumber)
                    {
                        callback(null);
                    }
                };
            }
        })(key);
    }
}

// videoThumbnail
export function videoThumbnail(files, callback)
{
    let overNumber = 0;
    let total = files.length;
    for (let key in files)
    {
        (function(key)
        {
            if (files[key].type.indexOf("image") !== -1)
            {
                overNumber++;
                if (total === overNumber)
                {
                    callback(null);
                }
            }
            else
            {
                let video = document.createElement("video");
                video.src = files[key].preview;
                if(ieCheck() || safariCheck())
                {
                    setTimeout(() => {
                        drawVideo(files[key], video, () => {
                            overNumber++;
                            if (total === overNumber)
                            {
                                callback(null);
                            }
                        });
                    }, 200);
                }
                else
                {
                    drawVideo(files[key], video, () => {
                        overNumber++;
                        if (total === overNumber)
                        {
                            callback(null);
                        }
                    });
                }
            }
        })(key);
    }
}


function drawVideo(file, video, cb)
{
    video.addEventListener("loadedmetadata", function(e)
    {
        this.currentTime = 1;
    }, false);

    video.addEventListener("loadeddata", function(e)
    {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        setTimeout(() =>
        {
            let videoWidth = this.videoWidth;
            let videoHeight = this.videoHeight;
            let percent = videoWidth / videoHeight;
            if (videoWidth > videoHeight)
            {
                this.width = canvas.width = 320;
                this.height = canvas.height = 320 / percent;
                ctx.drawImage(this, 0, 0, 320, 320 / percent);
            }
            else
            {
                this.width = canvas.width = 320 * percent;
                this.height = canvas.height = 320;
                ctx.drawImage(this, 0, 0, 320 * percent, 320);
            }

            let quality = 0.7;
            let dataUrl = canvas.toDataURL('image/jpeg', quality);
            file.dataUrl = dataUrl;

            // base64 to blob object
            let binary = atob(dataUrl.split(',')[1]);
            let array = [];
            let binaryLength = binary.length;
            for (let i = 0; i < binaryLength; i++)
            {
                array.push(binary.charCodeAt(i));
            }
            file.blobObj = new Blob([new Uint8Array(array)],
            {
                type: 'image/jpeg'
            });

            cb(null);

        }, (edgeCheck() || ieCheck() || safariCheck())? 220 : 10);
    });
}

import crypto from 'crypto';

export function hashCashGet(path)
{
    let now = new Date().getTime();
    let hashcashCode;
    for (let i = 0; i < 100000; i++)
    {
        let hex = crypto.createHash('sha1').update(path + ":" + now + ":" + i).digest("hex");
        if (hex.substring(0, 3) === '000')
        {
            hashcashCode = now + ":" + i;
            break;
        }
    }

    return hashcashCode;
}

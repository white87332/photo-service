import * as types from '../constants/actionTypes';
import { URL_LOGIN_SHA1, URL_LOGIN } from '../constants/constants';
import { hashCashGet } from '../utils/hashCash';
import crypto from 'crypto';
import request from 'superagent';

// userLogin
export function userLogin(name, pwd, callback)
{
    let data = {
        account: name,
        password: crypto.createHash('md5').update(pwd + ":iSunCloud").digest("hex")
    };

    return (dispatch, getState) =>
    {
        let hashCash = hashCashGet(URL_LOGIN_SHA1);
        request.post(URL_LOGIN)
            .set('Hashcash', hashCash)
            .set('Accept', 'application/json')
            .set('content-type', 'application/json')
            .send(data)
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
                        type: types.USER_LOGIN_SUCCESS,
                        data: res.body.data
                    });
                    callback(null, res.body.data);
                }
            });
    };
}

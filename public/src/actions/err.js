import * as types from '../constants/actionTypes';

export function errMessage()
{
    return (dispatch) =>
    {
        dispatch(
        {
            type: types.ERR_MESSAGE
        });
    };
}

import objectAssign from 'object-assign';
import * as types from '../constants/actionTypes';

const initialState = {};

export default function posts(state = initialState, action = {})
{
    switch (action.type)
    {
        case types.USER_LOGIN_SUCCESS:
            return objectAssign({}, state, action.data);
        default:
            return state;
    }
}

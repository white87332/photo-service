import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import user from './user';
import file from './file';

const rootReducer = combineReducers(
{
    user,
    file,
    routing
});

export default rootReducer;

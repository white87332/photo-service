import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import file from './file';

const rootReducer = combineReducers(
{
    file,
    routing
});

export default rootReducer;

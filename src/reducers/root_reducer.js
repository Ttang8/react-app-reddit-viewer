import {combineReducers} from 'redux';
import PostReducer from './post_reducer';
import ErrorReducer from './error_reducer';

const rootReducer = combineReducers({
  posts: PostReducer,
  errors: ErrorReducer,
});

export default rootReducer;

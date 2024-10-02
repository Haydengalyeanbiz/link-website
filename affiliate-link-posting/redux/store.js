import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import amazonReducer from '../redux/amazonReducer';
import postsReducer from '../redux/postsReducer';
import authReducer from '../redux/authReducer';

const rootReducer = combineReducers({
	amazon: amazonReducer,
	posts: postsReducer,
	user: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

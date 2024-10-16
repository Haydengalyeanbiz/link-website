import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import amazonReducer from './amazonReducer';
import postsReducer from './postsReducer';
import authReducer from './authReducer';

const rootReducer = combineReducers({
	amazon: amazonReducer,
	posts: postsReducer,
	user: authReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

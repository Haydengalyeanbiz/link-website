// ? --------- ACTIONS -----------
export const FETCH_POSTS_PENDING = 'FETCH_POSTS_PENDING';
export const FETCH_POSTS_FULFILLED = 'FETCH_POSTS_FULFILLED';
export const FETCH_POSTS_REJECTED = 'FETCH_POSTS_REJECTED';
export const ADD_POST_PENDING = 'ADD_POST_PENDING';
export const ADD_POST_FULFILLED = 'ADD_POST_FULFILLED';
export const ADD_POST_REJECTED = 'ADD_POST_REJECTED';

// ? --------- ACTION CREATORS -----------
export const fetchPostsPending = () => ({
	type: FETCH_POSTS_PENDING,
});

export const fetchPostsFulfilled = (posts) => ({
	type: FETCH_POSTS_FULFILLED,
	payload: posts,
});

export const fetchPostsRejected = (error) => ({
	type: FETCH_POSTS_REJECTED,
	payload: error,
});

export const addPostPending = () => ({
	type: ADD_POST_PENDING,
});

export const addPostFulfilled = (post) => ({
	type: ADD_POST_FULFILLED,
	payload: post,
});

export const addPostRejected = (error) => ({
	type: ADD_POST_REJECTED,
	payload: error,
});

// ! --------- THUNKS -----------
import { supabase } from '../supabaseClient';

// ? FETCH ALL POSTS THUNK
export const fetchPosts = () => async (dispatch) => {
	dispatch(fetchPostsPending());

	try {
		const { data, error } = await supabase.from('posts').select('*');
		if (error) throw error;
		dispatch(fetchPostsFulfilled(data));
	} catch (error) {
		dispatch(fetchPostsRejected(error.message));
	}
};

// ? ADD NEW POST THUNK
export const addNewPost = (newPost) => async (dispatch) => {
	dispatch(addPostPending());
	try {
		const { error, data } = await supabase.from('posts').insert([newPost]);

		if (error) {
			throw error;
		}

		dispatch(addPostFulfilled(data));
	} catch (error) {
		dispatch(addPostRejected(error.message));
	}
};

// ! ---------- INITIAL STATE --------------

const initialState = {
	posts: [],
	status: 'idle',
	error: null,
};

// ! ---------- AMAZON REDUCER --------------
export const postsReducer = (state = initialState, action) => {
	switch (action.type) {
		case FETCH_POSTS_PENDING:
			return {
				...state,
				status: 'loading',
				error: null,
			};
		case FETCH_POSTS_FULFILLED:
			return {
				...state,
				status: 'succeeded',
				posts: action.payload,
			};
		case FETCH_POSTS_REJECTED:
			return {
				...state,
				status: 'failed',
				error: action.payload,
			};
		case ADD_POST_PENDING:
			return {
				...state,
				status: 'loading',
				error: null,
			};
		case ADD_POST_FULFILLED:
			return {
				...state,
				status: 'succeeded',
				posts: [...state.posts, action.payload],
			};
		case ADD_POST_REJECTED:
			return {
				...state,
				status: 'failed',
				error: action.payload,
			};
		default:
			return state;
	}
};

export default postsReducer;

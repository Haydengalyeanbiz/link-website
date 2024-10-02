// ? --------- ACTIONS -----------
export const FETCH_POSTS_PENDING = 'FETCH_POSTS_PENDING';
export const FETCH_POSTS_FULFILLED = 'FETCH_POSTS_FULFILLED';
export const FETCH_POSTS_REJECTED = 'FETCH_POSTS_REJECTED';

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

// ! --------- THUNKS -----------
import { supabase } from '../src/supabaseClient';

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
		default:
			return state;
	}
};

export default postsReducer;

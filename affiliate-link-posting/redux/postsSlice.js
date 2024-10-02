import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../src/supabaseClient';

const initialState = {
	posts: [],
	status: 'idle',
	error: null,
};

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data, error } = await supabase.from('posts').select('*');
	if (error) throw new Error(error.message);
	return data;
});

export const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(fetchPosts.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.posts = action.payload;
			})
			.addCase(fetchPosts.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchPosts.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			});
	},
});

export default postsSlice.reducer;
